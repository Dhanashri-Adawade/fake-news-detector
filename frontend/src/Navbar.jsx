import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
      location.pathname === path
        ? "text-signal bg-signal/10"
        : "text-muted hover:text-paper"
    }`;

  return (
    <nav className="border-b border-panel-border bg-ink/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-2 h-2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(245,166,35,0.5)]" />
          <span className="font-mono text-paper text-sm tracking-wide">
            VERITAS<span className="text-signal">.AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/" className={linkClass("/")}>
            Analyze
          </Link>
          <Link to="/history" className={linkClass("/history")}>
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;