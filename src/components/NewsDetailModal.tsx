import React from 'react';
import { NewsItem } from '../types';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  Clock, 
  Globe, 
  FileText,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface NewsDetailModalProps {
  newsItem: NewsItem | null;
  onClose: () => void;
  onFactCheck: (item: NewsItem) => void;
  onAISummarize: (item: NewsItem) => void;
  onBookmarkToggle: (item: NewsItem) => void;
  isBookmarked: boolean;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  newsItem,
  onClose,
  onFactCheck,
  onAISummarize,
  onBookmarkToggle,
  isBookmarked,
}) => {
  if (!newsItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-cairo">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl">{newsItem.source.logo}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{newsItem.source.nameAr}</span>
                {newsItem.source.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-400">{newsItem.source.country} • {newsItem.timeAgo}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            {newsItem.urgency === 'breaking' && (
              <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full animate-pulse">
                عاجل جداً
              </span>
            )}
            <span className="bg-slate-800 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full">
              تصنيف: {newsItem.category}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {newsItem.title}
          </h2>

          {newsItem.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-72">
              <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-full object-cover" />
              {newsItem.officialStatementRef && (
                <span className="absolute bottom-2 right-2 bg-slate-950/90 text-slate-300 text-[10px] px-2.5 py-1 rounded-md border border-slate-700 font-mono">
                  {newsItem.officialStatementRef}
                </span>
              )}
            </div>
          )}

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-red-400">ملخص البرقية العاجلة:</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-readex">
              {newsItem.summary}
            </p>
          </div>

          {newsItem.fullContent && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300">التفاصيل الكاملة للتقرير:</h4>
              <p className="text-xs text-slate-200 leading-relaxed font-readex whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                {newsItem.fullContent}
              </p>
            </div>
          )}

          {newsItem.location && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>موقع الحدث: <strong>{newsItem.location.name}</strong></span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => {
                onClose();
                onAISummarize(newsItem);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              تحليل Gemini
            </button>

            <button
              onClick={() => {
                onClose();
                onFactCheck(newsItem);
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              فحص الدقة والتوثيق
            </button>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => onBookmarkToggle(newsItem)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-950 border-amber-700 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
              {isBookmarked ? 'محفوظ' : 'حفظ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
