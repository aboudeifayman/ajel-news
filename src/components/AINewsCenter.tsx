import React, { useState } from 'react';
import { AISynthesisResult, FactCheckResult, NewsItem } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Send, 
  RefreshCw, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Languages, 
  BotMessageSquare, 
  ArrowRight,
  Zap,
  TrendingUp,
  Layers
} from 'lucide-react';

interface AINewsCenterProps {
  initialNewsItemForAnalysis?: NewsItem | null;
  onClearInitialNewsItem?: () => void;
}

export const AINewsCenter: React.FC<AINewsCenterProps> = ({
  initialNewsItemForAnalysis,
  onClearInitialNewsItem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'synthesis' | 'factcheck' | 'translate' | 'chat'>('synthesis');

  // 1. Synthesis State
  const [synthesisCategory, setSynthesisCategory] = useState('الشرق الأوسط والدولية');
  const [synthesisFocus, setSynthesisFocus] = useState('التطورات العاجلة والأمن الجيوسياسي والاقتصادي');
  const [synthesisResult, setSynthesisResult] = useState<AISynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // 2. Fact Check State
  const [factClaim, setFactClaim] = useState(initialNewsItemForAnalysis?.title || '');
  const [factSource, setFactSource] = useState(initialNewsItemForAnalysis?.source.nameAr || '');
  const [factResult, setFactResult] = useState<FactCheckResult | null>(null);
  const [isCheckingFact, setIsCheckingFact] = useState(false);

  // 3. Translation State
  const [wireText, setWireText] = useState(initialNewsItemForAnalysis?.fullContent || '');
  const [translationResult, setTranslationResult] = useState<any | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // 4. Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'مرحباً بك في غرفة تحليلات الذكاء الاصطناعي للمرصد الإخباري العالمي. كيف يمكنني مساعدتك في تقديم التحليل الجيوسياسي أو تقاطعات وكالات الأنباء اليوم؟',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // Trigger synthesis endpoint
  const handleGenerateSynthesis = async () => {
    setIsSynthesizing(true);
    setSynthesisError(null);
    try {
      const response = await fetch('/api/news/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: synthesisCategory, focus: synthesisFocus }),
      });
      const resData = await response.json();
      if (resData.success) {
        setSynthesisResult(resData.data);
      } else {
        setSynthesisError(resData.error || 'فشل في توليد الموجز');
      }
    } catch (err: any) {
      setSynthesisError('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Trigger Fact Check endpoint
  const handleVerifyClaim = async () => {
    if (!factClaim.trim()) return;
    setIsCheckingFact(true);
    try {
      const response = await fetch('/api/news/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: factClaim, source: factSource }),
      });
      const resData = await response.json();
      if (resData.success) {
        setFactResult(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingFact(false);
    }
  };

  // Trigger Translation endpoint
  const handleTranslateWire = async () => {
    if (!wireText.trim()) return;
    setIsTranslating(true);
    try {
      const response = await fetch('/api/news/translate-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: wireText }),
      });
      const resData = await response.json();
      if (resData.success) {
        setTranslationResult(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Trigger Chat endpoint
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatSending) return;
    const newMsg = { role: 'user' as const, content: chatInput };
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatSending(true);

    try {
      const response = await fetch('/api/news/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const resData = await response.json();
      if (resData.success) {
        setChatMessages([...updatedMessages, { role: 'assistant', content: resData.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div className="space-y-6 font-cairo">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/60 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                محرك Gemini 3.6 Flash اللحظي
              </span>
              <span className="text-indigo-300 text-xs">تحليل وتقاطع بيانات الوكالات الدولية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              مركز الذكاء الاصطناعي وصياغة الأخبار
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-readex">
              توليد الموجز التنفيذي المباشر، تفنيد الشائعات، ترجمة البرقيات الدولية، والتحليل الجيوسياسي التفاعلي.
            </p>
          </div>

          {initialNewsItemForAnalysis && (
            <div className="bg-indigo-900/60 border border-indigo-700/80 rounded-xl p-3 text-xs text-indigo-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span>تم تحميل خبر للنقد والتحليل:</span>
                <p className="font-bold line-clamp-1">{initialNewsItemForAnalysis.title}</p>
              </div>
              <button 
                onClick={onClearInitialNewsItem}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Navigation Tabs */}
      <div className="flex items-center space-x-2 space-x-reverse border-b border-slate-800 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveSubTab('synthesis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'synthesis'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          الموجز الذكي اللحظي
        </button>

        <button
          onClick={() => setActiveSubTab('factcheck')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'factcheck'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          تفنيد الشائعات وتدقيق الخبر
        </button>

        <button
          onClick={() => setActiveSubTab('translate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'translate'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Languages className="w-4 h-4 text-cyan-400" />
          ترجمة البرقيات الرسمية
        </button>

        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <BotMessageSquare className="w-4 h-4 text-purple-400" />
          المحلل الجيوسياسي التفاعلي
        </button>
      </div>

      {/* SubTab 1: AI News Synthesis */}
      {activeSubTab === 'synthesis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">قطاع الأخبار والمنطقة</label>
              <input
                type="text"
                value={synthesisCategory}
                onChange={(e) => setSynthesisCategory(e.target.value)}
                placeholder="مثال: الشرق الأوسط، الأمم المتحدة، أسواق الطاقة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">زاوية التركيز الصحفي</label>
              <input
                type="text"
                value={synthesisFocus}
                onChange={(e) => setSynthesisFocus(e.target.value)}
                placeholder="مثال: القرارات المباشرة ومواقف الدول الكبرى..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateSynthesis}
            disabled={isSynthesizing}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition-all"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                جاري تجميع وتقاطع الأخبار من رويترز وفرانس برس والأمم المتحدة...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                إنشاء الموجز الإخباري المباشر الآن
              </>
            )}
          </button>

          {synthesisError && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-4 rounded-xl">
              {synthesisError}
            </div>
          )}

          {synthesisResult && (
            <div className="bg-slate-950 border border-indigo-900/80 rounded-2xl p-6 space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  موجز Gemini الإخباري اللحظي
                </span>
                <span className="text-[11px] text-slate-400 font-mono">المصدر: تقاطع 8 وكالات أنباء</span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{synthesisResult.headline}</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                {synthesisResult.summary}
              </p>

              <div>
                <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  أبرز نقاط التغطية المباشرة:
                </h4>
                <ul className="space-y-2">
                  {synthesisResult.key_bullet_points?.map((pt, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {synthesisResult.impact_analysis && (
                <div className="bg-slate-900/90 border border-indigo-900/60 p-4 rounded-xl text-xs space-y-1">
                  <h4 className="font-bold text-indigo-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    التحليل والتبعات الجيوسياسية:
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-readex">{synthesisResult.impact_analysis}</p>
                </div>
              )}

              {synthesisResult.verified_sources && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>تم التقاطع من المصادر الموثوقة:</span>
                  {synthesisResult.verified_sources.map((src, i) => (
                    <span key={i} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-bold">
                      ✓ {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Fact Check & Source Verification */}
      {activeSubTab === 'factcheck' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الخبر أو الادعاء المراد التحقق من صحته</label>
              <textarea
                rows={3}
                value={factClaim}
                onChange={(e) => setFactClaim(e.target.value)}
                placeholder="أدخل نص الخبر أو البيان المتداول..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">المصدر المنسوب إليه الخبر (إن وجد)</label>
              <input
                type="text"
                value={factSource}
                onChange={(e) => setFactSource(e.target.value)}
                placeholder="مثال: بيان منسوب للوزارة، منشور على مواقع التواصل..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleVerifyClaim}
              disabled={isCheckingFact || !factClaim.trim()}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isCheckingFact ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري مطابقة الخبر مع السجلات الرسمية للأمم المتحدة والوكالات...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  بدء فحص وتدقيق الخبر مع الوكالات الرسمية
                </>
              )}
            </button>
          </div>

          {factResult && (
            <div className="bg-slate-950 border border-emerald-900/80 rounded-2xl p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    factResult.verdict === 'مؤكد رسمياً'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : factResult.verdict === 'مضلل / شائعة'
                      ? 'bg-red-950 text-red-300 border border-red-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {factResult.verdict}
                  </span>
                  <span className="text-xs text-slate-400">نسبة الدقة: <strong className="text-emerald-400 font-mono">{factResult.confidence_score}</strong></span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl text-xs space-y-2 border border-slate-800">
                <h4 className="font-bold text-slate-200">النتيجة والتقييم الصحفي:</h4>
                <p className="text-slate-300 leading-relaxed font-readex">{factResult.detailed_explanation}</p>
              </div>

              {factResult.official_cross_references && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2">المصادر المرجعية المقاطعة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {factResult.official_cross_references.map((ref, idx) => (
                      <span key={idx} className="bg-slate-900 text-emerald-400 border border-emerald-900/60 text-[11px] px-2.5 py-1 rounded-lg">
                        ✓ {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SubTab 3: Diplomatic & Agency Translation */}
      {activeSubTab === 'translate' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">نص البرقية الإخبارية أو البيان الأجنبي (إنجليزي، فرنسي، روسي...)</label>
            <textarea
              rows={5}
              value={wireText}
              onChange={(e) => setWireText(e.target.value)}
              placeholder="Paste raw agency wire report here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            onClick={handleTranslateWire}
            disabled={isTranslating || !wireText.trim()}
            className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isTranslating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                جاري الترجمة الدبلوماسية وتوزيع المحاور...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                ترجمة وتلخيص إلى العربية الفصحى الإخبارية
              </>
            )}
          </button>

          {translationResult && (
            <div className="bg-slate-950 border border-cyan-900/80 rounded-2xl p-6 space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">{translationResult.arabic_title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-readex">
                {translationResult.arabic_summary}
              </p>

              {translationResult.key_takeaways && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">أبرز المخرجات:</h4>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {translationResult.key_takeaways.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                        <span className="text-cyan-400">▪</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SubTab 4: Interactive Geopolitical Assistant Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[520px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed font-readex ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isChatSending && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  جاري صياغة التحليل الإخباري الجيوسياسي...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="اسأل عن خلفية حدث، قرارات مجلس الأمن، أو السيناريوهات المتوقعة..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={isChatSending || !chatInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
