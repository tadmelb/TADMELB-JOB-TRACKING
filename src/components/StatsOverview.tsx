import React from 'react';
import { Project, ProjectStatus } from '../types';
import { Flame, CheckCircle2, Hammer, CheckCheck, Pause, Layers } from 'lucide-react';

interface StatsOverviewProps {
  projects: Project[];
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  projects,
  selectedStatusFilter,
  onSelectStatusFilter
}) => {
  const urgentCount = projects.filter(p => p.status === 'urgent' || p.status === 'pending').length;
  const confirmedCount = projects.filter(p => p.status === 'confirmed').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const onHoldCount = projects.filter(p => p.status === 'on_hold').length;

  const totalCount = projects.length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      
      {/* 1. All Projects */}
      <div 
        onClick={() => onSelectStatusFilter('all')}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
          selectedStatusFilter === 'all'
            ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
            : 'border-slate-200 bg-white shadow-xs hover:border-amber-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-bold uppercase tracking-wider">All Jobs</span>
          <Layers className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          <span className="text-[11px] font-medium text-slate-500">Projects</span>
        </div>
        <div className="mt-1 text-[10px] font-semibold text-slate-400">
          Tất cả công trình
        </div>
      </div>

      {/* 2. URGENT JOB - Highlighted RED */}
      <div 
        onClick={() => onSelectStatusFilter('urgent')}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
          selectedStatusFilter === 'urgent'
            ? 'border-red-600 bg-red-50 shadow-md ring-2 ring-red-500/30'
            : 'border-red-200 bg-red-50/40 shadow-xs hover:border-red-400 hover:bg-red-50/80 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-red-700">
          <span className="text-[11px] font-black uppercase tracking-wider">🚨 Urgent Jobs</span>
          <div className="rounded-md bg-red-600 p-1 text-white animate-pulse">
            <Flame className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-red-600">{urgentCount}</span>
          <span className="text-[11px] font-bold text-red-600">Jobs</span>
        </div>
        <div className="mt-1 text-[10px] font-bold text-red-600">
          Ưu tiên xử lý gấp
        </div>
      </div>

      {/* 3. Confirmed & Scheduled */}
      <div 
        onClick={() => onSelectStatusFilter('confirmed')}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
          selectedStatusFilter === 'confirmed'
            ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
            : 'border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-blue-700">
          <span className="text-[11px] font-bold uppercase tracking-wider">Confirmed</span>
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{confirmedCount}</span>
          <span className="text-[11px] font-medium text-slate-500">Scheduled</span>
        </div>
        <div className="mt-1 text-[10px] font-semibold text-blue-600">
          Đã chốt & lên lịch
        </div>
      </div>

      {/* 4. In Progress */}
      <div 
        onClick={() => onSelectStatusFilter('in_progress')}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
          selectedStatusFilter === 'in_progress'
            ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
            : 'border-slate-200 bg-white shadow-xs hover:border-purple-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-purple-700">
          <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
          <Hammer className="h-4 w-4 text-purple-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-purple-700">{inProgressCount}</span>
          <span className="text-[11px] font-medium text-slate-500">On Site</span>
        </div>
        <div className="mt-1 text-[10px] font-semibold text-purple-600">
          Đang thi công
        </div>
      </div>

      {/* 5. Completed */}
      <div 
        onClick={() => onSelectStatusFilter('completed')}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
          selectedStatusFilter === 'completed'
            ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
            : 'border-slate-200 bg-white shadow-xs hover:border-emerald-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-emerald-700">
          <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
          <CheckCheck className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{completedCount}</span>
          <span className="text-[11px] font-medium text-slate-500">Handed over</span>
        </div>
        <div className="mt-1 text-[10px] font-semibold text-emerald-600">
          Hoàn thành bàn giao
        </div>
      </div>

      {/* 6. On Hold */}
      <div 
        onClick={() => onSelectStatusFilter('on_hold')}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
          selectedStatusFilter === 'on_hold'
            ? 'border-slate-500 bg-slate-100 shadow-md ring-2 ring-slate-400/20'
            : 'border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-bold uppercase tracking-wider">On Hold</span>
          <Pause className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-700">{onHoldCount}</span>
          <span className="text-[11px] font-medium text-slate-500">Waiting</span>
        </div>
        <div className="mt-1 text-[10px] font-semibold text-slate-500">
          Tạm dừng / Chờ
        </div>
      </div>

    </div>
  );
};
