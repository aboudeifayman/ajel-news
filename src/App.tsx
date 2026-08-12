import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { SourceSelectorNav } from './components/SourceSelectorNav';
import { LiveNewsFeed } from './components/LiveNewsFeed';
import { AINewsCenter } from './components/AINewsCenter';
import { LiveTVPlayer } from './components/LiveTVPlayer';
import { GlobalHotspotsMap } from './components/GlobalHotspotsMap';
import { CustomAlertsModal } from './components/CustomAlertsModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { TopTopicsD3Widget } from './components/TopTopicsD3Widget';
import { INITIAL_NEWS_ITEMS, GLOBAL_SOURCES } from './data/mockNewsData';
import { NewsItem, SourceType } from './types';
import { playNewsAlertBeep } from './utils/sound';
import { Radio, RefreshCw, AlertCircle, ShieldAlert, Sparkles, Globe, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'ai' | 'tv' | 'map' | 'alerts' | 'press' | 'broadcast'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering state
  const [selectedSourceType, setSelectedSourceType] = useState<SourceType | 'all'>('all');
  const [selectedSourceId, setSelectedSourceId] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Real-time items
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Bookmarks & Alerts
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['news-101', 'news-103']);
  const [alertKeywords, setAlertKeywords] = useState<string[]>(['مجلس الأمن', 'الأمم المتحدة', 'أسعار النفط']);

  // Modals & Active selections
  const [selectedNewsForDetail, setSelectedNewsForDetail] = useState<NewsItem | null>(null);
  const [newsItemForAI, setNewsItemForAI] = useState<NewsItem | null>(null);

  // Simulated live incoming wire stream
  useEffect(() => {
    if (!autoRefresh) return;

    const simulatedLiveStreamInterval = setInterval(() => {
      // Create a new simulated live wire item from random sources
      const randomSources = [
        GLOBAL_SOURCES[0], // Reuters
        GLOBAL_SOURCES[1], // AFP
        GLOBAL_SOURCES[2], // AP
        GLOBAL_SOURCES[3], // Anadolu
        GLOBAL_SOURCES[4], // SPA
        GLOBAL_SOURCES[12], // UN
        GLOBAL_SOURCES[13], // White House
      ];
      
      const source = randomSources[Math.floor(Math.random() * randomSources.length)];
      const sampleTitles = [
        `عاجل | برقية جديدة من ${source.nameAr}: استمرار التنسيق بين المنظمات الدولية والميدانية`,
        `تطور مفاجئ | ${source.nameAr} تنقل بياناً عاجلاً حول ملف الاستقرار الاقتصادي وسلاسل التوريد`,
        `رسمياً | ${source.nameAr} تؤكد موعد الاجتماع التشاوري المقبل للأمم المتحدة`,
        `متابعة عاجلة | صدور تقرير المراقبة الميدانية من ${source.nameAr} بشأن التطورات الجارية`,
      ];

      const newId = `live-wire-${Date.now()}`;
      const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

      const newItem: NewsItem = {
        id: newId,
        title,
        summary: `نقلت وكالات الأنباء الدولية قبل قليل تفاصيل جديدة تتعلق بالمشاورات الجارية في المحافل الدولية والتنسيق مع فرق الإغاثة والمراقبين الميدانيين.`,
        fullContent: `أفاد مراسلو الوكالات ببدء جولة جديدة من المباحثات الدبلوماسية. وذكر البيان الصادر عن ${source.nameAr} الالتزام التام بالمعايير والأطر المعتمدة وتسهيل الوصول الإنساني عاجلاً.`,
        source,
        category: 'middle_east',
        urgency: 'breaking',
        timestamp: new Date().toISOString(),
        timeAgo: 'الآن',
        isVerified: true,
        viewsCount: 1500,
        tags: ['عاجل', 'بث_مباشر', source.nameAr],
      };

      setNewsList((prev) => [newItem, ...prev.slice(0, 30)]);

      if (soundEnabled) {
        playNewsAlertBeep();
      }
    }, 18000); // Trigger every 18s

    return () => clearInterval(simulatedLiveStreamInterval);
  }, [autoRefresh, soundEnabled]);

  // Manual Refresh Handler
  const handleTriggerManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (soundEnabled) {
        playNewsAlertBeep();
      }
    }, 600);
  };

  // Filter logic
  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      // Source Type Filter
      if (selectedSourceType !== 'all' && item.source.type !== selectedSourceType) {
        return false;
      }
      // Specific Source ID Filter
      if (selectedSourceId !== 'all' && item.source.id !== selectedSourceId) {
        return false;
      }
      // Regional / Topic Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesSource = item.source.nameAr.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesSource) {
          return false;
        }
      }
      return true;
    });
  }, [newsList, selectedSourceType, selectedSourceId, selectedCategory, searchQuery]);

  // Bookmark Toggle
  const handleBookmarkToggle = (item: NewsItem) => {
    setBookmarkedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  // AI Summarize/Fact-Check redirect
  const handleTriggerAIForNews = (item: NewsItem) => {
    setNewsItemForAI(item);
    setActiveTab('ai');
  };

  const bookmarkedNewsItems = useMemo(() => {
    return newsList.filter((i) => bookmarkedIds.includes(i.id));
  }, [newsList, bookmarkedIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo selection:bg-red-600 selection:text-white">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        bookmarkedCount={bookmarkedIds.length}
        onTriggerManualRefresh={handleTriggerManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Breaking Ticker Bar */}
      <TickerBar
        items={newsList}
        onSelectNews={(item) => setSelectedNewsForDetail(item)}
        soundEnabled={soundEnabled}
      />

      {/* Secondary Source & Category Navigation Bar */}
      {activeTab === 'feed' && (
        <SourceSelectorNav
          selectedSourceType={selectedSourceType}
          setSelectedSourceType={setSelectedSourceType}
          selectedSourceId={selectedSourceId}
          setSelectedSourceId={setSelectedSourceId}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <LiveNewsFeed
                newsItems={filteredNews}
                onSelectNews={(item) => setSelectedNewsForDetail(item)}
                onFactCheckNews={(item) => handleTriggerAIForNews(item)}
                onAISummarizeNews={(item) => handleTriggerAIForNews(item)}
                onBookmarkToggle={handleBookmarkToggle}
                bookmarkedIds={bookmarkedIds}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <TopTopicsD3Widget
                newsItems={newsList}
                onSelectTopic={(tag) => setSearchQuery(tag)}
              />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <AINewsCenter
            initialNewsItemForAnalysis={newsItemForAI}
            onClearInitialNewsItem={() => setNewsItemForAI(null)}
          />
        )}

        {activeTab === 'tv' && <LiveTVPlayer />}

        {activeTab === 'map' && (
          <GlobalHotspotsMap
            newsItems={newsList}
            onSelectHotspotNews={(item) => setSelectedNewsForDetail(item)}
          />
        )}

        {activeTab === 'alerts' && (
          <CustomAlertsModal
            bookmarkedNews={bookmarkedNewsItems}
            onRemoveBookmark={(id) => setBookmarkedIds((prev) => prev.filter((i) => i !== id))}
            onSelectNews={(item) => setSelectedNewsForDetail(item)}
            alertKeywords={alertKeywords}
            onAddKeyword={(kw) => setAlertKeywords((prev) => [...prev, kw])}
            onRemoveKeyword={(kw) => setAlertKeywords((prev) => prev.filter((k) => k !== kw))}
          />
        )}
      </main>

      {/* News Article Detail Modal */}
      <NewsDetailModal
        newsItem={selectedNewsForDetail}
        onClose={() => setSelectedNewsForDetail(null)}
        onFactCheck={(item) => handleTriggerAIForNews(item)}
        onAISummarize={(item) => handleTriggerAIForNews(item)}
        onBookmarkToggle={handleBookmarkToggle}
        isBookmarked={selectedNewsForDetail ? bookmarkedIds.includes(selectedNewsForDetail.id) : false}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 mt-12 text-center text-xs text-slate-400 font-readex">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-200">عاجل نيوز (Ajel AI News Center)</span>
          </div>
          <p className="text-slate-400">
            تغطية لحظية مستمرة من جميع وكالات الأنباء العالمية والقنوات الفضائية والمنظمات الأممية الموثوقة.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>مدعوم بـ Gemini 3.6 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
