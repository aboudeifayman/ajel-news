import React, { useEffect, useState } from "react";

const API_URL =
  "https://ajel-news-api.aboudeifayman.workers.dev";

type NewsItem = {
  title: string;
  description?: string;
  source?: string;
  url?: string;
};

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("جاري الاتصال...");

  const checkAPI = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("فشل الاتصال بالخادم");
      }

      const data = await response.json();

      setApiStatus(
        data?.status === "ok"
          ? "متصل ويعمل بنجاح"
          : "الخادم متصل"
      );

      if (Array.isArray(data?.news)) {
        setNews(data.news);
      }
    } catch (err) {
      console.error(err);
      setApiStatus("تعذر الاتصال");
      setError("تعذر الاتصال بخدمة الأخبار حاليًا.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#07111f,#102a43,#0b1728)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <header
        style={{
          maxWidth: "1100px",
          margin: "0 auto 30px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "38px", marginBottom: "10px" }}>
          منصة عجل للأخبار والذكاء الاصطناعي
        </h1>

        <p style={{ fontSize: "18px", opacity: 0.8 }}>
          Ajel News AI Platform
        </p>

        <div
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "10px 20px",
            borderRadius: "30px",
            background:
              apiStatus.includes("بنجاح")
                ? "#14532d"
                : "#713f12",
          }}
        >
          ● حالة API: {apiStatus}
        </div>
      </header>

      <main
        style={{
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,.08)",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "25px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2>مركز الأخبار الذكي</h2>

          <p style={{ opacity: 0.8 }}>
            منصة موحدة لعرض الأخبار وتحليلها باستخدام تقنيات
            الذكاء الاصطناعي.
          </p>

          <button
            onClick={checkAPI}
            disabled={loading}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "12px 25px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            {loading ? "جاري التحديث..." : "تحديث الأخبار"}
          </button>
        </section>

        {error && (
          <div
            style={{
              background: "#7f1d1d",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <section>
          <h2>آخر الأخبار</h2>

          {news.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,.06)",
                padding: "30px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              لا توجد أخبار مستلمة من API حاليًا.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(280px,1fr))",
                gap: "20px",
              }}
            >
              {news.map((item, index) => (
                <article
                  key={index}
                  style={{
                    background: "rgba(255,255,255,.08)",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <h3>{item.title}</h3>

                  {item.description && (
                    <p style={{ opacity: 0.8 }}>
                      {item.description}
                    </p>
                  )}

                  {item.source && (
                    <small>المصدر: {item.source}</small>
                  )}

                  {item.url && (
                    <div style={{ marginTop: "15px" }}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#7dd3fc" }}
                      >
                        قراءة الخبر
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer
        style={{
          textAlign: "center",
          marginTop: "50px",
          opacity: 0.6,
        }}
      >
        Ajel News AI © 2026
      </footer>
    </div>
  );
}
