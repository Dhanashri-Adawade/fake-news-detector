import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/history`);
        setHistory(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not load history. Check that the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">
        <div className="mb-8">
          <div className="font-mono text-xs text-muted mb-2">
            {history.length > 0 ? `${history.length} RECORDS` : "LOG"}
          </div>
          <h1 className="text-3xl font-extrabold text-paper tracking-tight">
            Analysis history
          </h1>
        </div>

        {loading && (
          <div className="font-mono text-sm text-muted">
            Loading records...
          </div>
        )}

        {error && (
          <div className="bg-alert/10 border border-alert/30 text-alert font-mono text-sm px-4 py-3 rounded-lg">
            ⚠ {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="bg-panel border border-panel-border rounded-xl p-8 text-center">
            <p className="text-muted font-mono text-sm">
              No records yet — run an analysis to see it here.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {history.map((item) => {
            const isFake = item.prediction === "Fake";
            return (
              <div
                key={item.id}
                className="bg-panel border border-panel-border rounded-xl p-5 hover:border-panel-border/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-paper/80 text-sm leading-relaxed line-clamp-2 flex-1">
                    {item.news_text}
                  </p>
                  <span
                    className={`shrink-0 font-mono text-xs font-bold px-2.5 py-1 rounded-md ${
                      isFake
                        ? "bg-alert/10 text-alert"
                        : "bg-verified/10 text-verified"
                    }`}
                  >
                    {item.prediction}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-ink rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isFake ? "bg-alert" : "bg-verified"
                      }`}
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted w-10 text-right">
                    {item.confidence}%
                  </span>
                  <span className="font-mono text-xs text-muted/70 w-24 text-right shrink-0">
                    {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default History;