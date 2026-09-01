import React from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  ListOrdered, 
  Calendar as CalendarIcon, 
  Download, 
  Upload, 
  RotateCcw,
  Hammer,
  Cloud,
  CloudCheck,
  RefreshCw,
  User as UserIcon,
  LogIn,
  LogOut,
  HardDrive
} from 'lucide-react';
import { UserSession } from '../types';
import { User } from '../lib/firebase';
import { CanberraClock } from './CanberraClock';

interface NavbarProps {
  currentView: 'board' | 'list' | 'calendar';
  setCurrentView: (view: 'board' | 'list' | 'calendar') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewProject: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetSampleData: () => void;
  totalProjectsCount: number;
  user: UserSession | User | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onManualCloudSync?: () => void;
  isSyncing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  onOpenNewProject,
  onExportData,
  onImportData,
  onResetSampleData,
  totalProjectsCount,
  user,
  onOpenAuthModal,
  onSignOut,
  onManualCloudSync,
  isSyncing = false
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Main Top Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md">
              <Hammer className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  TADMELB
                </span>
                <button
                  type="button"
                  onClick={onOpenNewProject}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-2.5 py-1 text-xs font-black tracking-normal text-slate-950 shadow-xs transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1"
                  title="Nhấn để tạo dự án mới"
                >
                  <Plus className="h-3.5 w-3.5 text-slate-950 stroke-[3]" />
                  <span>Tạo Dự Án Mới</span>
                </button>
              </div>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">
                Field Construction & Job Specifications Hub
              </p>
            </div>
          </div>

          {/* Search Box in Header */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên khách, địa chỉ, mã công trình, vật tư..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 transition-colors focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-amber-500/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Real-time Canberra Clock in Header */}
          <div className="hidden lg:block">
            <CanberraClock />
          </div>

          {/* Right Action Buttons & Auth */}
          <div className="flex items-center gap-2">
            
            {/* Quick Sync Button */}
            {onManualCloudSync && (
              <button
                type="button"
                onClick={onManualCloudSync}
                disabled={isSyncing}
                title="Đồng bộ tất cả dữ liệu lên Google Cloud Firestore ngay bây giờ"
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/80 hover:bg-sky-100 text-sky-900 px-2.5 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-sky-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Đang lưu...' : 'Lưu Cloud'}</span>
              </button>
            )}

            {/* Email Login / User Status */}
            {user ? (
              <div className="flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-2.5 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-black">
                  <Cloud className="h-3.5 w-3.5" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[11px] font-bold text-slate-900 truncate max-w-[140px]">
                    {user.email || localStorage.getItem('tadmelb_user_email') || 'tadmelbconstruction@gmail.com'}
                  </div>
                  <div className="text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đã đồng bộ Google Cloud
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Đăng xuất khỏi thiết bị này"
                  className="rounded-lg p-1 text-slate-400 hover:bg-emerald-100 hover:text-slate-700 transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
                title="Đăng nhập email để quản lý tài khoản"
              >
                <LogIn className="h-3.5 w-3.5 text-amber-600" />
                <span className="hidden sm:inline">Đăng Nhập Email</span>
                <span className="sm:hidden">Đăng nhập</span>
              </button>
            )}

            {/* Backup & Tools */}
            <div className="hidden xl:flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={onExportData}
                title="Sao lưu / Xuất dữ liệu JSON"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
              <button
                onClick={onImportData}
                title="Khôi phục / Nhập dữ liệu JSON"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-bar: View Switcher and Quick Overview */}
      <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tổng Công Trình:</span>
              <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-slate-900 font-black">
                {totalProjectsCount} Việc
              </span>
            </div>

            {/* Mobile Canberra Clock widget */}
            <div className="block lg:hidden">
              <CanberraClock />
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Mobile Search input if small screen */}
            <div className="relative flex-1 md:hidden">
              <Search className="pointer-events-none absolute inset-y-0 left-0 my-auto ml-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm việc..."
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs"
              />
            </div>

            {/* View Switch Buttons */}
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                onClick={() => setCurrentView('board')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  currentView === 'board'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Kanban Board View (Bảng trạng thái)"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Bảng Công Việc (Board)</span>
              </button>

              <button
                onClick={() => setCurrentView('list')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  currentView === 'list'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="List / Table View (Danh sách chi tiết)"
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>Danh Sách (List)</span>
              </button>

              <button
                onClick={() => setCurrentView('calendar')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  currentView === 'calendar'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Schedule & Calendar View (Lịch thi công)"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Lịch Thi Công (Schedule)</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
