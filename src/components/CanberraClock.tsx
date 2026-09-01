import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { getCanberraLiveTime } from '../utils/helpers';

export const CanberraClock: React.FC = () => {
  const [liveTime, setLiveTime] = useState(getCanberraLiveTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(getCanberraLiveTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-1.5 border border-slate-800 shadow-inner"
      title="Thời gian thực múi giờ Australia (Canberra / Sydney / Melbourne) định dạng DD/MM/YYYY"
    >
      <div className="relative flex items-center justify-center">
        <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      <div className="flex items-center gap-1.5 text-xs font-mono">
        {/* Real-time Date DD/MM/YYYY */}
        <span className="font-black text-amber-300 tracking-tight">
          {liveTime.dateStr}
        </span>

        <span className="text-slate-500 font-bold">•</span>

        {/* Real-time 24h Time */}
        <span className="font-bold text-white tracking-widest text-[11px]">
          {liveTime.timeStr}
        </span>

        {/* Timezone Badge */}
        <span className="hidden sm:inline-block rounded bg-amber-500/20 text-amber-300 px-1 py-0.2 text-[9px] font-sans font-black tracking-wider uppercase border border-amber-500/30">
          Canberra
        </span>
      </div>
    </div>
  );
};
