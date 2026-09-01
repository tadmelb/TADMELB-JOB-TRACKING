import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus } from '../types';
import { getStatusMeta, formatDate, getCanberraCurrentDateString } from '../utils/helpers';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  User, 
  ExternalLink,
  Clock
} from 'lucide-react';

interface CalendarViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

// Color badges for calendar day buttons matching the status colors: Đỏ (Urgent), Tím (In Progress), Xanh Dương (Confirmed), Xanh Lá (Completed), Xám (On Hold)
export const getCalendarStatusStyle = (status: ProjectStatus) => {
  switch (status) {
    case 'urgent':
    case 'pending':
      return {
        bg: 'bg-red-600 hover:bg-red-700 text-white',
        border: 'border-red-600',
        dot: 'bg-white',
        pillBg: 'bg-red-100 text-red-800 border-red-300',
        labelVi: 'Gấp / Làm ngay',
        colorName: 'Đỏ'
      };
    case 'in_progress':
      return {
        bg: 'bg-purple-600 hover:bg-purple-700 text-white',
        border: 'border-purple-600',
        dot: 'bg-white',
        pillBg: 'bg-purple-100 text-purple-800 border-purple-300',
        labelVi: 'Đang thi công',
        colorName: 'Tím'
      };
    case 'confirmed':
      return {
        bg: 'bg-blue-600 hover:bg-blue-700 text-white',
        border: 'border-blue-600',
        dot: 'bg-white',
        pillBg: 'bg-blue-100 text-blue-800 border-blue-300',
        labelVi: 'Đã chốt lịch',
        colorName: 'Xanh dương'
      };
    case 'completed':
      return {
        bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        border: 'border-emerald-600',
        dot: 'bg-white',
        pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        labelVi: 'Đã xong',
        colorName: 'Xanh lá'
      };
    case 'on_hold':
    default:
      return {
        bg: 'bg-slate-600 hover:bg-slate-700 text-white',
        border: 'border-slate-600',
        dot: 'bg-white',
        pillBg: 'bg-slate-100 text-slate-800 border-slate-300',
        labelVi: 'Tạm dừng',
        colorName: 'Xám'
      };
  }
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  projects,
  onSelectProject
}) => {
  const todayCanberraStr = getCanberraCurrentDateString();
  const [initialYear, initialMonth] = todayCanberraStr.split('-').map(Number);

  // Default calendar month/year
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    return new Date(initialYear, initialMonth - 1, 1);
  });

  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    return todayCanberraStr;
  });

  const activeYear = currentDate.getFullYear();
  const activeMonth = currentDate.getMonth();

  const monthNamesVi = [
    'Tháng 1 (January)', 'Tháng 2 (February)', 'Tháng 3 (March)', 'Tháng 4 (April)',
    'Tháng 5 (May)', 'Tháng 6 (June)', 'Tháng 7 (July)', 'Tháng 8 (August)',
    'Tháng 9 (September)', 'Tháng 10 (October)', 'Tháng 11 (November)', 'Tháng 12 (December)'
  ];

  const daysOfWeek = [
    { key: 'mon', vi: 'Thứ 2', en: 'Mon' },
    { key: 'tue', vi: 'Thứ 3', en: 'Tue' },
    { key: 'wed', vi: 'Thứ 4', en: 'Wed' },
    { key: 'thu', vi: 'Thứ 5', en: 'Thu' },
    { key: 'fri', vi: 'Thứ 6', en: 'Fri' },
    { key: 'sat', vi: 'Thứ 7', en: 'Sat' },
    { key: 'sun', vi: 'Chủ Nhật', en: 'Sun' },
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(activeYear, activeMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(activeYear, activeMonth + 1, 1));
  };

  const handleGoToday = () => {
    const [tYear, tMonth] = todayCanberraStr.split('-').map(Number);
    setCurrentDate(new Date(tYear, tMonth - 1, 1));
    setSelectedDay(todayCanberraStr);
  };

  // Helper to format Date to YYYY-MM-DD string
  const toDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a project is active on a given date string 'YYYY-MM-DD'
  const isProjectOnDate = (project: Project, dateStr: string): boolean => {
    const start = project.scheduledStartDate;
    const end = project.targetCompletionDate || project.actualCompletionDate || project.scheduledStartDate;

    if (!start && !end) {
      return project.createdAt === dateStr;
    }

    if (start && !end) {
      return start === dateStr;
    }

    if (!start && end) {
      return end === dateStr;
    }

    if (start && end) {
      return dateStr >= start && dateStr <= end;
    }

    return false;
  };

  // Calculate calendar grid days for the active month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(activeYear, activeMonth, 1);
    const lastDayOfMonth = new Date(activeYear, activeMonth + 1, 0);

    // Monday-based index (0 = Monday, 6 = Sunday)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: Array<{
      date: Date;
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      projects: Project[];
    }> = [];

    // 1. Previous month trailing days
    const prevMonthLastDay = new Date(activeYear, activeMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(activeYear, activeMonth - 1, prevMonthLastDay - i);
      const dateStr = toDateString(d);
      days.push({
        date: d,
        dateStr,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: dateStr === todayCanberraStr,
        projects: projects.filter(p => isProjectOnDate(p, dateStr))
      });
    }

    // 2. Current month days
    const totalDaysInMonth = lastDayOfMonth.getDate();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(activeYear, activeMonth, i);
      const dateStr = toDateString(d);
      days.push({
        date: d,
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayCanberraStr,
        projects: projects.filter(p => isProjectOnDate(p, dateStr))
      });
    }

    // 3. Next month leading days to complete full weeks
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(activeYear, activeMonth + 1, i);
      const dateStr = toDateString(d);
      days.push({
        date: d,
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayCanberraStr,
        projects: projects.filter(p => isProjectOnDate(p, dateStr))
      });
    }

    return days;
  }, [activeYear, activeMonth, projects, todayCanberraStr]);

  // Projects scheduled on the currently selected day
  const selectedDayProjects = useMemo(() => {
    if (!selectedDay) return [];
    return projects.filter(p => isProjectOnDate(p, selectedDay));
  }, [selectedDay, projects]);

  return (
    <div className="space-y-6">
      
      {/* Calendar Top Control Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Lịch Thi Công (Schedule Calendar)
              </h2>
              <span className="rounded-md bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 border border-amber-200">
                DD/MM/YYYY
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đồng bộ theo múi giờ Australia (Canberra / Sydney / Melbourne)
            </p>
          </div>
        </div>

        {/* Month Navigation & Today Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGoToday}
            className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5 text-amber-700" />
            <span>Hôm nay ({formatDate(todayCanberraStr)})</span>
          </button>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={handlePrevMonth}
              className="rounded-xl p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all cursor-pointer"
              title="Tháng trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-4 text-sm font-black text-slate-900 min-w-[180px] text-center tracking-tight">
              {monthNamesVi[activeMonth]} {activeYear}
            </span>

            <button
              onClick={handleNextMonth}
              className="rounded-xl p-2 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all cursor-pointer"
              title="Tháng sau"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* BIG MAIN CALENDAR GRID */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
        
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-900 text-white">
          {daysOfWeek.map((day, idx) => (
            <div 
              key={day.key} 
              className={`py-3 px-2 text-center ${idx !== 6 ? 'border-r border-slate-800' : ''}`}
            >
              <span className="block text-xs font-black uppercase tracking-wider">{day.vi}</span>
              <span className="block text-[10px] text-slate-400 font-semibold">{day.en}</span>
            </div>
          ))}
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
          {calendarDays.map((dayItem, idx) => {
            const isSelected = selectedDay === dayItem.dateStr;
            const hasProjects = dayItem.projects.length > 0;

            return (
              <div
                key={`${dayItem.dateStr}-${idx}`}
                onClick={() => setSelectedDay(dayItem.dateStr)}
                className={`min-h-[125px] sm:min-h-[140px] lg:min-h-[155px] p-2 flex flex-col justify-between transition-all cursor-pointer ${
                  dayItem.isCurrentMonth
                    ? 'bg-white hover:bg-amber-50/30'
                    : 'bg-slate-50/60 text-slate-400'
                } ${
                  isSelected
                    ? 'ring-3 ring-amber-500 ring-inset bg-amber-50/40 z-10'
                    : ''
                }`}
              >
                {/* Day Cell Top: Date Number & Badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black transition-all ${
                      dayItem.isToday
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                        : isSelected
                        ? 'bg-slate-900 text-white'
                        : dayItem.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayItem.dayNumber}
                  </span>

                  {hasProjects && (
                    <span className="rounded-full bg-slate-100 text-slate-700 text-[10px] font-black px-1.5 py-0.2 border border-slate-200">
                      {dayItem.projects.length} việc
                    </span>
                  )}
                </div>

                {/* Day Cell Body: PROJECT BADGES SHOWING ONLY CLIENT NAME */}
                <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[110px] pr-0.5">
                  {dayItem.projects.map((project) => {
                    const statusStyle = getCalendarStatusStyle(project.status);

                    return (
                      <button
                        key={`${dayItem.dateStr}-${project.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(project);
                        }}
                        title={`Bấm xem: ${project.clientName} (${project.projectNumber})`}
                        className={`w-full rounded-xl px-2 py-1.5 text-left text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 group cursor-pointer active:scale-97 ${statusStyle.bg}`}
                      >
                        <span className={`h-2 w-2 rounded-full shrink-0 ${statusStyle.dot} shadow-2xs`} />
                        <span className="truncate flex-1 tracking-tight text-[11.5px] leading-tight">
                          {project.clientName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Day Cell Bottom subtle hint if today */}
                {dayItem.isToday && (
                  <div className="text-[9px] font-black uppercase text-amber-700 pt-1 tracking-wider">
                    • Hôm nay
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* SELECTED DATE DRILL-DOWN PANEL */}
      {selectedDay && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-800">
                Chi Tiết Công Trình Ngày Được Chọn
              </div>
              <h3 className="text-base font-black text-slate-900">
                Ngày: {formatDate(selectedDay)} ({selectedDayProjects.length} công trình đang chạy)
              </h3>
            </div>

            {selectedDayProjects.length > 0 && (
              <span className="text-xs text-slate-500 font-medium">
                Bấm vào thẻ để mở xem chi tiết công trình
              </span>
            )}
          </div>

          {selectedDayProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500 font-medium">
              Không có công trình nào được lên lịch vào ngày {formatDate(selectedDay)}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDayProjects.map((project) => {
                const statusStyle = getCalendarStatusStyle(project.status);
                const statusMeta = getStatusMeta(project.status);

                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                        {project.projectNumber}
                      </span>

                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-black ${statusStyle.bg}`}>
                        {statusMeta.shortLabel}
                      </span>
                    </div>

                    {/* Client Name & Job info */}
                    <div>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-bold">
                        <User className="h-3 w-3 text-amber-600" />
                        <span>Khách Hàng:</span>
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        {project.clientName}
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                        {project.title}
                      </div>
                    </div>

                    {/* Address & Dates */}
                    <div className="text-xs space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{project.siteAddress}, {project.suburb}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Khởi công: <strong>{formatDate(project.scheduledStartDate)}</strong></span>
                        <span>Bàn giao: <strong>{formatDate(project.targetCompletionDate)}</strong></span>
                      </div>
                    </div>

                    {/* Click Action Hint */}
                    <div className="flex items-center justify-end text-[11px] text-amber-800 font-bold pt-1">
                      <span className="inline-flex items-center gap-0.5 hover:underline">
                        Xem chi tiết →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
