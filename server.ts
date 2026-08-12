import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client safely on server side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint 1: Generate AI Live News Executive Synthesis / Briefing
app.post("/api/news/synthesis", async (req, res) => {
  try {
    const { category, region, focus } = req.body;
    const ai = getGeminiClient();

    const prompt = `أنت محرر إخباري رئيسي في مركز الأخبار العالمي العاجل.
قم بإنشاء "موجز إخباري استراتيجي عاجل بلحظة بلحظة" يتعلق بـ:
- التصنيف: ${category || "جميع القطاعات"}
- المنطقة: ${region || "جميع أرجاء العالم"}
- التركيز الخاص: ${focus || "أهم التطورات الجيوسياسية والاقتصادية المباشرة"}

تضمين الأخبار المحدثة من وكالات الأنباء العالمية (رويترز، فرانس برس، أسوشيتد برس)، القنوات التلفزيونية، والمنظمات الدولية (الأمم المتحدة، منظمة الصحة العالمية).

نسق الإجابة بتنسيق JSON يحتوي على التراكيب التالية:
1. headline: عنوان رئيسي صادم واحترافي.
2. summary: ملخص تنفيذي سريح في 3 جمل.
3. key_bullet_points: قائمة من 4 إلى 6 نقاط عاجلة ومباشرة بأسلوب وكالات الأنباء.
4. impact_analysis: تحليل سريع للتبعات الجيوسياسية أو الاقتصادية.
5. verified_sources: قائمة بأسماء الوكالات والمنظمات التي تم تقاطع الأخبار منها.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating news synthesis:", error);
    res.status(500).json({
      success: false,
      error: error.message || "فشل في توليد الموجز الإخباري المباشر",
    });
  }
});

// API Endpoint 2: Fact-Check & Source Verification
app.post("/api/news/verify", async (req, res) => {
  try {
    const { claim, source } = req.body;
    if (!claim) {
      return res.status(400).json({ success: false, error: "النص المطلوب التحقق منه مفقود" });
    }

    const ai = getGeminiClient();

    const prompt = `أنت وحدة التحقق من صحة الأخبار وتفنيد الشائعات (Fact-Checking Unit) لشبكة وكالات الأنباء العالمية.
قم بتحليل هذا الخبر/الادعاء التالي:
الخبر: "${claim}"
المصدر المذكور: "${source || "غير محدد"}"

قم بإرجاع النتيجة بتنسيق JSON يتضمن:
1. verdict: أحد الخيارات التالية: ["مؤكد رسمياً", "تحت التحقق والتدقيق", "مضلل / شائعة", "مقتطع من سياقه"]
2. confidence_score: نسبة مئوية (مثال 95%)
3. official_cross_references: قائمة بالوكالات الرسمية والمنظمات الدولية المؤكدة أو النافية (مثل الأمم المتحدة، الخارجية، رويترز، إلخ)
4. detailed_explanation: شرح مفصل باللغة العربية بأسلوب صحفي دقيق ومهني.
5. timeline_context: سياق زمني أحدث للموضوع.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error verifying news:", error);
    res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ أثناء التحقق من الخبر",
    });
  }
});

// API Endpoint 3: Translate & Summarize Wire Reports
app.post("/api/news/translate-summarize", async (req, res) => {
  try {
    const { rawText, targetFormat } = req.body;
    if (!rawText) {
      return res.status(400).json({ success: false, error: "النص المراد ترجمته مفقود" });
    }

    const ai = getGeminiClient();

    const prompt = `أنت صياغة وتوجيه الأخبار العاجلة الدولية.
ترجم ويلخص هذا البيان/الخبر من أي لغة إلى العربية الفصحى الإخبارية مع مراعاة دقة المصطلحات السياسية والدبلوماسية والأممية:
النص الأصلي:
"${rawText}"

قم بإرجاع JSON بالخصائص التالية:
1. arabic_title: عنوان عاجل باللغة العربية.
2. arabic_summary: ملخص عاجل في فقرتين مركزتين.
3. key_takeaways: 3 نقاط رئيسية.
4. key_entities: قائمة بالدول، الأشخاص، والمنظمات المذكورة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error translating news:", error);
    res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ أثناء الترجمة والتلخيص",
    });
  }
});

// API Endpoint 4: Geopolitical & News Assistant Chat
app.post("/api/news/chat", async (req, res) => {
  try {
    const { messages, currentTopic } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `أنت المحلل الجيوسياسي والخبير الإخباري لشبكة الأخبار العالمية العاجلة.
تتلقى أسئلة من المتابعين وصناع القرار حول تطورات الأحداث الجارية، قرارات مجلس الأمن والأمم المتحدة، بيانات وكالات الأنباء، والأزمة الجيوسياسية والاقتصادية.
جاوب باللغة العربية بدقة عالية، بموضوعية صحفية وبأحدث المعلومات المتاحة.`;

    const formattedMessages = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Generate response using generateContent
    const chatResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedMessages,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, reply: chatResponse.text });
  } catch (error: any) {
    console.error("Error in news chat:", error);
    res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ في التواصل مع المحلل الإخباري",
    });
  }
});

// Setup Vite / Static handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Global News Center Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
