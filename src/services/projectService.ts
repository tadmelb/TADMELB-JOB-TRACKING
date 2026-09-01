import { 
  db, 
  auth,
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs
} from '../lib/firebase';
import { getDocFromServer } from 'firebase/firestore';
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../data/sampleProjects';

const PROJECTS_COLLECTION = 'projects';
const LOCAL_STORAGE_KEY = 'tadmelb_trade_projects_v2';
const INITIAL_SEEDED_KEY = 'tadmelb_initial_seeded_flag';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Sync Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test initial connection to Firestore
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('client is offline')) {
      console.warn('Firestore is running in offline-first cache mode.');
    }
    return false;
  }
}

// Run connection test non-blockingly
testFirestoreConnection();

// Recursively clean object to remove undefined values before sending to Firestore
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirestore(item));
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = cleanForFirestore(val);
      }
    }
    return cleaned;
  }
  return obj;
}

// Helper to get local cache
export function getLocalProjects(): Project[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local projects:', err);
  }
  return INITIAL_PROJECTS;
}

// Helper to save local cache
export function saveLocalProjects(projects: Project[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error caching projects locally:', err);
  }
}

// Real-time listener for Firestore projects with automatic bidirectional synchronization
export function subscribeToProjects(
  userId: string | null,
  onUpdate: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const projectsCol = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Project[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              ...data
            } as Project);
          });
          saveLocalProjects(list);
          onUpdate(list);
        } else {
          // If Firestore is empty, seed existing local projects to Google Cloud Firestore
          const localList = getLocalProjects();
          if (localList && localList.length > 0) {
            onUpdate(localList);
            seedInitialProjectsToFirestore(userId || 'tadmelb_user', localList).catch(console.error);
          } else {
            saveLocalProjects([]);
            onUpdate([]);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
        // Fallback to local storage so user experience is never interrupted
        const localList = getLocalProjects();
        onUpdate(localList);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
    onUpdate(getLocalProjects());
    return () => {};
  }
}

// Seed all local projects to Google Cloud Firestore
export async function seedInitialProjectsToFirestore(userId: string, projects: Project[]): Promise<void> {
  try {
    for (const p of projects) {
      const projectDoc = doc(db, PROJECTS_COLLECTION, p.id);
      const cleanData = cleanForFirestore({
        ...p,
        userId: userId || 'tadmelb_user',
        updatedAt: new Date().toISOString()
      });
      await setDoc(projectDoc, cleanData, { merge: true });
    }
    console.log(`[Cloud Sync] Synchronized ${projects.length} projects to Google Cloud.`);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, PROJECTS_COLLECTION);
  }
}

// Explicit sync all current projects to Google Cloud Firestore
export async function syncAllProjectsToCloud(userId?: string | null): Promise<boolean> {
  try {
    const current = getLocalProjects();
    await seedInitialProjectsToFirestore(userId || 'tadmelb_user', current);
    return true;
  } catch (err) {
    console.error('Failed to sync all projects to Cloud:', err);
    return false;
  }
}

// Save or Update a project in Firestore + LocalStorage
export async function saveProject(project: Project, userId?: string | null): Promise<void> {
  // 1. Update local cache immediately for instant UI responsiveness & zero loss
  const localList = getLocalProjects();
  const index = localList.findIndex((p) => p.id === project.id);
  let updatedList: Project[];
  if (index >= 0) {
    updatedList = [...localList];
    updatedList[index] = project;
  } else {
    updatedList = [project, ...localList];
  }
  saveLocalProjects(updatedList);

  // 2. Sync to Google Cloud Firestore with cleaned data
  try {
    const projectDoc = doc(db, PROJECTS_COLLECTION, project.id);
    const cleanData = cleanForFirestore({
      ...project,
      userId: userId || auth.currentUser?.uid || 'tadmelb_user',
      updatedAt: new Date().toISOString()
    });
    await setDoc(projectDoc, cleanData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PROJECTS_COLLECTION}/${project.id}`);
  }
}

// Delete a project from Firestore + LocalStorage
export async function deleteProject(projectId: string): Promise<void> {
  // 1. Remove from local storage
  const localList = getLocalProjects().filter((p) => p.id !== projectId);
  saveLocalProjects(localList);

  // 2. Delete from Google Cloud Firestore
  try {
    const projectDoc = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectDoc);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PROJECTS_COLLECTION}/${projectId}`);
  }
}

