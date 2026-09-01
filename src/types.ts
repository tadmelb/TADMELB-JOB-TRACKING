export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isCloudConnected?: boolean;
}

export type ProjectStatus = 'urgent' | 'confirmed' | 'in_progress' | 'completed' | 'on_hold' | 'pending';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkflowTask {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface SiteLog {
  id: string;
  date: string;
  author: string;
  note: string;
  weather?: string;
}

export type PhotoCategory = 'before' | 'during' | 'after' | 'drawing' | 'receipt' | 'general';

export interface ProjectPhoto {
  id: string;
  url: string; // Base64 data url or image link
  caption?: string;
  category: PhotoCategory;
  uploadedAt: string;
  name?: string;
  size?: number;
}

export interface WorkSection {
  id: string;
  title: string;           // e.g. "Front Colorbond Fence", "Merbau Decking", "Skillion Pergola"
  dimensions?: string;     // e.g. "36m length x 1.8m height", "5.5m x 4.2m"
  materials?: string;      // e.g. "Monument Trimdek sheets, 65x65 steel posts, concrete plinths"
  specifications?: string; // e.g. "Dig 650mm post holes, 2 plinths underneath, self closing latch"
  notes?: string;
}

export interface Project {
  id: string;
  userId?: string;          // User ID who created/owns this project
  projectNumber: string;
  title: string;
  status: ProjectStatus;
  priority: ProjectPriority;

  // Client & Location Details
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  siteAddress: string;
  suburb: string;
  postcode?: string;
  accessNotes?: string;

  // Work Scope & Multi-Part Sections (Combo / Package support)
  sections: WorkSection[];

  // Technical Specifications & Manual Framing Fields
  colour?: string;          // e.g. "Colorbond Monument", "Merbau Natural Oil"
  colourHex?: string;       // Visual color swatch
  dimensions?: string;      // Overall dimensions or summary
  style?: string;           // Quick style descriptor
  materialsSummary?: string;// Materials & hardware list
  siteInstructions?: string;// Detailed technical instructions for field builders/workers

  // Schedule & Dates
  createdAt: string;
  scheduledStartDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  siteVisitDate?: string;

  // Progress tracking
  progressPercentage: number;
  workflowTasks: WorkflowTask[];
  siteLogs?: SiteLog[];
  photos?: ProjectPhoto[];

  // General notes
  notes: string;
}

export interface FilterOptions {
  status: 'all' | ProjectStatus;
  searchQuery: string;
  sortBy: 'date_desc' | 'date_asc' | 'progress';
}
