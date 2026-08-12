import React, { useState } from 'react';
import { NewsItem } from '../types';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  Clock, 
  ExternalLink, 
  Eye, 
  FileText, 
  TrendingUp,
  Flame,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface LiveNewsFeedProps {
  newsItems: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
  onFactCheckNews: (item: NewsItem) => void;
  onAISummarizeNews: (item: NewsItem) => void;
  onBookmarkToggle: (item: NewsItem) => void;
  bookmarkedIds: string[];
}

export const LiveNewsFeed: React.FC<LiveNewsFeedProps> = ({
  newsItems,
  onSelectNews,
  onFactCheckNews,
  onAISummarizeNews,
  onBookmarkToggle,
  bookmarkedIds,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${item.title}\nالمصدر: ${item.source.nameAr}\nالمزيد عبر المرصد الإخباري العالمي`;
    navigator.clipboard.writeText(shareText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (newsItems.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-200 font-cairo">لا توجد أخبار تنطبق مع التصفية الحالية</h3>
        <p className="text-xs text-slate-400 mt-2 font-readex">
          يرجى تغيير تصنيف المصدر أو الكلمة الدليلية في شريط البحث للحصول على التحديثات المباشرة.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-cairo">
      {/* Live Stream Status Summary Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>عرض <strong className="text-white">{newsItems.length}</strong> خبراً عاجلاً متصلاً الآن بالبث المباشر</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            أولوية البث حسب التوقيت اللحظي
          </span>
        </div>
      </div>

      {/* Grid of News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsItems.map((item) => {
          const isBookmarked = bookmarkedIds.includes(item.id);
          const isBreaking = item.urgency === 'breaking';
          const isUrgent = item.urgency === 'urgent';

          return (
            <div
              key={item.id}
              onClick={() => onSelectNews(item)}
              className={`bg-slate-900/90 rounded-2xl border transition-all duration-300 hover:shadow-2xl cursor-pointer group flex flex-col justify-between overflow-hidden relative ${
                isBreaking
                  ? 'border-red-600/80 shadow-lg shadow-red-950/40 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/30'
                  : isUrgent
                  ? 'border-amber-600/50 hover:border-amber-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Top Banner: Source & Urgency */}
              <div className="p-4 pb-2 border-b border-slate-800/60 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-xl">{item.source.logo}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100 font-cairo">{item.source.nameAr}</span>
                      {item.source.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="مصدر موثوق ومفعل" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-readex">{item.source.country}</span>
                  </div>
                </div>

                {/* Urgency Badge */}
                <div className="flex items-center gap-2">
                  {isBreaking && (
                    <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      عاجل جداً
                    </span>
                  )}
                  {isUrgent && (
                    <span className="bg-amber-950 text-amber-300 border border-amber-700/80 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      هام
                    </span>
                  )}
                  {item.urgency === 'official' && (
                    <span className="bg-blue-950 text-blue-300 border border-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      بيان رسمى
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.timeAgo}
                  </span>
                </div>
              </div>

              {/* Main Headline & Summary */}
              <div className="p-4 space-y-3 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors leading-snug font-cairo">
                  {item.title}
                </h2>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-readex">
                  {item.summary}
                </p>

                {/* Optional Image Thumbnail */}
                {item.imageUrl && (
                  <div className="relative h-40 rounded-xl overflow-hidden mt-2 border border-slate-800">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    {item.officialStatementRef && (
                      <span className="absolute bottom-2 right-2 bg-slate-950/90 text-slate-300 text-[10px] px-2 py-1 rounded-md border border-slate-700 font-mono">
                        {item.officialStatementRef}
                      </span>
                    )}
                  </div>
                )}

                {/* Location & Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/40">
                  {item.location && (
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      📍 {item.location.name}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 space-x-reverse text-xs">
                  {/* AI Quick Briefing */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAISummarizeNews(item);
                    }}
                    className="flex items-center gap-1 text-indigo-300 hover:text-indigo-100 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                    title="تلخيص وتحليل الخبر بالذكاء الاصطناعي"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    تحليل Gemini
                  </button>

                  {/* Fact-Check */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFactCheckNews(item);
                    }}
                    className="flex items-center gap-1 text-emerald-300 hover:text-emerald-100 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                    title="تدقيق صحة الخبر وتقاطع المصادر"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    تدقيق الخبر
                  </button>
                </div>

                <div className="flex items-center space-x-1 space-x-reverse">
                  {/* Bookmark Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmarkToggle(item);
                    }}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      isBookmarked
                        ? 'bg-amber-950 border-amber-700 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ الخبر'}
                  >
                    <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>

                  {/* Copy / Share */}
                  <button
                    onClick={(e) => handleCopy(item, e)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="نسخ ومشاركة الخبر"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
