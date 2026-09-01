import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, UserSession } from './types';
import { INITIAL_PROJECTS } from './data/sampleProjects';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectListView } from './components/ProjectListView';
import { CalendarView } from './components/CalendarView';
import { ProjectDetailModal, DetailTabType } from './components/ProjectDetailModal';
import { NewProjectModal } from './components/NewProjectModal';
import { JobSheetPrintModal } from './components/JobSheetPrintModal';
import { AuthModal } from './components/AuthModal';
import { 
  subscribeToProjects, 
  saveProject, 
  deleteProject as deleteProjectFromDb,
  getLocalProjects,
  saveLocalProjects,
  syncAllProjectsToCloud
} from './services/projectService';
import { auth, onAuthStateChanged, signOut, User } from './lib/firebase';
import { getStoredUserSession, clearUserSession, onUserSessionChanged } from './lib/session';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  // Auth state
  const [user, setUser] = useState<UserSession | User | null>(() => getStoredUserSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Projects state initialized from local cache or fallback
  const [projects, setProjects] = useState<Project[]>(() => {
    return getLocalProjects();
  });

  // UI state
  const [currentView, setCurrentView] = useState<'board' | 'list' | 'calendar'>('board');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<DetailTabType>('specs');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectInitialStatus, setNewProjectInitialStatus] = useState<ProjectStatus>('urgent');
  const [printProject, setPrintProject] = useState<Project | null>(null);
  const [isPrintJobSheetOpen, setIsPrintJobSheetOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleManualCloudSync = async () => {
    setIsSyncing(true);
    try {
      const success = await syncAllProjectsToCloud(user?.uid);
      if (success) {
        showToast('✓ Đã đồng bộ toàn bộ dự án lên Google Cloud thành công!');
      } else {
        showToast('⚠️ Đang lưu dữ liệu offline và sẽ tự động đồng bộ khi có kết nối.');
      }
    } catch (err) {
      showToast('⚠️ Đã lưu bộ nhớ cục bộ, đang kết nối lại Google Cloud.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSelectProject = (project: Project, tab: DetailTabType = 'specs') => {
    setSelectedProject(project);
    setSelectedTab(tab);
  };

  // Listen to Firebase Auth and Local Cloud Session state
  useEffect(() => {
    // 1. Firebase Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const stored = getStoredUserSession();
        setUser(stored);
      }
    });

    // 2. Custom Session listener
    const unsubscribeSession = onUserSessionChanged((session) => {
      if (session) {
        setUser(session);
      } else if (!auth.currentUser) {
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSession();
    };
  }, []);

  // Listen to real-time project updates from Firestore
  useEffect(() => {
    const unsubscribeProjects = subscribeToProjects(
      user?.uid || null,
      (syncedProjects) => {
        setProjects(syncedProjects);
      },
      (err) => {
        console.warn('Real-time sync alert:', err);
      }
    );

    return () => unsubscribeProjects();
  }, [user]);

  // Project handlers
  const handleCreateProject = async (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    showToast(`✓ Đã tạo thành công công trình ${newProject.projectNumber}!`);
    await saveProject(newProject, user?.uid);
  };

  const handleUpdateProject = async (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedProject && selectedProject.id === updated.id) {
      setSelectedProject(updated);
    }
    showToast(`✓ Đã cập nhật công trình ${updated.projectNumber}!`);
    await saveProject(updated, user?.uid);
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: ProjectStatus) => {
    const target = projects.find(p => p.id === projectId);
    if (!target) return;

    const updated: Project = {
      ...target,
      status: newStatus,
      actualCompletionDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : target.actualCompletionDate,
      progressPercentage: newStatus === 'completed' ? 100 : target.progressPercentage
    };

    setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(updated);
    }
    showToast(`✓ Cập nhật trạng thái thành công!`);
    await saveProject(updated, user?.uid);
  };

  const handleDeleteProject = async (projectId: string) => {
    const target = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }
    showToast(`✓ Đã xóa công trình ${target ? target.projectNumber : ''} khỏi hệ thống!`);
    await deleteProjectFromDb(projectId);
  };

  const handleOpenNewProjectWithStatus = (status: ProjectStatus) => {
    setNewProjectInitialStatus(status);
    setIsNewProjectOpen(true);
  };

  const handleOpenPrintJobSheet = (project: Project) => {
    setPrintProject(project);
    setIsPrintJobSheetOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
    clearUserSession();
    setUser(null);
    showToast('Đã đăng xuất tài khoản trên thiết bị này');
  };

  // Backup & Restore handlers
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tadmelb_projects_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✓ Đã xuất dữ liệu dự án ra file JSON!');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            setProjects(imported);
            saveLocalProjects(imported);
            for (const p of imported) {
              await saveProject(p, user?.uid);
            }
            showToast(`✓ Đã nhập thành công ${imported.length} dự án!`);
          } else {
            alert('File backup không đúng định dạng');
          }
        } catch (err) {
          alert('Không thể đọc file JSON');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetSampleData = async () => {
    if (window.confirm('Khôi phục danh sách các công trình mẫu thực tế?')) {
      setProjects(INITIAL_PROJECTS);
      saveLocalProjects(INITIAL_PROJECTS);
      for (const p of INITIAL_PROJECTS) {
        await saveProject(p, user?.uid);
      }
      showToast('✓ Đã khôi phục dữ liệu mẫu!');
    }
  };

  // Filter projects by status and search query
  const filteredProjects = projects.filter(p => {
    // Status filter
    if (selectedStatusFilter !== 'all') {
      if (selectedStatusFilter === 'urgent') {
        if (p.status !== 'urgent' && p.status !== 'pending') return false;
      } else if (p.status !== selectedStatusFilter) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClient = p.clientName?.toLowerCase().includes(q);
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchAddress = p.siteAddress?.toLowerCase().includes(q) || p.suburb?.toLowerCase().includes(q);
      const matchStyle = p.style?.toLowerCase().includes(q);
      const matchColour = p.colour?.toLowerCase().includes(q);
      const matchNumber = p.projectNumber?.toLowerCase().includes(q);
      const matchPhone = p.clientPhone?.toLowerCase().includes(q);
      const matchSections = p.sections?.some(s => 
        s.title.toLowerCase().includes(q) || 
        s.materials?.toLowerCase().includes(q) || 
        s.specifications?.toLowerCase().includes(q)
      );

      return matchClient || matchTitle || matchAddress || matchStyle || matchColour || matchNumber || matchPhone || matchSections;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNewProject={() => {
          setNewProjectInitialStatus('urgent');
          setIsNewProjectOpen(true);
        }}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetSampleData={handleResetSampleData}
        totalProjectsCount={projects.length}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onManualCloudSync={handleManualCloudSync}
        isSyncing={isSyncing}
      />

      {/* Main App Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* KPI Stats Overview Cards */}
        <StatsOverview
          projects={projects}
          selectedStatusFilter={selectedStatusFilter}
          onSelectStatusFilter={(st) => setSelectedStatusFilter(selectedStatusFilter === st ? 'all' : st)}
        />

        {/* View Content based on active tab */}
        {currentView === 'board' && (
          <KanbanBoard
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
            onUpdateProjectStatus={handleUpdateProjectStatus}
            onOpenNewProjectWithStatus={handleOpenNewProjectWithStatus}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {currentView === 'list' && (
          <ProjectListView
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
            onUpdateProjectStatus={handleUpdateProjectStatus}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            projects={filteredProjects}
            onSelectProject={(p) => handleSelectProject(p, 'specs')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            TADMELB Trade Hub • Quản Lý Thi Công & Quy Cách Kỹ Thuật Công Trình
          </span>
          <span className="text-slate-400">
            {projects.length} Công Trình Đang Chạy • Đồng Bộ Đám Mây & Thiết Bị Di Động
          </span>
        </div>
      </footer>

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          initialTab={selectedTab}
          onClose={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onOpenPrintSheet={handleOpenPrintJobSheet}
        />
      )}

      {isNewProjectOpen && (
        <NewProjectModal
          isOpen={isNewProjectOpen}
          onClose={() => setIsNewProjectOpen(false)}
          onSaveProject={handleCreateProject}
          initialStatus={newProjectInitialStatus}
        />
      )}

      {isPrintJobSheetOpen && printProject && (
        <JobSheetPrintModal
          project={printProject}
          isOpen={isPrintJobSheetOpen}
          onClose={() => {
            setIsPrintJobSheetOpen(false);
            setPrintProject(null);
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultEmail="tadmelbconstruction@gmail.com"
          onAuthSuccess={(email) => {
            showToast(`✓ Đã kết nối Đám Mây: ${email}`);
          }}
        />
      )}

    </div>
  );
}

export default App;
