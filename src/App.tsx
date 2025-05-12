// src/App.tsx

import ChartSetup from './components/ChartSetup';

export default function App() {
  return (
    <>
      {/* ナビバー */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">AIチャートアシスタント</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#">ヘルプ</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* フルワイド container-fluid に変更 */}
      <div className="container-fluid px-4" style={{ paddingTop: 70 }}>
        <ChartSetup />
      </div>
    </>
  );
}
