import React, { useState } from 'react';
import { MOCK_TV_CHANNELS } from '../data/mockNewsData';
import { TVChannel } from '../types';
import { Tv, Play, Radio, Volume2, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export const LiveTVPlayer: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<TVChannel>(MOCK_TV_CHANNELS[0]);

  return (
    <div className="space-y-6 font-cairo">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              بث تلفزيوني مباشر 24/7
            </span>
            <span className="text-xs text-slate-400">القنوات الفضائية والإخبارية العالمية</span>
          </div>
          <h2 className="text-xl font-bold text-white">مركز البث التلفزيوني المباشر</h2>
          <p className="text-xs text-slate-400 font-readex mt-0.5">
            متابعة البث الحي للقنوات الفضائية والرسمية مع التغطية الخاصة للخطابات والبيانات العاجلة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Stream Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
            {selectedChannel.embedType === 'youtube' && selectedChannel.youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedChannel.youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1`}
                title={selectedChannel.nameAr}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center p-8 space-y-3">
                <Radio className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                <p className="text-sm text-slate-300 font-bold">جاري تحميل البث المباشر لـ {selectedChannel.nameAr}...</p>
              </div>
            )}

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800 text-white text-xs px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold">{selectedChannel.nameAr}</span>
              <span className="text-slate-400">({selectedChannel.country})</span>
            </div>
          </div>

          {/* Channel Info Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-2xl">{selectedChannel.logo}</span>
              <div>
                <h3 className="text-base font-bold text-white">{selectedChannel.nameAr}</h3>
                <p className="text-xs text-amber-400 font-readex flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  البرنامج الحالي: {selectedChannel.currentProgram}
                </p>
              </div>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${selectedChannel.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              فتح في YouTube
            </a>
          </div>
        </div>

        {/* Channel Switcher Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">القنوات الفضائية المتاحة</h3>
          
          <div className="space-y-2">
            {MOCK_TV_CHANNELS.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;
              return (
                <div
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-950/60 border-red-700 text-white shadow-lg shadow-red-950/50'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-2xl">{channel.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold">{channel.nameAr}</h4>
                      <p className="text-[10px] text-slate-400 font-readex line-clamp-1">{channel.currentProgram}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        شغال
                      </span>
                    ) : (
                      <Play className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
