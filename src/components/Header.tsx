import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Radio, 
  Bell, 
  Search, 
  Sparkles, 
  Tv, 
  MapPin, 
  Clock, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Bookmark,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'ai' | 'tv' | 'map' | 'alerts' | 'press' | 'broadcast';
  setActiveTab: (tab: 'feed' | 'ai' | 'tv' | 'map' | 'alerts' | 'press' | 'broadcast') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  bookmarkedCount: number;
  onTriggerManualRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  autoRefresh,
  setAutoRefresh,
  soundEnabled,
  setSoundEnabled,
  bookmarkedCount,
  onTriggerManualRefresh,
  isRefreshing,
}) => {
  const [timeMakkah, setTimeMakkah] = useState('');
  const [timeGMT, setTimeGMT] = useState('');
  const [timeDC, setTimeDC] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      // GMT
      setTimeGMT(now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Makkah (Asia/Riyadh - UTC+3)
      setTimeMakkah(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Riyadh', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Washington DC (America/New_York)
      setTimeDC(now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Top Bar: Clocks & Global Status */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 font-readex">
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="flex items-center text-red-500 font-bold bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-800/50">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-2 inline-block"></span>
            شبكة البث العاجل
          </span>
          <span className="text-slate-300 hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            42 وكالة أنباء ومنظمة رسمية موثوقة
          </span>
        </div>

        {/* World Clocks */}
        <div className="flex items-center space-x-4 space-x-reverse text-[11px] font-mono tracking-wide text-slate-300">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-400" />
            <span className="text-slate-400">مكة:</span>
            <span className="text-amber-300 font-bold">{timeMakkah || '16:00:00'}</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-slate-400">جرينتش:</span>
            <span className="text-cyan-300 font-bold">{timeGMT || '13:00:00'}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-slate-400">واشنطن:</span>
            <span className="text-slate-200 font-bold">{timeDC || '09:00:00'}</span>
          </div>
        </div>
      </div>

      {/* Main Branding & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={() => setActiveTab('feed')} 
            className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
          >
            {/* Rotating 3D Globe Logo Icon */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 via-slate-900 to-cyan-900 flex items-center justify-center border-2 border-red-500/60 globe-glow group-hover:scale-110 transition-transform duration-300 overflow-hidden relative">
                <Globe className="w-7 h-7 text-cyan-300 animate-spin-globe relative z-10" />
                {/* Orbit ring effect */}
                <div className="absolute inset-0 border-t-2 border-red-400/80 rounded-full animate-ping opacity-40"></div>
                <div className="absolute inset-0.5 border-b-2 border-amber-400/80 rounded-full animate-spin-slow opacity-60"></div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white/80"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-cairo flex items-center gap-2">
                  <span className="text-white">عاجل <span className="text-red-500">نيوز</span></span>
                  <span className="text-xs bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-mono font-black px-1.5 py-0.5 border border-red-800/80 rounded bg-slate-950">
                    Ajel AI News
                  </span>
                </h1>
                <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  LIVE 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-readex">
                تغطية إخبارية حية ومباشرة مدعومة بالذكاء الاصطناعي لحظة بلحظة
              </p>
            </div>
          </div>

          {/* Quick Refresh Mobile */}
          <button
            onClick={onTriggerManualRefresh}
            disabled={isRefreshing}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="تحديث فورياً"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-red-400' : ''}`} />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في عاجل رويترز، فرانس برس، الأمم المتحدة..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl px-4 py-2 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2 text-slate-500 hover:text-slate-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded"
            >
              مسح
            </button>
          )}
        </div>

        {/* Right Switch Controls & Tabs */}
        <div className="flex items-center space-x-2 space-x-reverse w-full md:w-auto justify-end">
          {/* Sound alert toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-red-950/60 border-red-800 text-red-300 hover:bg-red-900/80'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'صوت التنبيهات مفعّل' : 'تفعيل صوت الأخبار العاجلة'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'التنبيه الصوتي' : 'صامت'}</span>
          </button>

          {/* Auto Refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              autoRefresh
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="تحديث تلقائي كل 10 ثوانٍ"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin-slow text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{autoRefresh ? 'تحديث تلقائي (10ث)' : 'تحديث يدوي'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={onTriggerManualRefresh}
            disabled={isRefreshing}
            className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-400' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center space-x-1 space-x-reverse py-2 min-w-max">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              تغذية الأخبار المباشرة
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200 border border-indigo-900/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              مركز الذكاء الاصطناعي (Gemini)
              <span className="bg-indigo-500 text-[9px] text-white px-1.5 py-0.2 rounded-full font-sans">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('tv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tv'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
              البث المباشر للقنوات
              <span className="bg-red-900 text-red-200 text-[10px] px-1.5 py-0.2 rounded-full">4 قنوات</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              خريطة بؤر الأحداث
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${
                activeTab === 'alerts'
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              التنبيهات والمحفوظات
              {bookmarkedCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
