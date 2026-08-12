import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  return new GoogleGenAI({ apiKey });
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Ajel AI News API' });
});

app.post('/api/news/synthesis', async (req, res) => {
  try {
    const { category, region, focus } = req.body;
    const prompt = `أنت محرر إخباري واستراتيجي. أعد موجزاً إخبارياً عربياً موضوعياً.
التصنيف: ${category || 'جميع القطاعات'}
المنطقة: ${region || 'العالم'}
التركيز: ${focus || 'أهم التطورات'}
لا تختلق مصادر أو حقائق. أعد JSON فقط:
{"headline":"","summary":"","key_bullet_points":[],"impact_analysis":"","verified_sources":[]}`;
    const response = await getAI().models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    let data;
    try { data = JSON.parse(response.text || '{}'); }
    catch { data = { headline: '', summary: response.text || '', key_bullet_points: [], impact_analysis: '', verified_sources: [] }; }
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || 'Synthesis failed' });
  }
});

app.post('/api/news/verify', async (req, res) => {
  try {
    const { claim, source } = req.body;
    if (!claim) return res.status(400).json({ success: false, error: 'claim is required' });
    const prompt = `تحقق تحليلياً من الادعاء التالي دون اختلاق مصادر:
الادعاء: ${claim}
المصدر: ${source || 'غير محدد'}
أعد JSON فقط:
{"verdict":"","confidence_score":"","official_cross_references":[],"detailed_explanation":"","timeline_context":""}`;
    const response = await getAI().models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || 'Verification failed' });
  }
});

app.post('/api/news/translate-summarize', async (req, res) => {
  try {
    const { rawText, targetFormat } = req.body;
    if (!rawText) return res.status(400).json({ success: false, error: 'rawText is required' });
    const prompt = `ترجم ولخص النص التالي إلى العربية الفصحى بدقة.
النص: ${rawText}
نوع الإخراج: ${targetFormat || 'خبر صحفي'}
أعد JSON فقط:
{"arabic_title":"","arabic_summary":"","key_takeaways":[],"key_entities":[]}`;
    const response = await getAI().models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || 'Translation failed' });
  }
});

app.post('/api/news/chat', async (req, res) => {
  try {
    const { messages, currentTopic } = req.body;
    const contents = (messages || []).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const response = await getAI().models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: `أنت المحلل الجيوسياسي والإخباري في منصة عاجل نيوز. أجب بالعربية.
ميز بوضوح بين الحقائق المؤكدة والتحليل والتوقعات. لا تقدم التوقعات كحقائق.
الموضوع: ${currentTopic || 'غير محدد'}`
      }
    });
    res.json({ success: true, reply: response.text || '' });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || 'Chat failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ajel API listening on ${PORT}`);
});
