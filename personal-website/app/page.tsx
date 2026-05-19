import Link from "next/link";

export const metadata = {
  title: "Ryan Okimoto",
  description: "Personal website of Ryan Okimoto",
};

export default function Home() {
  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          min-height: 100vh;
          background: #faf9f7;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
        }

        nav {
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a1a1a;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }

        .nav-links a {
          font-size: 13px;
          color: #888;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: #1a1a1a; }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 48px;
          max-width: 780px;
          margin: 0 auto;
          width: 100%;
        }

        .eyebrow {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 20px;
        }

        h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(48px, 7vw, 80px);
          font-weight: 400;
          line-height: 1.05;
          color: #1a1a1a;
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }

        h1 em {
          font-style: italic;
          color: #888;
        }

        .bio {
          font-size: 16px;
          line-height: 1.75;
          color: #666;
          max-width: 480px;
          margin-bottom: 48px;
          font-weight: 300;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-marvel {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 12px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          cursor: pointer;
        }

        .btn-marvel:hover {
          background: #333;
          transform: translateY(-1px);
        }

        .btn-marvel .icon {
          font-size: 15px;
        }

        .divider {
          width: 40px;
          height: 1px;
          background: #ddd;
          margin: 48px 0;
        }

        .meta {
          font-size: 12px;
          color: #bbb;
          letter-spacing: 0.06em;
        }

        footer {
          padding: 32px 48px;
          font-size: 12px;
          color: #ccc;
          letter-spacing: 0.06em;
        }

        @media (max-width: 600px) {
          nav, main, footer { padding-left: 24px; padding-right: 24px; }
          h1 { font-size: 42px; }
        }
      `}</style>

      <nav>
        <span className="nav-name">Ryan Okimoto</span>
        <ul className="nav-links">
          <li><a href="#">Work</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      <main>
        <p className="eyebrow">Portfolio · 2025</p>
        <h1>
          Building things<br />
          on the <em>internet.</em>
        </h1>
        <p className="bio">
          Developer based in California. Interested in clean interfaces,
          machine learning, and the Marvel multiverse.
        </p>

        <div className="actions">
          <Link href="/marvel_tracker" className="btn-marvel">
            <span className="icon">🕷️</span>
            Marvel Watch Tracker
          </Link>
        </div>

        <div className="divider" />
        <p className="meta">Available for new projects</p>
      </main>

      <footer>© {new Date().getFullYear()} Ryan Okimoto</footer>
    </div>
  );
}