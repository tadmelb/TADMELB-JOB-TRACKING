import React from 'react';
import { Project, ProjectStatus } from '../types';
import { getStatusMeta, getPriorityMeta, formatDate } from '../utils/helpers';
import { DetailTabType } from './ProjectDetailModal';
import { 
  MapPin, 
  Phone, 
  ChevronRight, 
  Flame,
  Layers,
  Trash2,
  CheckCircle2,
  FileText,
  User,
  CheckSquare,
  Camera
} from 'lucide-react';

interface ProjectListViewProps {
  projects: Project[];
  onSelectProject: (project: Project, tab?: DetailTabType) => void;
  onUpdateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  onSelectProject,
  onUpdateProjectStatus,
  onDeleteProject
}) => {
  const handleCompleteAndDelete = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (window.confirm(`Xác nhận hoàn thành & xóa dự án ${project.projectNumber} - ${project.title} khỏi hệ thống?`)) {
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
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase text-slate-500 tracking-wider">
              <th className="py-3.5 pl-6 pr-3">Job ID & Khách Hàng</th>
              <th className="px-3 py-3.5">Quy Cách & Hạng Mục</th>
              <th className="px-3 py-3.5">Trạng Thái</th>
              <th className="px-3 py-3.5">Lịch Trình</th>
              <th className="px-3 py-3.5">Tiến Độ</th>
              <th className="py-3.5 pl-3 pr-6 text-right">Xem & Thao Tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm font-medium text-slate-400">
                  Không tìm thấy công trình nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const statusMeta = getStatusMeta(project.status);
                const priorityMeta = getPriorityMeta(project.priority);
                const sectionCount = project.sections?.length || 1;

                return (
                  <tr
                    key={project.id}
                    onClick={() => onSelectProject(project, 'specs')}
                    className="group hover:bg-amber-50/40 transition-colors cursor-pointer"
                  >
                    {/* 1. Job ID & Client Details */}
                    <td 
                      className="py-4 pl-6 pr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project, 'client');
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                          {project.projectNumber}
                        </span>
                        {project.status === 'urgent' && (
                          <span className="inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                            <Flame className="h-2.5 w-2.5 animate-pulse" />
                            <span>URGENT</span>
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-900 group-hover:text-amber-800 text-sm">
                        {project.title}
                      </div>
                      <div className="mt-1 text-slate-600 font-bold flex items-center gap-1.5">
                        <User className="h-3 w-3 text-blue-600" />
                        <span>{project.clientName}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {project.siteAddress}, {project.suburb}
                        </span>
                        {project.clientPhone && (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Phone className="h-3 w-3" />
                            {project.clientPhone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 2. Scope & Specifications */}
                    <td 
                      className="px-3 py-4 max-w-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project, 'specs');
                      }}
                    >
                      {sectionCount > 1 ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200 mb-1">
                          <Layers className="h-3 w-3" />
                          <span>{sectionCount} Hạng Mục (Package)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 mb-1">
                          <span>1 Hạng Mục</span>
                        </span>
                      )}

                      <div className="space-y-1">
                        {project.colour && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            {project.colourHex && (
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-slate-300 shrink-0"
                                style={{ backgroundColor: project.colourHex }}
                              />
                            )}
                            <span className="font-bold text-slate-800 truncate">{project.colour}</span>
                          </div>
                        )}
                        {project.dimensions && (
                          <div className="text-[11px] font-bold text-slate-900 truncate">
                            {project.dimensions}
                          </div>
                        )}
                        {project.siteInstructions && (
                          <div className="text-[10px] text-amber-900 bg-amber-50 rounded p-1 line-clamp-1 border border-amber-200/50">
                            📝 {project.siteInstructions}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 3. Status */}
                    <td className="px-3 py-4">
                      <div className="space-y-1.5">
                        <select
                          value={project.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onUpdateProjectStatus(project.id, e.target.value as ProjectStatus)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border cursor-pointer focus:outline-hidden ${statusMeta.badgeClass}`}
                        >
                          <option value="urgent">🚨 Urgent Job</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                        </select>
                      </div>
                    </td>

                    {/* 4. Site Schedule */}
                    <td className="px-3 py-4 text-[11px]">
                      <div className="font-bold text-slate-800">
                        {project.scheduledStartDate ? formatDate(project.scheduledStartDate) : 'Chưa xếp lịch'}
                      </div>
                      {project.targetCompletionDate && (
                        <div className="text-slate-400 mt-0.5 text-[10px]">
                          Hạn: {formatDate(project.targetCompletionDate)}
                        </div>
                      )}
                    </td>

                    {/* 5. Progress */}
                    <td 
                      className="px-3 py-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project, 'tasks');
                      }}
                    >
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-600">{project.progressPercentage}%</span>
                          <span className="text-[10px] text-slate-400">
                            {project.workflowTasks?.filter(t => t.completed).length || 0}/
                            {project.workflowTasks?.length || 0}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
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
                    </td>

                    {/* 6. Quick Tab Buttons & Delete Actions */}
                    <td className="py-4 pl-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct Tab Pill: Quy cách */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'specs');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 px-2 py-1 text-[10px] font-bold transition-all cursor-pointer"
                          title="Xem Tab Quy Cách full màn hình"
                        >
                          <FileText className="h-3 w-3 text-amber-600" />
                          <span>Quy Cách</span>
                        </button>

                        {/* Direct Tab Pill: Khách hàng */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'client');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/60 px-2 py-1 text-[10px] font-bold transition-all cursor-pointer"
                          title="Xem Tab Khách Hàng - Địa Chỉ full màn hình"
                        >
                          <User className="h-3 w-3 text-blue-600" />
                          <span>Khách</span>
                        </button>

                        {/* Direct Tab Pill: Ảnh */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(project, 'photos');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/60 px-2 py-1 text-[10px] font-bold transition-all cursor-pointer"
                          title="Xem & Tải Ảnh Công Trình"
                        >
                          <Camera className="h-3 w-3 text-indigo-600" />
                          <span>Ảnh ({project.photos?.length || 0})</span>
                        </button>

                        {/* Complete & Purge */}
                        {onDeleteProject && (
                          <button
                            type="button"
                            onClick={(e) => handleCompleteAndDelete(e, project)}
                            className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                            title="Hoàn thành & Xóa khỏi hệ thống"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Xong</span>
                          </button>
                        )}

                        {onDeleteProject && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, project)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa dự án"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
