import React from 'react';
import { Project } from '../types';
import { getStatusMeta, formatDate, getCanberraLiveTime } from '../utils/helpers';
import { Printer, X, Hammer, MapPin, Phone, User, Calendar, CheckSquare, Layers } from 'lucide-react';

interface JobSheetPrintModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobSheetPrintModal: React.FC<JobSheetPrintModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  if (!isOpen || !project) return null;

  const statusMeta = getStatusMeta(project.status);
  const sections = project.sections && project.sections.length > 0 
    ? project.sections 
    : [
        {
          id: 's1',
          title: project.style || project.title,
          dimensions: project.dimensions,
          materials: project.materialsSummary,
          specifications: project.notes
        }
      ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-700">
            Printable Site Job Sheet & Technical Work Order (Phiếu Thi Công Công Trình)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>In / Lưu PDF (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-8 text-slate-900 print:p-6 print:overflow-visible font-sans space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Hammer className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    TADMELB CONSTRUCTION
                  </h1>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Fencing • Decking • Pergola • Carport Specialist
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 inline-block">
                JOB ORDER: {project.projectNumber}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">
                Date Issued: {getCanberraLiveTime().fullStr} (Canberra)
              </div>
            </div>
          </div>

          {/* Project Title Banner */}
          <div className="rounded-xl bg-slate-100 p-3.5 border border-slate-200">
            <div className="text-[10px] font-bold uppercase text-slate-500">Project / Scope of Work</div>
            <div className="text-base font-black text-slate-900">{project.title}</div>
            <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-700">
              <span className="rounded bg-white px-2 py-0.5 border border-slate-200">
                Status: {statusMeta.label}
              </span>
              <span>•</span>
              <span>{sections.length} Hạng mục thi công</span>
            </div>
          </div>

          {/* Client & Site Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400">Site Location & Client Contact</div>
              <div className="font-black text-sm text-slate-900">{project.clientName}</div>
              <div className="font-bold text-slate-700">{project.siteAddress}, {project.suburb}</div>
              <div className="text-slate-600">Phone: {project.clientPhone || 'N/A'}</div>
              <div className="text-slate-600">Email: {project.clientEmail || 'N/A'}</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400">Construction Schedule & Timeline</div>
              <div><span className="text-slate-500 font-medium">Start Date:</span> <span className="font-bold">{formatDate(project.scheduledStartDate)}</span></div>
              <div><span className="text-slate-500 font-medium">Target Handover:</span> <span className="font-bold">{formatDate(project.targetCompletionDate)}</span></div>
              <div><span className="text-slate-500 font-medium">Project ID:</span> <span className="font-bold font-mono">{project.projectNumber}</span></div>
            </div>
          </div>

          {/* Site Access & Safety */}
          {project.accessNotes && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">
              <div className="text-[10px] font-black uppercase text-amber-900">Site Access & Safety Notes</div>
              <p className="mt-0.5 font-medium text-amber-950">{project.accessNotes}</p>
            </div>
          )}

          {/* WORK SECTIONS & SPECIFICATIONS BREAKDOWN */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Layers className="h-4 w-4 text-amber-600" />
              <span>Scope of Work & Technical Specifications (Chi Tiết Hạng Mục Thi Công)</span>
            </div>

            <div className="space-y-3">
              {sections.map((section, idx) => (
                <div key={section.id} className="rounded-xl border border-slate-200 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-xs">
                      #{idx + 1}. {section.title}
                    </span>
                    {section.dimensions && (
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        {section.dimensions}
                      </span>
                    )}
                  </div>

                  {section.materials && (
                    <div className="text-[11px]">
                      <span className="text-slate-500 font-bold">Vật tư: </span>
                      <span className="text-slate-800 font-medium">{section.materials}</span>
                    </div>
                  )}

                  {section.specifications && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 font-bold">Quy cách & Dặn thợ: </span>
                      <span className="text-slate-800">{section.specifications}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* General Finish & Site Instructions */}
          {(project.colour || project.siteInstructions) && (
            <div className="rounded-xl border border-slate-200 p-3.5 text-xs space-y-2">
              {project.colour && (
                <div>
                  <span className="text-slate-500 font-bold text-[10px] uppercase block">Selected Colour / Finish:</span>
                  <span className="font-black text-slate-900 text-xs">{project.colour}</span>
                </div>
              )}
              {project.siteInstructions && (
                <div className="pt-1">
                  <span className="text-slate-500 font-bold text-[10px] uppercase block">Worker Instructions (Dặn dò cho thợ):</span>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">{project.siteInstructions}</p>
                </div>
              )}
            </div>
          )}

          {/* On-Site Milestone Checklist */}
          <div className="rounded-xl border border-slate-200 p-4 text-xs space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 pb-1">
              On-Site Execution & Handover Checklist (Tiến Độ Thi Công)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {project.workflowTasks?.map((task, idx) => (
                <div key={task.id} className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] font-black ${task.completed ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-400 bg-white'}`}>
                    {task.completed ? '✓' : ''}
                  </div>
                  <span className={`text-[11px] ${task.completed ? 'text-slate-500 line-through' : 'font-medium text-slate-800'}`}>
                    {idx + 1}. {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-6">Lead Builder Sign-off:</div>
              <div className="border-b border-slate-400 pb-1 font-mono text-[11px]">Signature: ______________________</div>
              <div className="text-[10px] text-slate-400 mt-1">Date: __________________</div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-6">Client Completion Acceptance:</div>
              <div className="border-b border-slate-400 pb-1 font-mono text-[11px]">Signature: ______________________</div>
              <div className="text-[10px] text-slate-400 mt-1">Date: __________________</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
