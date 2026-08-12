import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Bell, Bookmark, Trash2, Plus, Check, Volume2, ShieldCheck, Share2, Sparkles } from 'lucide-react';

interface CustomAlertsModalProps {
  bookmarkedNews: NewsItem[];
  onRemoveBookmark: (id: string) => void;
  onSelectNews: (item: NewsItem) => void;
  alertKeywords: string[];
  onAddKeyword: (kw: string) => void;
  onRemoveKeyword: (kw: string) => void;
}

export const CustomAlertsModal: React.FC<CustomAlertsModalProps> = ({
  bookmarkedNews,
  onRemoveBookmark,
  onSelectNews,
  alertKeywords,
  onAddKeyword,
  onRemoveKeyword,
}) => {
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeywordInput.trim()) {
      onAddKeyword(newKeywordInput.trim());
      setNewKeywordInput('');
    }
  };

  return (
    <div className="space-y-6 font-cairo">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-600 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              مركز التنبيهات المخصصة والمحفوظات
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">إدارة تنبيهات الأخبار والمفضلة</h2>
          <p className="text-xs text-slate-400 font-readex mt-0.5">
            تخصيص الكلمات المفتاحية للأخبار العاجلة والوصول إلى مقالاتك المحفوظة دون اتصال.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keywords Alert Builder */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            منبه الكلمات المفتاحية العاجلة
          </h3>
          <p className="text-xs text-slate-400 font-readex">
            أضف كلمات تهمك ليصلك تنبيه صوتي وبصري فور صدور برقية حاسمة تضمها (مثال: مجلس الأمن، أسعار النفط، غزة...).
          </p>

          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              placeholder="إضافة كلمة مفتاحية جديدة..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </button>
          </form>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 mb-2">الكلمات النشطة حالياً:</h4>
            {alertKeywords.length === 0 ? (
              <p className="text-xs text-slate-500 font-readex">لم تقم بإضافة كلمات مفتاحية بعد.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {alertKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-amber-950/80 text-amber-200 border border-amber-800 text-xs px-3 py-1 rounded-xl flex items-center gap-2 font-bold"
                  >
                    <span>#{kw}</span>
                    <button
                      onClick={() => onRemoveKeyword(kw)}
                      className="text-amber-400 hover:text-white"
                      title="حذف الكلمة"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Saved Bookmarks List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-red-500" />
              الأخبار المحفوظة في مفضلتك ({bookmarkedNews.length})
            </h3>
          </div>

          {bookmarkedNews.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-readex">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
              لا توجد أخبار محفوظة في القائمة. يمكنك النقر على أيقونة الحفظ بجانب أي خبر لحفظه هنا.
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {bookmarkedNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectNews(item)}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="text-red-400 font-bold">{item.source.nameAr}</span>
                      <span>•</span>
                      <span>{item.timeAgo}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-red-300 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 font-readex">
                      {item.summary}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(item.id);
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                    title="حذف من المحفوظات"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
