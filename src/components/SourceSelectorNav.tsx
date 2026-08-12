import React from 'react';
import { GLOBAL_SOURCES } from '../data/mockNewsData';
import { SourceType } from '../types';
import { Globe, Tv, Building2, Shield, CheckCircle2 } from 'lucide-react';

interface SourceSelectorNavProps {
  selectedSourceType: SourceType | 'all';
  setSelectedSourceType: (type: SourceType | 'all') => void;
  selectedSourceId: string | 'all';
  setSelectedSourceId: (id: string | 'all') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const SourceSelectorNav: React.FC<SourceSelectorNavProps> = ({
  selectedSourceType,
  setSelectedSourceType,
  selectedSourceId,
  setSelectedSourceId,
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = [
    { id: 'all', name: 'الجميع' },
    { id: 'middle_east', name: 'الشرق الأوسط' },
    { id: 'world', name: 'الأخبار الدولية' },
    { id: 'europe', name: 'أوروبا' },
    { id: 'americas', name: 'الأمريكتان' },
    { id: 'asia', name: 'آسيا' },
    { id: 'economy', name: 'الاقتصاد والأسواق' },
    { id: 'tech', name: 'التكنولوجيا' },
    { id: 'crisis', name: 'أزمات وطوارئ' },
  ];

  const sourceTypes = [
    { id: 'all', name: 'جميع المصادر الموثوقة', icon: Globe, count: GLOBAL_SOURCES.length },
    { id: 'agency', name: 'وكالات الأنباء العالمية', icon: Globe, count: GLOBAL_SOURCES.filter(s => s.type === 'agency').length },
    { id: 'tv', name: 'القنوات التلفزيونية', icon: Tv, count: GLOBAL_SOURCES.filter(s => s.type === 'tv').length },
    { id: 'official', name: 'الصفحات الرسمية للدول', icon: Building2, count: GLOBAL_SOURCES.filter(s => s.type === 'official').length },
    { id: 'un_org', name: 'الأمم المتحدة والمنظمات الدولية', icon: Shield, count: GLOBAL_SOURCES.filter(s => s.type === 'un_org').length },
  ];

  const filteredSources = selectedSourceType === 'all' 
    ? GLOBAL_SOURCES 
    : GLOBAL_SOURCES.filter(s => s.type === selectedSourceType);

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 p-4 font-cairo">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Source Type Filter Pills */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto no-scrollbar pb-1">
          {sourceTypes.map((st) => {
            const IconComponent = st.icon;
            const isSelected = selectedSourceType === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedSourceType(st.id as any);
                  setSelectedSourceId('all');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-900/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{st.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-red-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Specific Agencies & Organizations Badges */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto no-scrollbar py-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold shrink-0 ml-2">المصدر المباشر:</span>
          <button
            onClick={() => setSelectedSourceId('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              selectedSourceId === 'all'
                ? 'bg-slate-200 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            الكل
          </button>
          {filteredSources.map((source) => {
            const isSelected = selectedSourceId === source.id;
            return (
              <button
                key={source.id}
                onClick={() => setSelectedSourceId(source.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 border ${
                  isSelected
                    ? 'bg-red-950 text-red-200 border-red-700 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{source.logo}</span>
                <span>{source.nameAr}</span>
                {source.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Regional & Topic Categories */}
        <div className="flex items-center space-x-1.5 space-x-reverse overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs text-slate-400 font-semibold shrink-0 ml-2">التصنيف:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-red-600/90 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
