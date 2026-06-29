import { useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import History from "./History";

function Home() {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkNews = async () => {
    if (!newsText.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/predict`, {
        text: newsText,
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Connection failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const isFake = result?.prediction === "Fake";

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-3xl mx-auto px-5 py-12 md:py-20">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
            MODEL ONLINE — DISTILBERT TRANSFORMER
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-paper tracking-tight leading-tight">
            Is this story
            <br />
            <span className="text-signal">real, or fabricated?</span>
          </h1>
          <p className="text-muted mt-4 max-w-md">
            Paste any news article below. The model scans its language
            patterns and returns a verdict with a confidence score.
          </p>
        </div>

        {/* Console input */}
        <div className="bg-panel border border-panel-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-panel-border">
            <span className="w-2.5 h-2.5 rounded-full bg-alert/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-signal/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-verified/70" />
            <span className="font-mono text-xs text-muted ml-2">
              input.txt
            </span>
          </div>

          <textarea
            className="w-full bg-transparent text-paper font-mono text-sm p-4 focus:outline-none resize-none placeholder:text-muted/60"
            placeholder="// paste article text here..."
            rows="9"
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-panel-border">
            <span className="font-mono text-xs text-muted">
              {newsText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={checkNews}
              disabled={loading || !newsText.trim()}
              className="bg-signal hover:bg-signal/90 disabled:bg-panel-border disabled:text-muted disabled:cursor-not-allowed text-ink font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </button>
          </div>
        </div>
{/*  */}
<p className="text-muted text-xs mt-3 font-mono">
          ⚠ Model is not 100% accurate — works best on full sentences or
          paragraphs, may be less reliable on very short or plain
          statements.
        </p>





        {/* Error */}
        {error && (
          <div className="mt-5 bg-alert/10 border border-alert/30 text-alert font-mono text-sm px-4 py-3 rounded-lg">
            ⚠ {error}
          </div>
        )}

        {/* Result readout */}
        {result && (
          <div className="mt-6 bg-panel border border-panel-border rounded-xl p-6 animate-in">
            <div className="font-mono text-xs text-muted mb-4">
              ANALYSIS COMPLETE
            </div>

            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="text-xs text-muted mb-1">Verdict</div>
                <div
                  className={`text-3xl font-extrabold tracking-tight ${
                    isFake ? "text-alert" : "text-verified"
                  }`}
                >
                  {result.prediction}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted mb-1">Confidence</div>
                <div className="font-mono text-2xl text-paper">
                  {result.confidence}%
                </div>
              </div>
            </div>

            <div className="w-full bg-ink rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${
                  isFake ? "bg-alert" : "bg-verified"
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;