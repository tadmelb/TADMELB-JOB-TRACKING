import React from 'react';
import { Project, ProjectStatus } from '../types';
import { getStatusMeta, formatDate, getGoogleMapsUrl } from '../utils/helpers';
import { DetailTabType } from './ProjectDetailModal';
import { 
  Flame, 
  CheckCircle2, 
  Hammer, 
  CheckCheck, 
  Pause, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  Plus, 
  Layers, 
  FileText, 
  AlertCircle, 
  Trash2,
  CheckSquare,
  User,
  Camera
} from 'lucide-react';

interface KanbanBoardProps {
  projects: Project[];
  onSelectProject: (project: Project, tab?: DetailTabType) => void;
  onUpdateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void;
  onOpenNewProjectWithStatus?: (status: ProjectStatus) => void;
  onDeleteProject?: (projectId: string) => void;
}

interface ColumnConfig {
  id: ProjectStatus;
  title: string;
  titleVi: string;
  icon: React.ReactNode;
  headerBg: string;
  badgeBg: string;
  borderColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'urgent',
    title: '🚨 Urgent Job',
    titleVi: 'Cần làm gấp / Ưu tiên cao',
    icon: <Flame className="h-4 w-4 text-red-600 animate-pulse" />,
    headerBg: 'bg-red-50 text-red-900 border-red-200',
    badgeBg: 'bg-red-600 text-white',
    borderColor: 'border-red-500'
  },
  {
    id: 'confirmed',
    title: 'Confirmed',
    titleVi: 'Đã xác nhận - Sắp thi công',
    icon: <CheckCircle2 className="h-4 w-4 text-blue-600" />,
    headerBg: 'bg-blue-50 text-blue-900 border-blue-200',
    badgeBg: 'bg-blue-600 text-white',
    borderColor: 'border-blue-400'
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    titleVi: 'Đang thi công ngoài hiện trường',
    icon: <Hammer className="h-4 w-4 text-amber-600" />,
    headerBg: 'bg-amber-50 text-amber-900 border-amber-200',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    borderColor: 'border-amber-400'
  },
  {
    id: 'completed',
    title: 'Completed',
    titleVi: 'Đã bàn giao hoàn tất',
    icon: <CheckCheck className="h-4 w-4 text-emerald-600" />,
    headerBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badgeBg: 'bg-emerald-600 text-white',
    borderColor: 'border-emerald-400'
  },
  {
    id: 'on_hold',
    title: 'On Hold',
    titleVi: 'Tạm hoãn / Chờ vật tư',
    icon: <Pause className="h-4 w-4 text-slate-600" />,
    headerBg: 'bg-slate-50 text-slate-700 border-slate-200',
    badgeBg: 'bg-slate-500 text-white',
    borderColor: 'border-slate-300'
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projects,
  onSelectProject,
  onUpdateProjectStatus,
  onOpenNewProjectWithStatus,
  onDeleteProject
}) => {
  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(p => {
      if (status === 'urgent') {
        return p.status === 'urgent' || p.priority === 'urgent';
      }
      return p.status === status;
    });
  };

  const handleCompleteAndDelete = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const confirmMsg = `XÁC NHẬN HOÀN THÀNH & XÓA KHỎI HỆ THỐNG:\n\nBạn có chắc chắn muốn HOÀN THÀNH và XÓA toàn bộ dữ liệu của công trình:\n"${project.projectNumber} - ${project.title}" (${project.clientName})?\n\nDữ liệu sẽ được dọn dẹp sạch sẽ khỏi hệ thống.`;
    if (window.confirm(confirmMsg)) {
      if (onDeleteProject) {
        onDeleteProject(project.id);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (window.confirm(`Xác nhận xóa dự án ${project.projectNumber} - ${project.title}?`)) {
      if (onDeleteProject) {
        onDeleteProject(project.id);
      }
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x select-none">
      {COLUMNS.map((col) => {
        const colProjects = getProjectsByStatus(col.id);

        return (
          <div
            key={col.id}
            className="flex-none w-80 sm:w-88 flex flex-col rounded-3xl bg-slate-100/90 p-3.5 border border-slate-200/80 shadow-xs max-h-[calc(100vh-210px)]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-2xl border ${col.headerBg} mb-3 shadow-2xs`}>
              <div className="flex items-center gap-2">
                {col.icon}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wide">
                    {col.title}
                  </h3>
                  <p className="text-[10px] opacity-80 font-medium">
                    {col.titleVi}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-black ${col.badgeBg}`}>
                  {colProjects.length}
                </span>

                {onOpenNewProjectWithStatus && (
                  <button
                    type="button"
                    onClick={() => onOpenNewProjectWithStatus(col.id)}
                    className="inline-flex items-center gap-0.5 rounded-lg bg-white/80 hover:bg-white p-1 text-[11px] font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                    title={`Thêm công trình vào cột ${col.title}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Cards Container */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {colProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-xs font-medium text-slate-400">
                  Chưa có công việc nào
                </div>
              ) : (
                colProjects.map((project) => {
                  const tasks = project.workflowTasks || [];
                  const completedTasks = tasks.filter(t => t.completed).length;
                  const totalTasks = tasks.length;
                  const sectionCount = project.sections?.length || 1;

                  return (
                    <div
                      key={project.id}
                      onClick={() => onSelectProject(project, 'specs')}
                      className={`group relative rounded-2xl border bg-white p-3.5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer ${
                        project.status === 'urgent' || project.status === 'pending'
                          ? 'border-red-300 hover:border-red-500 ring-1 ring-red-100'
                          : 'border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      {/* Top Job Tag & Number */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                          {project.projectNumber}
                        </span>

                        {sectionCount > 1 ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                            <Layers className="h-3 w-3" />
                            <span>{sectionCount} Hạng Mục</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            <span>1 Hạng Mục</span>
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 line-clamp-2 leading-snug">
                        {project.title}
                      </h4>

                      {/* Client & Suburb Row */}
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-1.5 font-bold text-slate-800">
                          <span className="truncate">{project.clientName}</span>
                          {project.clientPhone && (
                            <a
                              href={`tel:${project.clientPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1"
                              title="Gọi khách"
                            >
                              <Phone className="h-3 w-3" />
                              <span>{project.clientPhone}</span>
                            </a>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-1 text-[11px] text-slate-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                          <span className="truncate">{project.siteAddress}, {project.suburb}</span>
                        </div>
                      </div>

                      {/* Work Specifications Frame Preview */}
                      <div className="mt-2.5 rounded-xl bg-slate-50 p-2 border border-slate-100 text-xs space-y-1">
                        {/* Colour / Finish */}
                        {project.colour && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            {project.colourHex && (
                              <span 
                                className="h-2.5 w-2.5 rounded-full border border-slate-300 shrink-0" 
                                style={{ backgroundColor: project.colourHex }}
                              />
                            )}
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Màu:</span>
                            <span className="font-bold text-slate-800 truncate">{project.colour}</span>
                          </div>
                        )}

                        {/* Dimensions */}
                        {project.dimensions && (
                          <div className="text-[11px] text-slate-600 truncate">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Quy Cách: </span>
                            <span className="font-semibold text-slate-800">{project.dimensions}</span>
                          </div>
                        )}

                        {/* Site Instructions snippet */}
                        {project.siteInstructions && (
                          <div className="text-[10px] text-amber-900 bg-amber-50/90 rounded-md p-1.5 border border-amber-200/50 line-clamp-1">
                            <span className="font-bold">📝 Dặn: </span>
                            {project.siteInstructions}
                          </div>
                        )}
                      </div>

                      {/* QUICK DIRECT TAB ACCESS BUTTONS FOR PHONE & QUICK VIEW */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-4 gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'specs');
                          }}
                          className="flex items-center justify-center gap-1 py-1 px-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200/60 transition-colors"
                          title="Mở xem & chỉnh sửa Quy Cách full màn hình"
                        >
                          <FileText className="h-3 w-3 text-amber-600 shrink-0" />
                          <span className="truncate">Quy cách</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'client');
                          }}
                          className="flex items-center justify-center gap-1 py-1 px-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200/60 transition-colors"
                          title="Mở xem & chỉnh sửa Khách Hàng - Địa Chỉ full màn hình"
                        >
                          <User className="h-3 w-3 text-blue-600 shrink-0" />
                          <span className="truncate">Khách</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'tasks');
                          }}
                          className="flex items-center justify-center gap-1 py-1 px-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200/60 transition-colors"
                          title="Mở xem & đánh dấu Tiến Độ checklist"
                        >
                          <CheckSquare className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{project.progressPercentage}%</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'photos');
                          }}
                          className="flex items-center justify-center gap-1 py-1 px-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[10px] font-bold border border-indigo-200/60 transition-colors"
                          title="Mở xem & chụp ảnh hiện trường"
                        >
                          <Camera className="h-3 w-3 text-indigo-600 shrink-0" />
                          <span className="truncate">Ảnh ({project.photos?.length || 0})</span>
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                          <span>Tiến độ ({completedTasks}/{totalTasks} việc)</span>
                          <span className="text-slate-900 font-mono">{project.progressPercentage}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              project.progressPercentage === 100
                                ? 'bg-emerald-500'
                                : project.status === 'urgent'
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Fast Status Switcher & Complete/Delete Actions */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <select
                          value={project.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onUpdateProjectStatus(project.id, e.target.value as ProjectStatus)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-white focus:outline-hidden max-w-[130px]"
                        >
                          <option value="urgent">🚨 Urgent Job</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                        </select>

                        <div className="flex items-center gap-1">
                          {onDeleteProject && (
                            <button
                              type="button"
                              onClick={(e) => handleCompleteAndDelete(e, project)}
                              className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                              title="Hoàn thành & Xóa khỏi hệ thống"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Xong & Xóa</span>
                            </button>
                          )}

                          {onDeleteProject && (
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, project)}
                              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Xóa dự án"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
