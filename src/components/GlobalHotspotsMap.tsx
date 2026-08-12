import React, { useState } from 'react';
import { GLOBAL_HOTSPOTS } from '../data/mockNewsData';
import { HotspotRegion, NewsItem } from '../types';
import { MapPin, AlertCircle, Globe, Flame, ShieldAlert, ArrowLeft } from 'lucide-react';

interface GlobalHotspotsMapProps {
  newsItems: NewsItem[];
  onSelectHotspotNews: (news: NewsItem) => void;
}

export const GlobalHotspotsMap: React.FC<GlobalHotspotsMapProps> = ({
  newsItems,
  onSelectHotspotNews,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotRegion>(GLOBAL_HOTSPOTS[0]);

  // Filter items matching hotspot location or tags
  const hotspotNews = newsItems.filter(item => 
    item.location?.name.includes(selectedHotspot.nameAr) ||
    item.summary.includes(selectedHotspot.nameAr) ||
    item.title.includes(selectedHotspot.nameAr) ||
    item.category === 'middle_east' && selectedHotspot.id === 'hotspot-gaza' ||
    item.category === 'world' && selectedHotspot.id === 'hotspot-geneva'
  );

  return (
    <div className="space-y-6 font-cairo">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              خريطة البؤر والأزمات الجيوسياسية
            </span>
            <span className="text-xs text-slate-400">مراقبة الأقمار الاصطناعية وتغطية المراسلين</span>
          </div>
          <h2 className="text-xl font-bold text-white">خريطة الأحداث العالمية المباشرة</h2>
          <p className="text-xs text-slate-400 font-readex mt-0.5">
            اختر بؤرة الحدث لعرض آخر الأنباء العاجلة الموثقة من الوكالات الميدانية والمنظمات الدولية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Map Radar View */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-2xl">
          {/* Grid Background Lines to simulate Newsroom Intelligence Monitor */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-mono bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
              🛰️ رادار التغطية المباشرة: نشط
            </span>
            <span className="text-xs text-slate-400">انقر على الخريطة لاختيار بؤرة التوتر</span>
          </div>

          {/* Interactive Hotspot Buttons List */}
          <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GLOBAL_HOTSPOTS.map((hotspot) => {
              const isSelected = selectedHotspot.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => setSelectedHotspot(hotspot)}
                  className={`p-3.5 rounded-xl border text-right transition-all duration-300 relative group overflow-hidden ${
                    isSelected
                      ? 'bg-red-950/80 border-red-600 text-white shadow-xl shadow-red-950/60 scale-102'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-cairo flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${hotspot.urgency === 'breaking' ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`}></span>
                      {hotspot.nameAr}
                    </span>
                    <span className="bg-slate-950 text-slate-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {hotspot.activeItemsCount} خبراً
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 font-readex">
                    {hotspot.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
            <span>البؤرة المحددة حالياً: <strong className="text-white">{selectedHotspot.nameAr}</strong></span>
            <span className="text-slate-400">إحداثيات: {selectedHotspot.lat.toFixed(2)}, {selectedHotspot.lng.toFixed(2)}</span>
          </div>
        </div>

        {/* Hotspot Wire Feed Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                أخبار بؤرة: {selectedHotspot.nameAr}
              </h3>
              <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                عاجل
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-4 font-readex">
              {selectedHotspot.description}
            </p>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {(hotspotNews.length > 0 ? hotspotNews : newsItems.slice(0, 3)).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHotspotNews(item)}
                  className="bg-slate-950 hover:bg-slate-850 p-3 rounded-xl border border-slate-800 hover:border-red-600/50 transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-red-400 font-bold">{item.source.nameAr}</span>
                    <span className="font-mono">{item.timeAgo}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-red-300 leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
