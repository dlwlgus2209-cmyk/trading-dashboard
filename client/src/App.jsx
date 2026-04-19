import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

const coinList = [
  { name: "BTC",  market: "KRW-BTC",  color: "#FFB800", glow: "#FFB80060", emoji: "₿" },
  { name: "ETH",  market: "KRW-ETH",  color: "#C4B5FD", glow: "#C4B5FD60", emoji: "Ξ" },
  { name: "XRP",  market: "KRW-XRP",  color: "#2DD4BF", glow: "#2DD4BF60", emoji: "✦" },
  { name: "SOL",  market: "KRW-SOL",  color: "#9945FF", glow: "#9945FF60", emoji: "◎" },
  { name: "DOGE", market: "KRW-DOGE", color: "#C2A633", glow: "#C2A63360", emoji: "Ð" },
  { name: "DKA",  market: "KRW-DKA",  color: "#00D4FF", glow: "#00D4FF60", emoji: "◆" },
  { name: "ONT",  market: "KRW-ONT",  color: "#4DFFB4", glow: "#4DFFB460", emoji: "⬡" },
  { name: "PENGU",market: "KRW-PENGU",color: "#FF6FD8", glow: "#FF6FD860", emoji: "🐧" },
  { name: "ADA",  market: "KRW-ADA",  color: "#3CC8C8", glow: "#3CC8C860", emoji: "₳" },
  { name: "AVAX", market: "KRW-AVAX", color: "#E84142", glow: "#E8414260", emoji: "▲" },
  { name: "NEAR", market: "KRW-NEAR", color: "#00EC97", glow: "#00EC9760", emoji: "Ⓝ" },
  { name: "SUI",  market: "KRW-SUI",  color: "#6FBCF0", glow: "#6FBCF060", emoji: "◈" },
  { name: "SUPER", market: "KRW-SUPER", color: "#7C3AED", glow: "#7C3AED60", emoji: "⚡" }, // 슈퍼버스
  { name: "CPOOL", market: "KRW-CPOOL", color: "#00AEEF", glow: "#00AEEF60", emoji: "🌊" }, // 클리어풀
  { name: "JST",   market: "KRW-JST",   color: "#F43F5E", glow: "#F43F5E60", emoji: "🪙" }, // 저스트
  { name: "POWR",  market: "KRW-POWR",  color: "#22C55E", glow: "#22C55E60", emoji: "🔋" }, // 파워렛저
  { name: "SIGN",  market: "KRW-SIGN",  color: "#FACC15", glow: "#FACC1560", emoji: "✍️" }, // 사인
  { name: "KITE",  market: "KRW-KITE",  color: "#38BDF8", glow: "#38BDF860", emoji: "🪁" }, // 카이트
  { name: "BLUR", market: "KRW-BLUR", color: "#8B5CF6", glow: "#8B5CF660", emoji: "🫥" },
  { name: "MINA", market: "KRW-MINA", color: "#06B6D4", glow: "#06B6D460", emoji: "🪶" },
];

const formatPrice = (value) => {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString();
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Nunito:wght@600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    background: #06060F;
    font-family: 'Nunito', sans-serif;
    color: #F0EAFF;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(160, 80, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(160, 80, 255, 0.06) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
    z-index: 0;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #7C3AED; border-radius: 99px; }

  /* ── 전체 레이아웃: 화면 꽉 차게, 넘침 없게 ── */
  .dashboard {
    display: grid;
    grid-template-columns: 190px 1fr 360px;
    height: 100vh;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  /* ── LEFT SIDEBAR: 세로 스크롤만 허용 ── */
  .sidebar-left {
    background: #0D0820;
    border-right: 1px solid #2D1B69;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;           /* 바깥 컨테이너는 고정 */
    position: relative;
    height: 100vh;
  }

  .sidebar-left::after {
    content: '';
    position: absolute;
    right: -1px; top: 15%; height: 70%; width: 2px;
    background: linear-gradient(180deg, transparent, #A855F7, transparent);
    pointer-events: none;
    z-index: 2;
  }

  /* 로고 영역 — 고정 */
  .sidebar-top {
    flex-shrink: 0;
    padding: 24px 14px 0;
  }

  /* 코인 목록 — 스크롤 */
  .sidebar-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 14px 16px;
  }

  .sidebar-scroll::-webkit-scrollbar { width: 3px; }
  .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: #4C1D95; border-radius: 99px; }

  /* EMA 범례 — 고정 */
  .sidebar-bottom {
    flex-shrink: 0;
    padding: 0 14px 16px;
    border-top: 1px solid #1E1145;
  }

  .logo {
    font-family: 'Orbitron', monospace;
    font-size: 15px;
    font-weight: 900;
    color: #E9D5FF;
    letter-spacing: 0.12em;
    text-align: center;
    padding: 8px 0 20px;
    text-shadow: 0 0 16px #A855F7, 0 0 32px #7C3AED;
    line-height: 1.4;
  }

  .logo span {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: #A855F7;
    letter-spacing: 0.25em;
    margin-top: 6px;
    text-shadow: none;
  }

  .sidebar-section-label {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
    color: #A78BFA;
    text-transform: uppercase;
    padding: 0 2px;
    margin: 4px 0 8px;
  }

  .coin-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid #1E1145;
    background: transparent;
    color: #A78BFA;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 15px;
    font-weight: 900;
    transition: all 0.18s ease;
    text-align: left;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .coin-btn:hover {
    color: #F0EAFF;
    border-color: #7C3AED;
    background: #160D35;
  }

  .coin-btn.active {
    background: #1A0F40;
    border-color: var(--coin-color);
    color: #FFFFFF;
    box-shadow: 0 0 20px var(--coin-glow), inset 0 0 20px rgba(150,80,255,0.07);
  }

  .coin-icon {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #160D35;
    border: 2px solid #2D1B69;
    flex-shrink: 0;
    transition: all 0.18s;
  }

  .coin-btn.active .coin-icon {
    border-color: var(--coin-color);
    box-shadow: 0 0 10px var(--coin-glow);
    background: #1E0A50;
    color: var(--coin-color);
  }

  .ema-legend-label {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
    color: #A78BFA;
    text-transform: uppercase;
    margin: 14px 0 10px;
  }

  .ema-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .ema-bar {
    width: 24px;
    height: 3px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  /* ── MAIN: 세로로 꽉 채우되 넘침 없게 ── */
  .main {
    padding: 20px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;          /* 차트 영역이 밖으로 못 나가게 */
    height: 100vh;
    min-width: 0;              /* grid 자식의 넘침 방지 */
  }

  .main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    flex-shrink: 0;
  }

  .header-left { display: flex; align-items: center; gap: 14px; }

  .coin-title {
    font-family: 'Orbitron', monospace;
    font-size: 28px;
    font-weight: 900;
    color: #FFFFFF;
    letter-spacing: 0.04em;
    text-shadow: 0 0 24px var(--coin-color), 0 0 48px var(--coin-glow);
  }

  .market-badge {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--coin-color);
    padding: 4px 12px;
    border: 2px solid var(--coin-color);
    border-radius: 99px;
    box-shadow: 0 0 10px var(--coin-glow);
    background: rgba(0,0,0,0.5);
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .live-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 800;
    color: #C4B5FD;
    white-space: nowrap;
  }

  .live-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4ADE80;
    box-shadow: 0 0 8px #4ADE80;
    animation: livepulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes livepulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px #4ADE80; }
    50%       { opacity: 0.3; box-shadow: 0 0 2px #4ADE80; }
  }

  /* ── STATS GRID ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    flex-shrink: 0;
  }

  .stat-card {
    background: #0D0820;
    border: 1px solid #2D1B69;
    border-radius: 14px;
    padding: 12px 12px 10px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-width: 0;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent, #7C3AED), transparent);
  }

  .stat-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C4B5FD;
    margin-bottom: 6px;
  }

  .stat-value {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.2;
    word-break: break-all;
  }

  .stat-value.big { font-size: 14px; }
  .stat-value.rsi-low  { color: #60A5FA; text-shadow: 0 0 10px #3B82F680; }
  .stat-value.rsi-high { color: #F87171; text-shadow: 0 0 10px #EF444480; }
  .stat-value.rsi-ok   { color: #4ADE80; text-shadow: 0 0 10px #22C55E80; }
  .stat-value.up       { color: #4ADE80; text-shadow: 0 0 10px #22C55E80; }
  .stat-value.down     { color: #F87171; text-shadow: 0 0 10px #EF444480; }

  .stat-sub {
    font-size: 11px;
    font-weight: 800;
    color: #DDD6FE;
    margin-top: 3px;
  }

  /* ── BUTTONS ── */
  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }

  .btn {
    padding: 8px 14px;
    border-radius: 99px;
    border: 2px solid #3B1F80;
    background: #0D0820;
    color: #DDD6FE;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 900;
    transition: all 0.18s;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .btn:hover {
    background: #1A0F40;
    color: #FFFFFF;
    border-color: #7C3AED;
    box-shadow: 0 0 14px rgba(124,58,237,0.4);
    transform: translateY(-1px);
  }

  .btn:active { transform: translateY(0); }
  .btn.refresh { border-color: #4338CA; color: #E0DBFF; }
  .btn.ai {
    background: #0F1B3D;
    border-color: #3B82F6;
    color: #93C5FD;
    box-shadow: 0 0 10px rgba(59,130,246,0.25);
  }
  .btn.ai:hover {
    box-shadow: 0 0 20px rgba(59,130,246,0.5);
    color: #DBEAFE;
    background: #172554;
  }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .error-msg {
    font-size: 12px;
    font-weight: 800;
    color: #FCA5A5;
    padding: 8px 14px;
    background: #1C0A0A;
    border: 2px solid #7F1D1D;
    border-radius: 10px;
    flex-shrink: 0;
  }

  /* ── CHART: 남은 공간 전부 차지, 절대 넘치지 않게 ── */
  .chart-outer {
    flex: 1;
    min-height: 0;             /* flex 자식이 줄어들 수 있게 */
    display: flex;
    flex-direction: column;
  }

  .chart-container {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    border: 2px solid #2D1B69;
    box-shadow: 0 0 30px rgba(124,58,237,0.15);
  }

  /* ── RIGHT SIDEBAR ── */
  .sidebar-right {
    background: #0D0820;
    border-left: 1px solid #2D1B69;
    padding: 20px 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100vh;
    position: relative;
    min-width: 0;
  }

  .sidebar-right::before {
    content: '';
    position: absolute;
    left: -1px; top: 15%; height: 70%; width: 2px;
    background: linear-gradient(180deg, transparent, #A855F7, transparent);
    pointer-events: none;
  }

  .panel-title {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
    color: #E9D5FF;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-title::after {
    content: '';
    flex: 1; height: 1px;
    background: linear-gradient(90deg, #4C1D95, transparent);
  }

  textarea, input[type="text"] {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 2px solid #2D1B69;
    background: #08051A;
    color: #F0EAFF;
    font-family: 'Nunito', sans-serif;
    font-size: 13px;
    font-weight: 700;
    resize: none;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #A855F7;
  }

  textarea:focus, input[type="text"]:focus {
    border-color: #7C3AED;
    box-shadow: 0 0 14px rgba(124,58,237,0.3);
  }

  textarea::placeholder, input::placeholder { color: #4C3080; font-weight: 600; }
  textarea { height: 100px; }
  input[type="text"] { margin-bottom: 0; }

  .info-card {
    padding: 12px 14px;
    border-radius: 12px;
    background: #08051A;
    border: 2px solid #2D1B69;
    font-size: 13px;
    font-weight: 700;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #1A0D3D;
  }

  .info-row:last-child { border-bottom: none; }
  .info-row-label { color: #C4B5FD; font-size: 12px; font-weight: 800; }
  .info-row-val {
    font-family: 'Orbitron', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #FFFFFF;
  }
  .info-row-val.up       { color: #4ADE80; }
  .info-row-val.down     { color: #F87171; }
  .info-row-val.rsi-low  { color: #60A5FA; }
  .info-row-val.rsi-high { color: #F87171; }

  .alert-card {
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 800;
    line-height: 1.5;
    animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.92) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .alert-card.price { background:#1C0808; border:2px solid #991B1B; color:#FCA5A5; box-shadow:0 0 14px rgba(220,38,38,0.25); }
  .alert-card.rsi   { background:#080C1C; border:2px solid #1D4ED8; color:#93C5FD; box-shadow:0 0 14px rgba(37,99,235,0.25); }
  .alert-card.ema   { background:#081408; border:2px solid #166534; color:#86EFAC; box-shadow:0 0 14px rgba(22,163,74,0.25); }

  .alert-emoji { font-size: 16px; flex-shrink: 0; line-height: 1.2; }

  .summary-box {
    min-height: 160px;
    padding: 14px 15px;
    border-radius: 12px;
    background: #08051A;
    border: 2px solid #2D1B69;
    color: #7C5FBE;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.8;
    white-space: pre-wrap;
    transition: color 0.3s;
  }

  .summary-box.loaded { color: #F0EAFF; }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #3B1F80, transparent);
    flex-shrink: 0;
  }
`;

function App() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const ema20SeriesRef = useRef(null);
  const ema50SeriesRef = useRef(null);
  const intervalRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const [selectedCoin, setSelectedCoin] = useState(coinList[0]);
  const [note, setNote] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentRsi, setCurrentRsi] = useState(null);
  const [ema20, setEma20] = useState(null);
  const [ema50, setEma50] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [priceAlertMessage, setPriceAlertMessage] = useState("");
  const [rsiAlertMessage, setRsiAlertMessage] = useState("");
  const [emaAlertMessage, setEmaAlertMessage] = useState("");
  const [hasPriceTriggered, setHasPriceTriggered] = useState(false);
  const [hasRsiLowTriggered, setHasRsiLowTriggered] = useState(false);
  const [hasRsiHighTriggered, setHasRsiHighTriggered] = useState(false);
  const [hasGoldenCross, setHasGoldenCross] = useState(false);
  const [hasDeadCross, setHasDeadCross] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastCandlesForAi, setLastCandlesForAi] = useState([]);

  const selectedCoinRef = useRef(selectedCoin);
  const targetPriceRef = useRef(targetPrice);
  const hasPriceTriggeredRef = useRef(hasPriceTriggered);
  const hasRsiLowTriggeredRef = useRef(hasRsiLowTriggered);
  const hasRsiHighTriggeredRef = useRef(hasRsiHighTriggered);
  const hasGoldenCrossRef = useRef(hasGoldenCross);
  const hasDeadCrossRef = useRef(hasDeadCross);

  useEffect(() => { selectedCoinRef.current = selectedCoin; }, [selectedCoin]);
  useEffect(() => { targetPriceRef.current = targetPrice; }, [targetPrice]);
  useEffect(() => { hasPriceTriggeredRef.current = hasPriceTriggered; }, [hasPriceTriggered]);
  useEffect(() => { hasRsiLowTriggeredRef.current = hasRsiLowTriggered; }, [hasRsiLowTriggered]);
  useEffect(() => { hasRsiHighTriggeredRef.current = hasRsiHighTriggered; }, [hasRsiHighTriggered]);
  useEffect(() => { hasGoldenCrossRef.current = hasGoldenCross; }, [hasGoldenCross]);
  useEffect(() => { hasDeadCrossRef.current = hasDeadCross; }, [hasDeadCross]);

  const calculateRsi = (candles, period = 14) => {
    if (!candles || candles.length < period + 1) return null;
    const closes = candles.map((c) => c.close);
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const d = closes[i] - closes[i - 1];
      if (d > 0) gains += d; else losses += Math.abs(d);
    }
    let ag = gains / period, al = losses / period;
    for (let i = period + 1; i < closes.length; i++) {
      const d = closes[i] - closes[i - 1];
      ag = (ag * (period - 1) + (d > 0 ? d : 0)) / period;
      al = (al * (period - 1) + (d < 0 ? Math.abs(d) : 0)) / period;
    }
    if (al === 0) return 100;
    return Number((100 - 100 / (1 + ag / al)).toFixed(2));
  };

  const calculateEMA = (data, period) => {
    if (!data || data.length < period) return [];
    const m = 2 / (period + 1);
    let ema = data[0].close;
    return data.map((item) => {
      ema = item.close * m + ema * (1 - m);
      return { time: item.time, value: ema };
    });
  };

  const showBrowserNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted")
      new Notification(title, { body });
  };

  const getRsiClass = () => {
    if (currentRsi === null) return "";
    if (currentRsi <= 30) return "rsi-low";
    if (currentRsi >= 70) return "rsi-high";
    return "rsi-ok";
  };

  const getRsiStatus = () => {
    if (currentRsi === null) return "—";
    if (currentRsi <= 30) return "과매도";
    if (currentRsi >= 70) return "과매수";
    return "중립";
  };

  const getTrendStatus = () => {
    if (ema20 === null || ema50 === null) return "계산 중";
    if (ema20 > ema50) return "상승 우위";
    if (ema20 < ema50) return "약세 우위";
    return "혼조";
  };

  const getTrendClass = () => {
    if (ema20 === null || ema50 === null) return "";
    if (ema20 > ema50) return "up";
    if (ema20 < ema50) return "down";
    return "";
  };

  const checkPriceAlert = (price, coin) => {
    const t = Number(targetPriceRef.current);
    if (!t || hasPriceTriggeredRef.current) return;
    if (price >= t) {
      const msg = `${coin.name} 목표가 도달! ${price.toLocaleString()}원`;
      setPriceAlertMessage(msg); setHasPriceTriggered(true);
      localStorage.setItem(`price-triggered-${coin.market}`, "true");
      showBrowserNotification(`${coin.name} 🎯 가격 알림`, msg);
    }
  };

  const checkRsiAlert = (rsi, coin) => {
    if (rsi === null) return;
    if (rsi <= 30 && !hasRsiLowTriggeredRef.current) {
      const msg = `${coin.name} RSI 과매도 진입: ${rsi}`;
      setRsiAlertMessage(msg); setHasRsiLowTriggered(true);
      localStorage.setItem(`rsi-low-triggered-${coin.market}`, "true");
      showBrowserNotification(`${coin.name} RSI 알림`, msg);
    }
    if (rsi >= 70 && !hasRsiHighTriggeredRef.current) {
      const msg = `${coin.name} RSI 과매수 진입: ${rsi}`;
      setRsiAlertMessage(msg); setHasRsiHighTriggered(true);
      localStorage.setItem(`rsi-high-triggered-${coin.market}`, "true");
      showBrowserNotification(`${coin.name} RSI 알림`, msg);
    }
  };

  const checkEmaCross = (e20, e50, coin) => {
    if (e20.length < 2 || e50.length < 2) return;
    const p20 = e20[e20.length-2].value, p50 = e50[e50.length-2].value;
    const c20 = e20[e20.length-1].value, c50 = e50[e50.length-1].value;
    if (p20 < p50 && c20 > c50 && !hasGoldenCrossRef.current) {
      const msg = `${coin.name} 골든크로스 발생 ✨`;
      setEmaAlertMessage(msg); setHasGoldenCross(true);
      localStorage.setItem(`golden-cross-${coin.market}`, "true");
      showBrowserNotification(`${coin.name} EMA 알림`, msg);
    }
    if (p20 > p50 && c20 < c50 && !hasDeadCrossRef.current) {
      const msg = `${coin.name} 데드크로스 발생 💀`;
      setEmaAlertMessage(msg); setHasDeadCross(true);
      localStorage.setItem(`dead-cross-${coin.market}`, "true");
      showBrowserNotification(`${coin.name} EMA 알림`, msg);
    }
  };

  // 차트 초기화 + ResizeObserver로 크기 자동 맞춤
  useEffect(() => {
    if (!chartRef.current) return;

    const container = chartRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: { background: { color: "#ffffff" }, textColor: "#374151" },
      grid: { vertLines: { color: "#F3F0FF" }, horzLines: { color: "#F3F0FF" } },
      rightPriceScale: { borderColor: "#DDD6FE" },
      timeScale: { borderColor: "#DDD6FE" },
      handleScroll: true,
      handleScale: true,
    });

    const cs = chart.addSeries(CandlestickSeries, {
      upColor: "#22C55E", downColor: "#EF4444",
      borderUpColor: "#16A34A", borderDownColor: "#DC2626",
      wickUpColor: "#16A34A", wickDownColor: "#DC2626",
    });
    const e20 = chart.addSeries(LineSeries, { color: "#7C3AED", lineWidth: 2 });
    const e50 = chart.addSeries(LineSeries, { color: "#EC4899", lineWidth: 2 });

    chartInstanceRef.current = chart;
    candleSeriesRef.current = cs;
    ema20SeriesRef.current = e20;
    ema50SeriesRef.current = e50;

    // 컨테이너 크기 변할 때마다 차트 크기 맞춤
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          chart.applyOptions({ width, height });
        }
      }
    });
    resizeObserverRef.current.observe(container);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const market = selectedCoin.market;
    setNote(localStorage.getItem(`note-${market}`) || "");
    setTargetPrice(localStorage.getItem(`target-${market}`) || "");
    setHasPriceTriggered(localStorage.getItem(`price-triggered-${market}`) === "true");
    setHasRsiLowTriggered(localStorage.getItem(`rsi-low-triggered-${market}`) === "true");
    setHasRsiHighTriggered(localStorage.getItem(`rsi-high-triggered-${market}`) === "true");
    setHasGoldenCross(localStorage.getItem(`golden-cross-${market}`) === "true");
    setHasDeadCross(localStorage.getItem(`dead-cross-${market}`) === "true");
    setPriceAlertMessage(""); setRsiAlertMessage(""); setEmaAlertMessage("");
    setSummaryText(""); setErrorMessage("");
    setCurrentPrice(null); setCurrentRsi(null); setEma20(null); setEma50(null);
    setLastCandlesForAi([]);
  }, [selectedCoin]);

  const loadChartData = async (coin) => {
    if (!candleSeriesRef.current || !chartInstanceRef.current) return;
    try {
      setIsLoading(true); setErrorMessage("");
      const res = await fetch(`https://api.upbit.com/v1/candles/minutes/5?market=${coin.market}&count=200`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error();
      const fmt = data
        .map((item) => ({
          time: Math.floor(new Date(item.candle_date_time_kst).getTime() / 1000),
          open: item.opening_price, high: item.high_price,
          low: item.low_price, close: item.trade_price,
          volume: item.candle_acc_trade_volume,
        }))
        .sort((a, b) => a.time - b.time);
      candleSeriesRef.current.setData(fmt);
      const e20 = calculateEMA(fmt, 20), e50 = calculateEMA(fmt, 50);
      ema20SeriesRef.current.setData(e20);
      ema50SeriesRef.current.setData(e50);
      chartInstanceRef.current.timeScale().fitContent();
      const lp = fmt[fmt.length-1]?.close ?? null;
      const lr = calculateRsi(fmt);
      const le20 = e20[e20.length-1]?.value ?? null;
      const le50 = e50[e50.length-1]?.value ?? null;
      setCurrentPrice(lp); setCurrentRsi(lr); setEma20(le20); setEma50(le50);
      setLastCandlesForAi(fmt.slice(-30));
      if (lp !== null) checkPriceAlert(lp, coin);
      checkRsiAlert(lr, coin);
      checkEmaCross(e20, e50, coin);
    } catch {
      setErrorMessage("⚠ 데이터 불러오기 실패. 잠시 후 재시도.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!candleSeriesRef.current) return;
    loadChartData(selectedCoin);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => loadChartData(selectedCoinRef.current), 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    localStorage.setItem(`note-${selectedCoin.market}`, e.target.value);
  };

  const handleTargetPriceChange = (e) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setTargetPrice(v);
    localStorage.setItem(`target-${selectedCoin.market}`, v);
    setHasPriceTriggered(false);
    localStorage.setItem(`price-triggered-${selectedCoin.market}`, "false");
    setPriceAlertMessage("");
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) { alert("알림 미지원 브라우저"); return; }
    const p = await Notification.requestPermission();
    alert(p === "granted" ? "🔔 알림 허용 완료!" : "🔕 알림 차단됨");
  };

  const resetAlerts = () => {
    const market = selectedCoin.market;
    setHasPriceTriggered(false); setHasRsiLowTriggered(false); setHasRsiHighTriggered(false);
    setHasGoldenCross(false); setHasDeadCross(false);
    setPriceAlertMessage(""); setRsiAlertMessage(""); setEmaAlertMessage("");
    ["price-triggered","rsi-low-triggered","rsi-high-triggered","golden-cross","dead-cross"]
      .forEach(k => localStorage.setItem(`${k}-${market}`, "false"));
  };

  const generateSummary = async () => {
    setIsLoading(true);
    setSummaryText("✨ AI가 분석 중...");
    try {
      const res = await fetch("http://localhost:3001/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coin: selectedCoin.name, currentPrice,
          rsi: currentRsi, ema20, ema50,
          trend: getTrendStatus(), note, candles: lastCandlesForAi,
        }),
      });
      const data = await res.json();
      setSummaryText(data.summary || "요약 실패");
    } catch {
      setSummaryText("💔 서버 연결 실패. 서버 실행 확인 필요.");
    } finally {
      setIsLoading(false);
    }
  };

  const coin = coinList.find(c => c.market === selectedCoin.market);
  const cssVars = { "--coin-color": coin?.color, "--coin-glow": coin?.glow };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard" style={cssVars}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className="sidebar-left">
          {/* 로고 고정 */}
          <div className="sidebar-top">
            <div className="logo">CYBER<br />TRADE<span>v2.0 ✦ LIVE</span></div>
            <div className="sidebar-section-label">마켓 선택</div>
          </div>

          {/* 코인 목록 스크롤 */}
          <div className="sidebar-scroll">
            {coinList.map((c) => (
              <button
                key={c.market}
                onClick={() => setSelectedCoin(c)}
                className={`coin-btn ${selectedCoin.market === c.market ? "active" : ""}`}
                style={{ "--coin-color": c.color, "--coin-glow": c.glow }}
              >
                <span className="coin-icon" style={{ color: c.color }}>{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>

          {/* EMA 범례 고정 */}
          <div className="sidebar-bottom">
            <div className="ema-legend-label">EMA 라인</div>
            <div className="ema-row">
              <div className="ema-bar" style={{ background: "#7C3AED", boxShadow: "0 0 6px #7C3AED" }} />
              <span style={{ color: "#C4B5FD" }}>EMA 20</span>
            </div>
            <div className="ema-row">
              <div className="ema-bar" style={{ background: "#EC4899", boxShadow: "0 0 6px #EC4899" }} />
              <span style={{ color: "#F9A8D4" }}>EMA 50</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          <div className="main-header">
            <div className="header-left">
              <div className="coin-title">{selectedCoin.name}</div>
              <div className="market-badge">{selectedCoin.market}</div>
            </div>
            <div className="live-bar">
              <div className="live-dot" />
              5초 자동갱신 중
              {isLoading && <span style={{ color: "#6D28D9", marginLeft: 4 }}>로딩...</span>}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ "--accent": coin?.color }}>
              <div className="stat-label">현재가</div>
              <div className="stat-value big" style={{ color: coin?.color, textShadow: `0 0 14px ${coin?.glow}` }}>
                ₩ {currentPrice !== null ? formatPrice(currentPrice) : "—"}
              </div>
            </div>
            <div className="stat-card" style={{ "--accent": "#60A5FA" }}>
              <div className="stat-label">RSI · 14</div>
              <div className={`stat-value ${getRsiClass()}`}>{currentRsi !== null ? currentRsi : "—"}</div>
              <div className="stat-sub">{getRsiStatus()}</div>
            </div>
            <div className="stat-card" style={{ "--accent": "#7C3AED" }}>
              <div className="stat-label">EMA 20</div>
              <div className="stat-value" style={{ color: "#C4B5FD" }}>
                {ema20 !== null ? `₩${formatPrice(Math.round(ema20))}` : "—"}
              </div>
            </div>
            <div className="stat-card" style={{ "--accent": "#EC4899" }}>
              <div className="stat-label">EMA 50</div>
              <div className="stat-value" style={{ color: "#F9A8D4" }}>
                {ema50 !== null ? `₩${formatPrice(Math.round(ema50))}` : "—"}
              </div>
            </div>
            <div className="stat-card" style={{ "--accent": "#4ADE80" }}>
              <div className="stat-label">추세</div>
              <div className={`stat-value ${getTrendClass()}`}>{getTrendStatus()}</div>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn refresh" onClick={() => loadChartData(selectedCoinRef.current)}>↺ 새로고침</button>
            <button className="btn" onClick={requestNotificationPermission}>🔔 알림 허용</button>
            <button className="btn" onClick={resetAlerts}>✕ 알림 초기화</button>
            <button className="btn ai" onClick={generateSummary} disabled={isLoading}>✦ AI 요약</button>
          </div>

          {errorMessage && <div className="error-msg">{errorMessage}</div>}

          {/* 차트: 남은 공간 전부 차지 */}
          <div className="chart-outer">
            <div className="chart-container">
              <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="sidebar-right">
          <div>
            <div className="panel-title">✦ 트레이딩 메모</div>
            <textarea value={note} onChange={handleNoteChange}
              placeholder={"예: 145M 돌파 시 추격 금지\n거래량 붙으면 관심..."} />
          </div>

          <div className="divider" />

          <div>
            <div className="panel-title">🎯 가격 알림 설정</div>
            <input type="text" value={targetPrice} onChange={handleTargetPriceChange}
              placeholder="목표가 입력 (숫자만)" style={{ marginBottom: 10 }} />
            <div className="info-card">
              <div className="info-row">
                <span className="info-row-label">목표가</span>
                <span className="info-row-val">{targetPrice ? `₩${formatPrice(Number(targetPrice))}` : "—"}</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">현재 RSI</span>
                <span className={`info-row-val ${getRsiClass()}`}>
                  {currentRsi !== null ? `${currentRsi} (${getRsiStatus()})` : "—"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row-label">추세</span>
                <span className={`info-row-val ${getTrendClass()}`}>{getTrendStatus()}</span>
              </div>
            </div>
          </div>

          {(priceAlertMessage || rsiAlertMessage || emaAlertMessage) && (
            <>
              <div className="divider" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="panel-title">⚡ 발생한 알림</div>
                {priceAlertMessage && <div className="alert-card price"><span className="alert-emoji">🎯</span><span>{priceAlertMessage}</span></div>}
                {rsiAlertMessage   && <div className="alert-card rsi">  <span className="alert-emoji">📊</span><span>{rsiAlertMessage}</span></div>}
                {emaAlertMessage   && <div className="alert-card ema">  <span className="alert-emoji">✨</span><span>{emaAlertMessage}</span></div>}
              </div>
            </>
          )}

          <div className="divider" />

          <div style={{ flex: 1 }}>
            <div className="panel-title">🤖 AI 요약 결과</div>
            <div className={`summary-box ${summaryText ? "loaded" : ""}`}>
              {summaryText || "AI 요약 버튼을 눌러라 ✦"}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default App;
