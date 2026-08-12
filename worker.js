const corsHeaders = {
  "Access-Control-Allow-Origin": "https://aboudeifayman.github.io",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
    },
  });
}

async function gemini(env, prompt) {
  const model = env.GEMINI_MODEL || "gemini-3.6-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("") || ""
  );
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({
        status: "ok",
        service: "Ajel News AI API",
      });
    }

    if (request.method !== "POST") {
      return json({
        error: "Method not allowed",
      }, 405);
    }

    try {
      const body = await request.json();

      if (url.pathname === "/api/news/synthesis") {
        const prompt = `
أنت محرر إخباري واستراتيجي في منصة عاجل نيوز.

التصنيف:
${body.category || "جميع القطاعات"}

المنطقة:
${body.region || "العالم"}

التركيز:
${body.focus || "أهم التطورات"}

أعد تحليلاً إخبارياً واستراتيجياً دقيقاً باللغة العربية.
ميّز بين الحقائق والتحليل والتوقعات.
لا تختلق مصادر.

أعد JSON فقط:
{
  "headline": "",
  "summary": "",
  "key_bullet_points": [],
  "impact_analysis": "",
  "verified_sources": []
}
`;

        const text = await gemini(env, prompt);

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            headline: "",
            summary: text,
            key_bullet_points: [],
            impact_analysis: "",
            verified_sources: [],
          };
        }

        return json({
          success: true,
          data,
        });
      }

      if (url.pathname === "/api/news/verify") {
        const prompt = `
أنت وحدة تحقق إخباري.

تحقق تحليلياً من الادعاء التالي:

الادعاء:
${body.claim || ""}

المصدر:
${body.source || "غير محدد"}

أعد JSON فقط:
{
  "verdict": "",
  "confidence_score": "",
  "official_cross_references": [],
  "detailed_explanation": "",
  "timeline_context": ""
}
`;

        const text = await gemini(env, prompt);

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            verdict: "يحتاج إلى تحقق إضافي",
            confidence_score: "",
            official_cross_references: [],
            detailed_explanation: text,
            timeline_context: "",
          };
        }

        return json({
          success: true,
          data,
        });
      }

      if (url.pathname === "/api/news/translate-summarize") {
        const prompt = `
ترجم ولخص النص التالي إلى العربية الفصحى بدقة:

${body.rawText || ""}

نوع الإخراج:
${body.targetFormat || "خبر صحفي"}

أعد JSON فقط:
{
  "arabic_title": "",
  "arabic_summary": "",
  "key_takeaways": [],
  "key_entities": []
}
`;

        const text = await gemini(env, prompt);

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            arabic_title: "",
            arabic_summary: text,
            key_takeaways: [],
            key_entities: [],
          };
        }

        return json({
          success: true,
          data,
        });
      }

      if (url.pathname === "/api/news/chat") {
        const messages = Array.isArray(body.messages)
          ? body.messages
          : [];

        const conversation = messages
          .map(
            (m) =>
              `${m.role === "user" ? "المستخدم" : "المحلل"}: ${
                m.content
              }`
          )
          .join("\n");

        const prompt = `
أنت المحلل الجيوسياسي والإخباري في منصة عاجل نيوز.

أجب باللغة العربية.

الموضوع الحالي:
${body.currentTopic || "غير محدد"}

ميز بوضوح بين:
- الحقائق المؤكدة
- التحليل
- التوقعات

لا تقدم التوقعات على أنها حقائق.

المحادثة:
${conversation}
`;

        const text = await gemini(env, prompt);

        return json({
          success: true,
          reply: text,
        });
      }

      return json({
        error: "Endpoint not found",
      }, 404);

    } catch (error) {
      return json({
        success: false,
        error: error?.message || "Server error",
      }, 500);
    }
  },
};
