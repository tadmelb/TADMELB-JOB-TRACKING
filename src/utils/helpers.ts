import { ProjectStatus, ProjectPriority } from '../types';

/**
 * Standard Australian Canberra / Sydney timezone (AEST / AEDT UTC+10/11)
 */
export const CANBERRA_TIMEZONE = 'Australia/Canberra';

/**
 * Formats any date string or Date object strictly into Australian DD/MM/YYYY format
 * synchronized with Australia/Canberra timezone.
 */
export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return 'Chưa đặt';
  
  try {
    // If string is in YYYY-MM-DD format (from input type="date"), parse parts directly to avoid UTC shift
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }

    // If string is already in DD/MM/YYYY
    if (typeof dateString === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(d.getTime())) return String(dateString);

    const formatter = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney', // Canonical IANA zone for Canberra/NSW/ACT
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return formatter.format(d);
  } catch {
    return String(dateString);
  }
}

/**
 * Formats date and time in Australia/Canberra timezone: DD/MM/YYYY HH:mm
 */
export function formatDateTime(dateString?: string | Date | null): string {
  if (!dateString) return 'Chưa đặt';
  try {
    const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(d.getTime())) return String(dateString);

    const formatter = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return formatter.format(d);
  } catch {
    return String(dateString);
  }
}

/**
 * Gets the current real-time date in Australia/Canberra as YYYY-MM-DD
 * (Ideal for HTML <input type="date" /> default values).
 */
export function getCanberraCurrentDateString(): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Australia/Sydney',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(now); // en-CA yields YYYY-MM-DD
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Gets the current real-time date in Australia/Canberra as DD/MM/YYYY
 */
export function getCanberraCurrentFormattedDate(): string {
  try {
    const now = new Date();
    return formatDate(now);
  } catch {
    return '23/08/2026';
  }
}

/**
 * Returns real-time components in Australia/Canberra timezone for live display
 */
export function getCanberraLiveTime(): { dateStr: string; timeStr: string; tzAbbr: string; fullStr: string } {
  try {
    const now = new Date();
    
    const dateFormatter = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const timeFormatter = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const dateStr = dateFormatter.format(now);
    const timeStr = timeFormatter.format(now);

    return {
      dateStr,
      timeStr,
      tzAbbr: 'Canberra (AEST)',
      fullStr: `${dateStr} ${timeStr}`
    };
  } catch {
    return {
      dateStr: '23/08/2026',
      timeStr: '12:00:00',
      tzAbbr: 'Canberra',
      fullStr: '23/08/2026 12:00:00'
    };
  }
}

export function getStatusMeta(status: ProjectStatus) {
  switch (status) {
    case 'urgent':
    case 'pending':
      return {
        label: 'Urgent Job',
        labelVi: 'Công việc gấp / Cần xử lý ngay',
        shortLabel: '🚨 Urgent Job',
        badgeClass: 'bg-red-600 text-white border-red-700 font-bold',
        dotClass: 'bg-red-600',
        borderClass: 'border-red-500',
        icon: 'Flame'
      };
    case 'confirmed':
      return {
        label: 'Confirmed & Scheduled',
        labelVi: 'Đã xác nhận - Sẵn sàng thi công',
        shortLabel: 'Confirmed',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
        dotClass: 'bg-blue-500',
        borderClass: 'border-blue-300',
        icon: 'CheckCircle2'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        labelVi: 'Đang thi công trên công trình',
        shortLabel: 'In Progress',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
        dotClass: 'bg-purple-500',
        borderClass: 'border-purple-300',
        icon: 'Hammer'
      };
    case 'completed':
      return {
        label: 'Completed',
        labelVi: 'Đã hoàn thành bàn giao',
        shortLabel: 'Completed',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
        dotClass: 'bg-emerald-500',
        borderClass: 'border-emerald-300',
        icon: 'CheckCheck'
      };
    case 'on_hold':
    default:
      return {
        label: 'On Hold',
        labelVi: 'Tạm dừng',
        shortLabel: 'On Hold',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 font-bold',
        dotClass: 'bg-slate-400',
        borderClass: 'border-slate-300',
        icon: 'Pause'
      };
  }
}

export function getPriorityMeta(priority: ProjectPriority) {
  switch (priority) {
    case 'urgent':
      return { label: 'Urgent', class: 'bg-red-100 text-red-700 border-red-200' };
    case 'high':
      return { label: 'High', class: 'bg-orange-100 text-orange-700 border-orange-200' };
    case 'medium':
      return { label: 'Medium', class: 'bg-blue-100 text-blue-700 border-blue-200' };
    case 'low':
    default:
      return { label: 'Standard', class: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
}

export function getGoogleMapsUrl(address: string, suburb?: string): string {
  const full = `${address}${suburb ? ', ' + suburb : ''}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;
}

export function calculateProgress(tasks: { completed: boolean }[]): number {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}
