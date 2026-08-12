import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Radio, AlertTriangle, Pause, Play, ChevronLeft, Volume2 } from 'lucide-react';

interface TickerBarProps {
  items: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
  soundEnabled: boolean;
}

export const TickerBar: React.FC<TickerBarProps> = ({ items, onSelectNews, soundEnabled }) => {
  const [isPaused, setIsPaused] = useState(false);
  const breakingItems = items.filter(i => i.urgency === 'breaking' || i.urgency === 'urgent');
  const displayItems = breakingItems.length > 0 ? breakingItems : items;

  return (
    <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-y border-red-900/60 shadow-lg relative overflow-hidden z-30">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Fixed Red Tag Label */}
        <div className="bg-red-600 text-white font-extrabold px-4 py-2.5 flex items-center gap-2 shrink-0 z-20 shadow-md font-cairo text-xs sm:text-sm tracking-wide">
          <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          <span>شريط العاجل</span>
          <AlertTriangle className="w-4 h-4 text-amber-300 hidden sm:inline" />
        </div>

        {/* Scrolling Ticker Content */}
        <div className="overflow-hidden relative flex-1 py-2 font-readex">
          <div className={`flex items-center space-x-8 space-x-reverse ${isPaused ? '' : 'animate-ticker'}`}>
            {/* Duplicated list to ensure smooth seamless infinite marquee scroll */}
            {[...displayItems, ...displayItems].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => onSelectNews(item)}
                className="inline-flex items-center space-x-3 space-x-reverse text-xs sm:text-sm text-slate-100 hover:text-red-300 transition-colors cursor-pointer shrink-0 font-medium group"
              >
                <span className="bg-red-900/90 text-red-200 border border-red-700/80 text-[10px] px-2 py-0.5 rounded font-bold">
                  {item.source.nameAr}
                </span>
                <span className="text-slate-200 group-hover:underline">
                  {item.title}
                </span>
                <span className="text-slate-500 text-[11px]">
                  ({item.timeAgo})
                </span>
                <span className="text-red-500/60 font-bold px-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls (Pause/Play, Sound indicator) */}
        <div className="bg-slate-950/80 px-3 py-2 flex items-center space-x-2 space-x-reverse border-r border-slate-800 shrink-0 z-20">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title={isPaused ? 'تشغيل الشريط' : 'إيقاف الشريط مؤقتاً'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>
      </div>
    </div>
  );
};
