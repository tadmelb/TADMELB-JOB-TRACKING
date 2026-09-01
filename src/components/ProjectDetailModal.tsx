import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectStatus, ProjectPriority, WorkflowTask, WorkSection, ProjectPhoto, PhotoCategory } from '../types';
import { getStatusMeta, formatDate, formatDateTime, getCanberraCurrentDateString, getGoogleMapsUrl, calculateProgress } from '../utils/helpers';
import { COLOUR_PRESETS, WORK_SECTION_TEMPLATES, getDefaultWorkflow } from '../data/presets';
import { compressImageFile, PHOTO_CATEGORIES, getPhotoCategoryMeta, formatFileSize } from '../utils/imageUtils';
import { 
  X, 
  Printer, 
  Trash2, 
  MapPin, 
  CheckSquare, 
  Plus, 
  Layers, 
  Hammer, 
  FileText, 
  Save,
  Palette,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  User,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Camera,
  Upload,
  Image as ImageIcon,
  Download,
  Eye,
  Edit2,
  Filter,
  Maximize2
} from 'lucide-react';

export type DetailTabType = 'specs' | 'client' | 'tasks' | 'photos' | 'all';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  initialTab?: DetailTabType;
  onClose: () => void;
  onUpdateProject: (updatedProject: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenPrintSheet: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  initialTab = 'specs',
  onClose,
  onUpdateProject,
  onDeleteProject,
  onOpenPrintSheet
}) => {
  if (!isOpen || !project) return null;

  // Selected Tab in Full-screen view
  const [activeTab, setActiveTab] = useState<DetailTabType>(initialTab);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Track currently loaded project ID to prevent overwriting user input during tab navigation
  const currentLoadedIdRef = useRef<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [title, setTitle] = useState(project.title || '');
  const [status, setStatus] = useState<ProjectStatus>(project.status || 'in_progress');
  const [priority, setPriority] = useState<ProjectPriority>(project.priority || 'medium');

  // Client Details
  const [clientName, setClientName] = useState(project.clientName || '');
  const [clientPhone, setClientPhone] = useState(project.clientPhone || '');
  const [clientEmail, setClientEmail] = useState(project.clientEmail || '');
  const [siteAddress, setSiteAddress] = useState(project.siteAddress || '');
  const [suburb, setSuburb] = useState(project.suburb || '');
  const [accessNotes, setAccessNotes] = useState(project.accessNotes || '');

  // Work Sections (Multi-part support)
  const [sections, setSections] = useState<WorkSection[]>(() => {
    if (project.sections && project.sections.length > 0) {
      return project.sections;
    }
    return [
      {
        id: `sec-${Date.now()}`,
        title: project.style || 'Hạng mục chính',
        dimensions: project.dimensions || '',
        materials: project.materialsSummary || '',
        specifications: project.notes || '',
        notes: ''
      }
    ];
  });

  // Specifications
  const [colour, setColour] = useState(project.colour || 'Colorbond Monument');
  const [colourHex, setColourHex] = useState(project.colourHex || '#33373B');
  const [siteInstructions, setSiteInstructions] = useState(project.siteInstructions || '');
  const [notes, setNotes] = useState(project.notes || '');

  // Schedule
  const [scheduledStartDate, setScheduledStartDate] = useState(project.scheduledStartDate || '');
  const [targetCompletionDate, setTargetCompletionDate] = useState(project.targetCompletionDate || '');

  // Workflow Tasks
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>(
    project.workflowTasks && project.workflowTasks.length > 0
      ? project.workflowTasks
      : getDefaultWorkflow()
  );

  // Quick inputs
  const [newTaskLabel, setNewTaskLabel] = useState('');

  // Project Photos State
  const [photos, setPhotos] = useState<ProjectPhoto[]>(project.photos || []);
  const [selectedPhotoFilter, setSelectedPhotoFilter] = useState<'all' | PhotoCategory>('all');
  const [activeUploadCategory, setActiveUploadCategory] = useState<PhotoCategory>('during');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);
  
  // Lightbox & Edit Caption State
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editCaptionText, setEditCaptionText] = useState('');

  // Refs for upload inputs
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync initial tab when changed from props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sync state ONLY when switching to a different project or newly opening
  useEffect(() => {
    if (project && project.id !== currentLoadedIdRef.current) {
      currentLoadedIdRef.current = project.id;
      
      setTitle(project.title || '');
      setStatus(project.status || 'in_progress');
      setPriority(project.priority || 'medium');
      setClientName(project.clientName || '');
      setClientPhone(project.clientPhone || '');
      setClientEmail(project.clientEmail || '');
      setSiteAddress(project.siteAddress || '');
      setSuburb(project.suburb || '');
      setAccessNotes(project.accessNotes || '');
      
      if (project.sections && project.sections.length > 0) {
        setSections(project.sections);
      } else {
        setSections([
          {
            id: `sec-${Date.now()}`,
            title: project.style || 'Hạng mục chính',
            dimensions: project.dimensions || '',
            materials: project.materialsSummary || '',
            specifications: project.notes || '',
            notes: ''
          }
        ]);
      }

      setColour(project.colour || 'Colorbond Monument');
      setColourHex(project.colourHex || '#33373B');
      setSiteInstructions(project.siteInstructions || '');
      setNotes(project.notes || '');
      setScheduledStartDate(project.scheduledStartDate || '');
      setTargetCompletionDate(project.targetCompletionDate || '');
      setWorkflowTasks(
        project.workflowTasks && project.workflowTasks.length > 0
          ? project.workflowTasks
          : getDefaultWorkflow()
      );
      setPhotos(project.photos || []);
      setSaveSuccess(false);
      setLightboxPhotoIndex(null);
    }
  }, [project?.id, isOpen]);

  // Scroll helpers
  const handleScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Save changes handler
  const handleSaveAll = (closeAfter: boolean = false) => {
    const calculatedProg = calculateProgress(workflowTasks);
    const overallDims = sections.map(s => s.dimensions).filter(Boolean).join(' | ');

    const updated: Project = {
      ...project,
      title: title.trim() || project.title,
      status,
      priority,
      clientName: clientName.trim() || project.clientName,
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      siteAddress: siteAddress.trim() || project.siteAddress,
      suburb: suburb.trim() || project.suburb,
      accessNotes: accessNotes.trim(),
      sections,
      colour,
      colourHex,
      dimensions: overallDims,
      style: sections[0]?.title || project.style,
      materialsSummary: sections.map(s => s.materials).filter(Boolean).join('; '),
      siteInstructions: siteInstructions.trim(),
      notes: notes.trim(),
      scheduledStartDate: scheduledStartDate || undefined,
      targetCompletionDate: targetCompletionDate || undefined,
      workflowTasks,
      photos,
      progressPercentage: calculatedProg
    };

    onUpdateProject(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    if (closeAfter) {
      onClose();
    }
  };

  // Complete and purge project from system
  const handleCompleteAndDelete = () => {
    const confirmMsg = `XÁC NHẬN HOÀN THÀNH & XÓA KHỎI HỆ THỐNG:\n\nBạn có chắc chắn muốn HOÀN THÀNH và XÓA toàn bộ dữ liệu của công trình:\n"${project.projectNumber} - ${project.title}" (${project.clientName})?\n\nDữ liệu sẽ được đóng lại và xóa sạch khỏi hệ thống.`;
    if (window.confirm(confirmMsg)) {
      onDeleteProject(project.id);
      onClose();
    }
  };

  // Regular delete handler
  const handleDeleteOnly = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dự án ${project.projectNumber} - ${project.title}?`)) {
      onDeleteProject(project.id);
      onClose();
    }
  };

  // Section handling
  const handleAddSection = () => {
    const nextIdx = sections.length + 1;
    const newSec: WorkSection = {
      id: `sec-${Date.now()}`,
      title: `Hạng mục ${nextIdx}: `,
      dimensions: '',
      materials: '',
      specifications: '',
      notes: ''
    };
    setSections([...sections, newSec]);
  };

  const handleAddFromTemplate = (tmpl: typeof WORK_SECTION_TEMPLATES[0]) => {
    const nextIdx = sections.length + 1;
    const newSec: WorkSection = {
      id: `sec-${Date.now()}`,
      title: `Hạng mục ${nextIdx}: ${tmpl.title}`,
      dimensions: tmpl.dimensions,
      materials: tmpl.materials,
      specifications: tmpl.specifications,
      notes: ''
    };
    setSections([...sections, newSec]);
  };

  const handleUpdateSection = (idx: number, field: keyof WorkSection, val: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) {
      alert('Dự án cần có ít nhất 1 hạng mục thi công.');
      return;
    }
    setSections(sections.filter((_, i) => i !== idx));
  };

  // Task checklist handling
  const handleToggleTask = (taskId: string) => {
    const updated = workflowTasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? getCanberraCurrentDateString() : undefined
        };
      }
      return t;
    });
    setWorkflowTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;
    const newTask: WorkflowTask = {
      id: `task-${Date.now()}`,
      label: newTaskLabel.trim(),
      completed: false
    };
    setWorkflowTasks([...workflowTasks, newTask]);
    setNewTaskLabel('');
  };

  const handleDeleteTask = (taskId: string) => {
    setWorkflowTasks(workflowTasks.filter(t => t.id !== taskId));
  };

  const handleResetDefaultTasks = () => {
    if (window.confirm('Khôi phục danh sách 9 bước thi công chuẩn?')) {
      setWorkflowTasks(getDefaultWorkflow());
    }
  };

  // =========================================================================
  // PHOTO ATTACHMENT & MANAGEMENT HANDLERS
  // =========================================================================
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    setPhotoFeedback(null);

    try {
      const newPhotos: ProjectPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // Compress image before saving to optimize speed & storage
        const compressed = await compressImageFile(file, 1600, 1600, 0.82);
        
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url: compressed.dataUrl,
          category: activeUploadCategory,
          caption: '',
          uploadedAt: new Date().toISOString(),
          name: compressed.name,
          size: compressed.size
        });
      }

      if (newPhotos.length > 0) {
        const updatedPhotosList = [...newPhotos, ...photos];
        setPhotos(updatedPhotosList);
        
        // Auto update project immediately with new photos
        const updatedProjectData: Project = {
          ...project,
          photos: updatedPhotosList
        };
        onUpdateProject(updatedProjectData);

        setPhotoFeedback(`✓ Đã thêm thành công ${newPhotos.length} ảnh vào công trình!`);
        setTimeout(() => setPhotoFeedback(null), 3000);
      }
    } catch (err: any) {
      setPhotoFeedback(`Lỗi tải ảnh: ${err.message || 'Không thể xử lý tệp'}`);
    } finally {
      setIsUploadingPhoto(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm('Xác nhận xóa ảnh này khỏi hồ sơ công trình?')) {
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      setPhotos(updatedPhotos);
      onUpdateProject({
        ...project,
        photos: updatedPhotos
      });
      if (lightboxPhotoIndex !== null) {
        setLightboxPhotoIndex(null);
      }
    }
  };

  const handleUpdatePhotoCategory = (photoId: string, newCategory: PhotoCategory) => {
    const updated = photos.map(p => {
      if (p.id === photoId) {
        return { ...p, category: newCategory };
      }
      return p;
    });
    setPhotos(updated);
    onUpdateProject({
      ...project,
      photos: updated
    });
  };

  const handleSavePhotoCaption = (photoId: string) => {
    const updated = photos.map(p => {
      if (p.id === photoId) {
        return { ...p, caption: editCaptionText.trim() };
      }
      return p;
    });
    setPhotos(updated);
    setEditingPhotoId(null);
    setEditCaptionText('');
    onUpdateProject({
      ...project,
      photos: updated
    });
  };

  const handleDownloadPhoto = (photo: ProjectPhoto) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name || `TAD_Photo_${project.projectNumber}_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered photos list
  const filteredPhotos = selectedPhotoFilter === 'all'
    ? photos
    : photos.filter(p => p.category === selectedPhotoFilter);

  const statusMeta = getStatusMeta(status);
  const currentProgress = calculateProgress(workflowTasks);
  const completedTaskCount = workflowTasks.filter(t => t.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-2 lg:p-4 overflow-hidden select-text">
      
      {/* Lightbox / Fullscreen Image Viewer Modal */}
      {lightboxPhotoIndex !== null && filteredPhotos[lightboxPhotoIndex] && (
        <div className="fixed inset-0 z-60 flex flex-col bg-slate-950/95 backdrop-blur-md text-white p-3 sm:p-6 select-none animate-fadeIn">
          {/* Lightbox Top Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="font-bold text-sm">
                Ảnh {lightboxPhotoIndex + 1} / {filteredPhotos.length}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getPhotoCategoryMeta(filteredPhotos[lightboxPhotoIndex].category).badgeBg} ${getPhotoCategoryMeta(filteredPhotos[lightboxPhotoIndex].category).textColor}`}>
                {getPhotoCategoryMeta(filteredPhotos[lightboxPhotoIndex].category).label}
              </span>
              <span className="text-xs text-slate-400">
                {formatDate(filteredPhotos[lightboxPhotoIndex].uploadedAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadPhoto(filteredPhotos[lightboxPhotoIndex])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Tải ảnh về máy"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDeletePhoto(filteredPhotos[lightboxPhotoIndex].id)}
                className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors cursor-pointer"
                title="Xóa ảnh"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxPhotoIndex(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Đóng xem ảnh"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Stage with Previous / Next Arrows */}
          <div className="flex-1 min-h-0 relative flex items-center justify-center p-2 sm:p-6">
            {lightboxPhotoIndex > 0 && (
              <button
                type="button"
                onClick={() => setLightboxPhotoIndex(lightboxPhotoIndex - 1)}
                className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-xl transition-all cursor-pointer"
                title="Ảnh trước"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            <img
              src={filteredPhotos[lightboxPhotoIndex].url}
              alt={filteredPhotos[lightboxPhotoIndex].caption || 'Project photo'}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-[94vw] object-contain rounded-2xl shadow-2xl transition-transform"
            />

            {lightboxPhotoIndex < filteredPhotos.length - 1 && (
              <button
                type="button"
                onClick={() => setLightboxPhotoIndex(lightboxPhotoIndex + 1)}
                className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-xl transition-all cursor-pointer"
                title="Ảnh tiếp theo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Lightbox Caption Footer */}
          {filteredPhotos[lightboxPhotoIndex].caption && (
            <div className="text-center py-2 text-sm text-slate-200 bg-slate-900/70 rounded-xl max-w-xl mx-auto px-4">
              📝 {filteredPhotos[lightboxPhotoIndex].caption}
            </div>
          )}
        </div>
      )}

      {/* Main Full-Size Card */}
      <div className="relative w-full h-full sm:h-[96vh] sm:rounded-3xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
        
        {/* =========================================================================
            LEFT COLUMN / SIDEBAR: PROJECT OVERVIEW & QUICK TAB SWITCHER (DESKTOP)
           ========================================================================= */}
        <aside className="w-full md:w-80 lg:w-96 bg-slate-950/95 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto max-h-[42vh] md:max-h-full">
          
          {/* Project Header Summary */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2.5 py-1 rounded-xl">
                  {project.projectNumber}
                </span>
                <span className={`inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-black border ${statusMeta.badgeClass}`}>
                  {statusMeta.labelVi}
                </span>
              </div>

              <div className="flex items-center gap-1.5 md:hidden">
                <button
                  type="button"
                  onClick={() => handleSaveAll(false)}
                  className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                {title || project.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span className="font-bold text-slate-300 truncate">{clientName || project.clientName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{siteAddress || project.siteAddress}, {suburb || project.suburb}</span>
              </div>
            </div>

            {/* Quick Status Selector */}
            <div className="pt-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                Chuyển Trạng Thái:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="urgent">🚨 Urgent Job (Gấp / Làm Ngay)</option>
                <option value="confirmed">Confirmed (Đã Xác Nhận)</option>
                <option value="in_progress">In Progress (Đang Thi Công)</option>
                <option value="completed">Completed (Đã Hoàn Thành)</option>
                <option value="on_hold">On Hold (Tạm Dừng)</option>
              </select>
            </div>
          </div>

          {/* NAVIGATION TABS MENU (DESKTOP) */}
          <div className="p-3 sm:p-4 space-y-1.5 flex-1">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pb-1">
              Các Phần Quản Lý Dự Án
            </div>

            {/* 1. Specs Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('specs');
                handleScrollToTop();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                <span>1. Quy Cách & Hạng Mục</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-black/20 text-[10px]">
                {sections.length} mục
              </span>
            </button>

            {/* 2. Client Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('client');
                handleScrollToTop();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4" />
                <span>2. Khách Hàng & Vị Trí</span>
              </div>
              <MapPin className="h-3.5 w-3.5 opacity-60" />
            </button>

            {/* 3. Tasks Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('tasks');
                handleScrollToTop();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="h-4 w-4" />
                <span>3. Tiến Độ Thi Công</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-black/20 text-[10px] font-mono">
                {currentProgress}%
              </span>
            </button>

            {/* 4. Photos Tab (ATTACH PHOTO OF PROJECT) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('photos');
                handleScrollToTop();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Camera className="h-4 w-4" />
                <span>4. Ảnh Công Trình (Photos)</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-black/20 text-[10px] font-bold">
                📸 {photos.length}
              </span>
            </button>

            {/* 5. View All Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                handleScrollToTop();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-amber-400 shadow-md border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="h-4 w-4" />
                <span>Xem Tất Cả Các Phần</span>
              </div>
              <span className="text-[10px]">Cuộn dọc</span>
            </button>
          </div>

          {/* Action Buttons in Sidebar */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => handleSaveAll(false)}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md ${
                saveSuccess 
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' 
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{saveSuccess ? '✓ ĐÃ LƯU THÀNH CÔNG!' : '💾 LƯU DỰ ÁN NÀY'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSaveAll(false);
                onOpenPrintSheet({
                  ...project,
                  title,
                  clientName,
                  clientPhone,
                  clientEmail,
                  siteAddress,
                  suburb,
                  accessNotes,
                  sections,
                  colour,
                  colourHex,
                  siteInstructions,
                  notes,
                  scheduledStartDate,
                  targetCompletionDate,
                  workflowTasks,
                  photos
                });
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4 text-amber-400" />
              <span>In Job Sheet (Phiếu Thi Công)</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteAndDelete}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl text-xs font-bold bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>✓ Hoàn Thành & Xóa</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleDeleteOnly}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Đóng</span>
              </button>
            </div>
          </div>

        </aside>

        {/* =========================================================================
            MAIN FULL-SCREEN DEDICATED TAB DISPLAY (Optimized for Mobile & Desktop)
           ========================================================================= */}
        <main className="flex-1 min-w-0 min-h-0 bg-slate-100 flex flex-col overflow-hidden relative">
          
          {/* Top Sticky App Bar Header */}
          <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3.5 shrink-0 shadow-xs z-20">
            <div className="flex items-center justify-between gap-2">
              
              {/* Back / Close button & Project Code */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer shrink-0"
                  title="Quay lại"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Quay Lại</span>
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-amber-950 bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300">
                      {project.projectNumber}
                    </span>
                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] sm:text-xs font-black border ${statusMeta.badgeClass}`}>
                      {statusMeta.labelVi}
                    </span>
                  </div>
                  <h1 className="text-xs sm:text-base font-black text-slate-900 truncate mt-0.5">
                    {title || project.title}
                  </h1>
                </div>
              </div>

              {/* Quick Save & Close Action */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSaveAll(false)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs font-black transition-all cursor-pointer shadow-xs ${
                    saveSuccess 
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' 
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  }`}
                >
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{saveSuccess ? 'ĐÃ LƯU!' : 'LƯU'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200 bg-white cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

            </div>

            {/* PRIMARY FULL-SCREEN TAB SELECTOR */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-2 mt-2 border-t border-slate-100 no-scrollbar">
              
              {/* Button 1: Quy Cách */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('specs');
                  handleScrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>📋 Quy Cách ({sections.length})</span>
              </button>

              {/* Button 2: Khách Hàng - Địa Chỉ */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('client');
                  handleScrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  activeTab === 'client'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <User className="h-4 w-4" />
                <span>👤 Khách Hàng - Địa Chỉ</span>
              </button>

              {/* Button 3: Tiến Độ & Checklist */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('tasks');
                  handleScrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                <span>🔨 Tiến Độ ({currentProgress}%)</span>
              </button>

              {/* Button 4: Ảnh Công Trình (Photo of Project) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('photos');
                  handleScrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  activeTab === 'photos'
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>📸 Ảnh Công Trình ({photos.length})</span>
              </button>

              {/* Button 5: Xem Tất Cả (All) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  handleScrollToTop();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-amber-400 shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>🌟 Tất Cả</span>
              </button>

            </div>
          </div>

          {/* =========================================================================
              SCROLLABLE FULL SCREEN CONTENT AREA
             ========================================================================= */}
          <div 
            ref={scrollContainerRef}
            id="full-screen-tab-scroll-container" 
            className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-6 scroll-smooth overscroll-y-contain pb-32"
          >
            
            {/* =====================================================================
                TAB 1 FULL SCREEN: 📋 QUY CÁCH & CHI TIẾT HẠNG MỤC THI CÔNG
               ===================================================================== */}
            {(activeTab === 'specs' || activeTab === 'all') && (
              <section id="full-tab-specs" className="space-y-6 max-w-5xl mx-auto">
                
                {/* Specs Header Card */}
                <div className="rounded-3xl bg-linear-to-r from-amber-500/20 via-amber-500/10 to-white p-4 sm:p-6 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black">
                        <Layers className="h-5 w-5" />
                      </span>
                      <h2 className="text-base sm:text-xl font-black text-slate-900">
                        Chi Tiết Quy Cách & Hạng Mục Thi Công
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 pl-10">
                      Nhập kích thước, vật tư, trụ sắt, quy cách kỹ thuật và dặn dò thợ rõ ràng
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-3 text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Thêm Hạng Mục Mới</span>
                  </button>
                </div>

                {/* Project Title Edit Box */}
                <div className="rounded-3xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wide block">
                    🏷️ Tên / Loại Dự Án Tổng Thể
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Hàng rào Colorbond 3 mặt + Cổng lùa tự động..."
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 px-4 py-3 text-sm sm:text-base font-black text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden transition-colors"
                  />
                </div>

                {/* Quick Add from Preset Templates */}
                <div className="rounded-3xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Thêm nhanh từ mẫu công trình phổ biến:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {WORK_SECTION_TEMPLATES.map((tmpl, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => handleAddFromTemplate(tmpl)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 px-3.5 py-2 text-xs font-bold text-slate-800 transition-all cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-amber-600" />
                        <span>{tmpl.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Work Sections Cards List */}
                <div className="space-y-6">
                  {sections.map((section, idx) => (
                    <div 
                      key={section.id || idx} 
                      className="rounded-3xl border-2 border-amber-300 bg-white p-4 sm:p-6 shadow-md space-y-4 relative overflow-hidden"
                    >
                      {/* Section Card Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-xs">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-950">
                              Hạng Mục Số {idx + 1}
                            </span>
                            <span className="text-xs text-slate-500 font-bold ml-2">
                              ({section.title || 'Chưa đặt tên'})
                            </span>
                          </div>
                        </div>

                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                            title="Xóa hạng mục này"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Section Form Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                            Tên Hạng Mục *
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                            placeholder="VD: Hàng rào chính / Sàn gỗ Decking..."
                            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                            Kích Thước / Dài x Cao (Dimensions)
                          </label>
                          <input
                            type="text"
                            value={section.dimensions || ''}
                            onChange={(e) => handleUpdateSection(idx, 'dimensions', e.target.value)}
                            placeholder="VD: 36m dài x 1.8m cao (hoặc 5.5m x 4.0m)"
                            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                          Vật Tư & Phụ Kiện Cần Chuẩn Bị
                        </label>
                        <input
                          type="text"
                          value={section.materials || ''}
                          onChange={(e) => handleUpdateSection(idx, 'materials', e.target.value)}
                          placeholder="VD: 16 tấm panel Colorbond, 17 trụ thép 65x65, 32 thanh plinth bê tông..."
                          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                          Quy Cách Thi Công & Dặn Thợ Hiện Trường
                        </label>
                        <textarea
                          rows={3}
                          value={section.specifications || ''}
                          onChange={(e) => handleUpdateSection(idx, 'specifications', e.target.value)}
                          placeholder="VD: Đào hố trụ sâu 600mm, đổ bê tông rapid-set, canh dây thẳng tuyệt đối, lắp 2 tấm plinth dưới chân..."
                          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Colour Selection & Finish */}
                <div className="rounded-3xl bg-white p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    <Palette className="h-4 w-4 text-amber-600" />
                    <span>Màu Sắc Sơn / Tôn / Bề Mặt Hoàn Thiện</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tên Màu / Mã Màu</label>
                      <input
                        type="text"
                        value={colour}
                        onChange={(e) => setColour(e.target.value)}
                        placeholder="VD: Colorbond Monument, Merbau Natural Oil..."
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Mã Hex xem trước</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colourHex}
                          onChange={(e) => setColourHex(e.target.value)}
                          className="h-11 w-16 rounded-xl border border-slate-200 cursor-pointer p-1"
                        />
                        <span className="font-mono text-xs font-bold text-slate-700">{colourHex}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preset Swatches */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">Bảng màu Colorbond thông dụng:</span>
                    <div className="flex flex-wrap gap-2">
                      {COLOUR_PRESETS.map((cp) => (
                        <button
                          key={cp.name}
                          type="button"
                          onClick={() => {
                            setColour(cp.name);
                            setColourHex(cp.hex);
                          }}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            colour === cp.name
                              ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-500/30'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-slate-300"
                            style={{ backgroundColor: cp.hex }}
                          />
                          <span>{cp.name.replace('Colorbond ', '')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Overall Site Instructions */}
                <div className="rounded-3xl bg-white p-4 sm:p-6 border border-slate-200 shadow-sm space-y-2">
                  <label className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-amber-600" />
                    <span>Dặn Dò Chung Cho Đội Thợ Hiện Trường</span>
                  </label>
                  <textarea
                    rows={3}
                    value={siteInstructions}
                    onChange={(e) => setSiteInstructions(e.target.value)}
                    placeholder="VD: Cẩn thận rễ cây lớn ở góc sau, nhớ dọn dẹp mùn cưa và đinh vít sau khi thi công..."
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

              </section>
            )}

            {/* =====================================================================
                TAB 2 FULL SCREEN: 👤 THÔNG TIN KHÁCH HÀNG & ĐỊA CHỈ
               ===================================================================== */}
            {(activeTab === 'client' || activeTab === 'all') && (
              <section id="full-tab-client" className="space-y-6 max-w-5xl mx-auto">
                
                {/* Client Header Card */}
                <div className="rounded-3xl bg-linear-to-r from-blue-600/20 via-blue-500/10 to-white p-4 sm:p-6 border-2 border-blue-300 shadow-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black">
                      <User className="h-5 w-5" />
                    </span>
                    <h2 className="text-base sm:text-xl font-black text-slate-900">
                      Thông Tin Khách Hàng & Vị Trí Công Trình
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 pl-10">
                    Số điện thoại, địa chỉ Google Maps và hướng dẫn lối vào hiện trường
                  </p>
                </div>

                {/* Client Form Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                        Tên Khách Hàng *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="VD: Anh Minh / John Smith"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                        Số Điện Thoại
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="0412 345 678"
                          className="flex-1 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                        />
                        {clientPhone && (
                          <a
                            href={`tel:${clientPhone}`}
                            className="p-2.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                            title="Gọi ngay"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                        Email Khách Hàng
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@gmail.com"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                        Số Nhà & Tên Đường *
                      </label>
                      <input
                        type="text"
                        value={siteAddress}
                        onChange={(e) => setSiteAddress(e.target.value)}
                        placeholder="VD: 14 Kingston Road"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                        Khu Vực / Suburb (VIC)
                      </label>
                      <input
                        type="text"
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="Glen Waverley VIC 3150"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Google Maps Direct Button */}
                  <div className="pt-1 flex justify-end">
                    <a
                      href={getGoogleMapsUrl(siteAddress, suburb)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-black shadow-xs transition-all cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Mở Bản Đồ Google Maps Dẫn Đường</span>
                    </a>
                  </div>

                  {/* Access Notes */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wide">
                      🚪 Lối Vào Hiện Trường & Lưu Ý An Toàn (Site Access & Safety)
                    </label>
                    <textarea
                      rows={2}
                      value={accessNotes}
                      onChange={(e) => setAccessNotes(e.target.value)}
                      placeholder="VD: Lối hông mở sẵn, chó đã nhốt, có ổ cắm điện ngoài sân..."
                      className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Timeline & Schedule Dates */}
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Lịch Trình Thi Công & Thời Gian</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Ngày Bắt Đầu Thi Công</label>
                      <input
                        type="date"
                        value={scheduledStartDate}
                        onChange={(e) => setScheduledStartDate(e.target.value)}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Ngày Dự Kiến Hoàn Thành</label>
                      <input
                        type="date"
                        value={targetCompletionDate}
                        onChange={(e) => setTargetCompletionDate(e.target.value)}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

              </section>
            )}

            {/* =====================================================================
                TAB 3 FULL SCREEN: 🔨 TIẾN ĐỘ & CHECKLIST 9 BƯỚC THI CÔNG
               ===================================================================== */}
            {(activeTab === 'tasks' || activeTab === 'all') && (
              <section id="full-tab-tasks" className="space-y-6 max-w-5xl mx-auto">
                
                {/* Progress Header Card */}
                <div className="rounded-3xl bg-linear-to-r from-emerald-600/20 via-emerald-500/10 to-white p-4 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-black">
                        <CheckSquare className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-base sm:text-xl font-black text-slate-900">
                          Tiến Độ Thi Công & Các Bước Việc
                        </h2>
                        <p className="text-xs sm:text-sm font-medium text-slate-700">
                          Chạm vào từng bước để đánh dấu hoàn thành trực tiếp trên hiện trường
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-950 font-mono">
                          {currentProgress}%
                        </div>
                        <div className="text-[11px] font-bold text-slate-600">
                          {completedTaskCount}/{workflowTasks.length} Đã xong
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-all duration-300 rounded-full"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                {/* Add New Task Form */}
                <form onSubmit={handleAddTask} className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={newTaskLabel}
                    onChange={(e) => setNewTaskLabel(e.target.value)}
                    placeholder="Thêm bước việc thi công mới (VD: Lắp ray trượt cổng, Đổ bê tông móng...)"
                    className="flex-1 rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-black shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm Bước Việc</span>
                  </button>
                </form>

                {/* Tasks List */}
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Danh Sách Các Bước Thi Công Chuẩn
                    </span>
                    <button
                      type="button"
                      onClick={handleResetDefaultTasks}
                      className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      ↺ Khôi phục 9 bước chuẩn
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-1">
                    {workflowTasks.map((task, idx) => (
                      <div
                        key={task.id || idx}
                        onClick={() => handleToggleTask(task.id)}
                        className={`flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer select-none ${
                          task.completed 
                            ? 'bg-emerald-50/60 border border-emerald-200/80 text-emerald-950' 
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Big Interactive Checkbox */}
                          <div 
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 transition-all ${
                              task.completed
                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                                : 'border-slate-300 bg-white text-transparent hover:border-emerald-500'
                            }`}
                          >
                            <Check className="h-4 w-4 stroke-[3]" />
                          </div>

                          <div className="min-w-0">
                            <div className={`text-sm sm:text-base font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {task.label}
                            </div>
                            {task.completed && task.completedAt && (
                              <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                                ✓ Hoàn thành ngày: {formatDate(task.completedAt)}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="text-slate-300 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
                          title="Xóa bước này"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </section>
            )}

            {/* =====================================================================
                TAB 4 FULL SCREEN: 📸 HÌNH ẢNH DỰ ÁN & HIỆN TRƯỜNG (ATTACH PHOTO TO PROJECT)
               ===================================================================== */}
            {(activeTab === 'photos' || activeTab === 'all') && (
              <section id="full-tab-photos" className="space-y-6 max-w-5xl mx-auto">
                
                {/* Photos Header Card */}
                <div className="rounded-3xl bg-linear-to-r from-indigo-600/20 via-indigo-500/10 to-white p-4 sm:p-6 border-2 border-indigo-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black shadow-md">
                        <Camera className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-base sm:text-xl font-black text-slate-900">
                          Hình Ảnh Công Trình & Hiện Trường (Project Photos)
                        </h2>
                        <p className="text-xs sm:text-sm font-medium text-slate-700">
                          Chụp ảnh trực tiếp từ điện thoại hoặc tải ảnh trước/đang/sau khi thi công, bản vẽ thiết kế & biên nhận
                        </p>
                      </div>
                    </div>

                    {/* Photo Stats Badge */}
                    <div className="flex items-center gap-2 bg-white/90 border border-indigo-200 px-3.5 py-1.5 rounded-2xl shadow-2xs">
                      <ImageIcon className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-black text-indigo-950 font-mono">
                        {photos.length} Tấm Ảnh
                      </span>
                    </div>
                  </div>

                  {/* Feedback Toast */}
                  {photoFeedback && (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-900 font-bold flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{photoFeedback}</span>
                      </div>
                      <button onClick={() => setPhotoFeedback(null)} className="text-emerald-700 font-bold">✕</button>
                    </div>
                  )}

                  {/* Quick Upload Control Bar */}
                  <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      
                      {/* Select Category for next upload */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                          🏷️ Phân Loại Ảnh:
                        </span>
                        <select
                          value={activeUploadCategory}
                          onChange={(e) => setActiveUploadCategory(e.target.value as PhotoCategory)}
                          className="rounded-xl border-2 border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-xs font-black text-indigo-900 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                        >
                          {PHOTO_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label} ({cat.labelEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Upload Trigger Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Hidden file inputs */}
                        <input
                          type="file"
                          ref={photoFileInputRef}
                          onChange={handlePhotoUpload}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <input
                          type="file"
                          ref={cameraInputRef}
                          onChange={handlePhotoUpload}
                          capture="environment"
                          accept="image/*"
                          className="hidden"
                        />

                        {/* Mobile Camera Capture Button */}
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2.5 text-xs font-black shadow-xs transition-all cursor-pointer active:scale-98"
                          title="Mở camera điện thoại chụp ảnh hiện trường"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Chụp Ảnh Mới</span>
                        </button>

                        {/* Multi Photo File Picker Button */}
                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-black shadow-xs transition-all cursor-pointer active:scale-98"
                          title="Tải nhiều ảnh từ máy tính hoặc thư viện điện thoại"
                        >
                          <Upload className="h-4 w-4" />
                          <span>{isUploadingPhoto ? 'Đang Tải Ảnh...' : 'Tải Ảnh Lên (Upload)'}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Filter Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Lọc:</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedPhotoFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                      selectedPhotoFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Tất Cả ({photos.length})
                  </button>

                  {PHOTO_CATEGORIES.map(cat => {
                    const count = photos.filter(p => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedPhotoFilter(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          selectedPhotoFilter === cat.id
                            ? `${cat.badgeBg} ${cat.textColor} font-black ring-2 ${cat.borderColor} shadow-xs`
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${cat.dotColor}`} />
                        <span>{cat.label} ({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Photos Gallery Grid */}
                {filteredPhotos.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-2xs">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h3 className="text-base font-black text-slate-900">
                        {photos.length === 0 ? 'Chưa có ảnh nào cho công trình này' : 'Không có ảnh trong danh mục này'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Bấm nút <b>"Chụp Ảnh Mới"</b> hoặc <b>"Tải Ảnh Lên"</b> ở trên để đính kèm hình ảnh hiện trường, bản vẽ mặt bằng hoặc biên nhận vật tư.
                      </p>
                    </div>
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => photoFileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-black shadow-md cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Chọn Ảnh Từ Máy</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPhotos.map((photo, idx) => {
                      const catMeta = getPhotoCategoryMeta(photo.category);
                      const isEditingCaption = editingPhotoId === photo.id;

                      return (
                        <div
                          key={photo.id || idx}
                          className="group relative rounded-3xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                        >
                          {/* Image Thumbnail Container */}
                          <div 
                            className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden cursor-pointer"
                            onClick={() => setLightboxPhotoIndex(idx)}
                          >
                            <img
                              src={photo.url}
                              alt={photo.caption || photo.name || 'Project Photo'}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />

                            {/* Category Tag Overlay */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <span className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-black shadow-md backdrop-blur-xs border ${catMeta.badgeBg} ${catMeta.textColor} ${catMeta.borderColor}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${catMeta.dotColor}`} />
                                <span>{catMeta.label}</span>
                              </span>
                            </div>

                            {/* Zoom Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <span className="p-2.5 rounded-full bg-white/90 text-slate-950 shadow-lg font-bold text-xs flex items-center gap-1">
                                <Maximize2 className="h-4 w-4" />
                                <span>Xem Lớn</span>
                              </span>
                            </div>

                            {/* File Size / Date Overlay */}
                            <div className="absolute bottom-2 right-2 z-10 text-[10px] font-bold text-white/90 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                              {formatDate(photo.uploadedAt)}
                            </div>
                          </div>

                          {/* Details & Caption Area */}
                          <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                            
                            {/* Caption display or edit box */}
                            {isEditingCaption ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editCaptionText}
                                  onChange={(e) => setEditCaptionText(e.target.value)}
                                  placeholder="Nhập chú thích cho ảnh này..."
                                  className="w-full rounded-xl border border-indigo-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-hidden"
                                  autoFocus
                                />
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingPhotoId(null)}
                                    className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSavePhotoCaption(photo.id)}
                                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-xs hover:bg-indigo-700"
                                  >
                                    Lưu Chú Thích
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setEditingPhotoId(photo.id);
                                  setEditCaptionText(photo.caption || '');
                                }}
                                className="cursor-pointer group/caption"
                              >
                                {photo.caption ? (
                                  <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                                    📝 {photo.caption}
                                  </p>
                                ) : (
                                  <span className="text-[11px] text-slate-400 font-medium italic group-hover/caption:text-indigo-600 flex items-center gap-1">
                                    <Edit2 className="h-3 w-3" />
                                    <span>Thêm ghi chú cho ảnh...</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Category Switcher & Action Buttons Row */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                              <select
                                value={photo.category}
                                onChange={(e) => handleUpdatePhotoCategory(photo.id, e.target.value as PhotoCategory)}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-white focus:outline-hidden max-w-[130px] cursor-pointer"
                              >
                                {PHOTO_CATEGORIES.map(c => (
                                  <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                              </select>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadPhoto(photo)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                  title="Tải ảnh về máy"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Xóa ảnh"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </section>
            )}

          </div>

          {/* =========================================================================
              BOTTOM STICKY ACTION BAR ON MOBILE (QUICK SAVE, PRINT, CLOSE)
             ========================================================================= */}
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shrink-0 z-30 shadow-lg flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => handleSaveAll(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-amber-500 active:bg-amber-600 text-slate-950 shadow-md'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{saveSuccess ? '✓ ĐÃ LƯU XONG' : '💾 LƯU DỰ ÁN'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSaveAll(false);
                onOpenPrintSheet({
                  ...project,
                  title,
                  clientName,
                  clientPhone,
                  clientEmail,
                  siteAddress,
                  suburb,
                  accessNotes,
                  sections,
                  colour,
                  colourHex,
                  siteInstructions,
                  notes,
                  scheduledStartDate,
                  targetCompletionDate,
                  workflowTasks,
                  photos
                });
              }}
              className="p-3 rounded-2xl bg-slate-800 text-white text-xs font-bold border border-slate-700"
              title="In A4"
            >
              <Printer className="h-4 w-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={handleCompleteAndDelete}
              className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold"
              title="Hoàn thành & Xóa khỏi hệ thống"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>

        </main>

      </div>
    </div>
  );
};
