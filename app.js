/**
 * 元太科技 (E Ink) 電子紙技術可視化互動平台 - 核心互動邏輯 v3.0
 * 包含：
 * 1. 全頁黑白翻轉波形刷新 (E-Ink Full Waveform Flash Refresh)
 * 2. 電泳微膠囊 3.0 物理模擬器 (正負電場、灰階混色、雙穩態鎖定、即時波形示波器、環境光照 Lux 模擬)
 * 3. 20 大技術名詞字典即時搜尋、高亮與分類篩選
 * 4. 彩色電子紙四大架構即時模擬工作室 (Carta 1200 / Kaleido 3 / Gallery 3 / Spectra 6 ✕ 微觀放大鏡)
 * 5. 1990~2026 技術演進時光軸分類篩選
 * 6. 系統拓撲雙資料路徑動態視覺化 ✕ 晶片節點詳細規格檢測器
 * 7. 藍牙 BLE ✕ 輕量電源智慧計算機 (情境預設、能耗拆解長條圖)
 * 8. 17 處官方文獻索引分類庫
 * 9. 紙質淺色 / 科技深色模式切換與全裝置響應式支援
 */

// ================= 1. 資料常數庫 =================

// 20 大核心技術名詞清單 (依據 tech.md)
const GLOSSARY_DATA = [
  {
    zh: "電子紙",
    en: "Electronic Paper, ePaper",
    category: "principle",
    meaning: "具備類似紙張閱讀體驗、反射環境光、無直射藍光且超低功耗的顯示技術總稱。"
  },
  {
    zh: "電子墨水",
    en: "Electronic Ink",
    category: "principle",
    meaning: "元太科技 E Ink 旗下核心專利電泳式材料與化學墨水平台名稱。"
  },
  {
    zh: "電泳式顯示",
    en: "Electrophoretic Display, EPD",
    category: "principle",
    meaning: "將帶正負不同電荷的微米級著色粒子懸浮於液體中，透過電場控制粒子游動以成像。"
  },
  {
    zh: "微膠囊",
    en: "Microcapsules",
    category: "principle",
    meaning: "將帶電黑白粒子與透明介質油性液體封裝於直徑約髮絲粗細的球型透明微膠囊結構中。"
  },
  {
    zh: "微杯",
    en: "Microcups®",
    category: "principle",
    meaning: "另一種以滾輪微壓印製程製作的蜂巢狀杯狀腔體結構，具備極佳的耐壓與柔性彎折度。"
  },
  {
    zh: "雙穩態",
    en: "Bi-stability",
    category: "principle",
    meaning: "電子紙最重要的物理特性：粒子受電場移至定位後，即使完全移除電源仍能長久保持畫面，靜態維持完全不耗電！"
  },
  {
    zh: "TFT 背板",
    en: "Thin-Film Transistor Backplane",
    category: "hardware",
    meaning: "控制螢幕上每一個微米像素正負電壓的主動矩陣薄膜電晶體電路。"
  },
  {
    zh: "驅動 IC",
    en: "Display Driver IC",
    category: "hardware",
    meaning: "負責產生精準正、負及接地高壓脈衝電壓序列，驅動 TFT 像素電極。"
  },
  {
    zh: "波形",
    en: "Waveform",
    category: "hardware",
    meaning: "控制粒子平滑移動、消除殘影、控制灰階深度與更新速度的專用時序電壓訊號演算法。"
  },
  {
    zh: "局部更新",
    en: "Partial Refresh",
    category: "hardware",
    meaning: "僅重新驅動螢幕上有變更的區域，大幅縮短刷新時間並消除全螢幕黑白黑翻轉閃爍。"
  },
  {
    zh: "全螢幕更新",
    en: "Full Refresh",
    category: "hardware",
    meaning: "對整個顯示區域進行多次反向電壓重置，將所有粒子重新歸位以徹底消除歷史殘影。"
  },
  {
    zh: "殘影",
    en: "Ghosting",
    category: "hardware",
    meaning: "粒子因局部摩擦或電場不均勻未完全歸位，導致前一個畫面輕微殘留在新畫面中的現象。"
  },
  {
    zh: "反射式顯示",
    en: "Reflective Display",
    category: "color",
    meaning: "利用外部環境光源（日光、檯燈）照射反射成像，環境光愈強對比愈好，無直射藍光。"
  },
  {
    zh: "灰階",
    en: "Grayscale",
    category: "color",
    meaning: "在純黑與純白之間，透過電壓時間精細控制黑白粒子混合深度所產生的亮度層次（通常為 16 灰階）。"
  },
  {
    zh: "彩色濾光片",
    en: "Color Filter Array, CFA",
    category: "color",
    meaning: "在黑白電子紙頂部貼附 RGB 微細光學濾光層，透過子像素混色呈現豐富色彩（如 Kaleido）。"
  },
  {
    zh: "彩色印刷電子紙",
    en: "Print Color ePaper",
    category: "color",
    meaning: "以彩色濾光片 (CFA) 結合黑白電子墨水的彩色電子紙技術商品名（如 Kaleido 系列）。"
  },
  {
    zh: "全彩電子紙",
    en: "Advanced Color ePaper, ACeP",
    category: "color",
    meaning: "不使用彩色濾光片，而在每個像素中直接懸浮青、洋紅、黃、白等多彩微粒子進行物理混色（Gallery 系列）。"
  },
  {
    zh: "前光",
    en: "Front Light",
    category: "color",
    meaning: "安裝於反射螢幕正前方的導光板與微型 LED，在暗處將光線均勻打向電子紙表面反射。"
  },
  {
    zh: "電子貨架標籤",
    en: "Electronic Shelf Label, ESL",
    category: "application",
    meaning: "零售超商與量販店廣泛應用的超低功耗電子標價牌，一顆紐扣電池可運作 5 年以上。"
  },
  {
    zh: "電子紙筆記本",
    en: "eNote",
    category: "application",
    meaning: "結合電子紙低延遲手寫觸控與無眩光護眼特性的數位書寫本。"
  }
];

// 1990 ~ 2026 技術演進歷史里程碑
const TIMELINE_DATA = [
  {
    year: "1990 年代",
    title: "MIT Media Lab 電泳墨水原理建立",
    desc: "美國麻省理工學院媒體實驗室開創帶電微米粒子懸浮微封裝技術，奠定電子紙理論基石。",
    citation: "MIT 核心專利",
    category: "bw",
    link: "https://en.wikipedia.org/wiki/E_Ink"
  },
  {
    year: "1997",
    title: "E Ink Corporation 正式成立",
    desc: "由 MIT 研究團隊創立 E Ink 公司，開啟將實驗室微膠囊技術走向商用化的大門。",
    citation: "en.wikipedia",
    category: "key",
    link: "https://en.wikipedia.org/wiki/E_Ink"
  },
  {
    year: "1998",
    title: "微膠囊電泳封裝研究公開",
    desc: "發表微膠囊有效抑制帶電粒子沉降與聚集的突破性論文，證明電子墨水具備工業級可靠壽命。",
    citation: "Nature 論文",
    category: "bw",
    link: "https://en.wikipedia.org/wiki/E_Ink"
  },
  {
    year: "2004",
    title: "全球首款 E Ink 閱讀器 Sony LIBRIé 登場",
    desc: "Sony 與元太前身合作推出世界首部電子墨水閱讀器，掀起全球無紙化數位閱讀革命。",
    citation: "產業歷史",
    category: "key",
    link: "http://www.diversifiedautonc.com/history.html"
  },
  {
    year: "2007",
    title: "E Ink Vizplex® 技術問世",
    desc: "第一代大規模量產商用電子紙模組，刷新速度與黑白反差大幅提升，推動初代 Amazon Kindle 爆發普及。",
    citation: "en.wikipedia",
    category: "bw",
    link: "https://en.wikipedia.org/wiki/E_Ink"
  },
  {
    year: "約 2010",
    title: "E Ink Pearl™ 技術普及",
    desc: "對比度提升 50%，黑白層次更深邃，廣泛應用於 Kindle Paperwhite 與各大電子書旗艦產品。",
    citation: "產品型錄",
    category: "bw",
    link: "https://inkframe.net/en/guides/e-paper-technology-guide"
  },
  {
    year: "2013",
    title: "E Ink Carta™ 革命性黑白畫質",
    desc: "進一步提升反射率與文字銳利度，支援 Smooth 灰階演算法與局部無閃爍刷新。",
    citation: "技術手冊",
    category: "bw",
    link: "https://inkframe.net/en/guides/e-paper-technology-guide"
  },
  {
    year: "2014 以後",
    title: "Carta HD 邁向 300 PPI 視網膜級",
    desc: "文字邊緣平滑媲美實體雷射印刷紙張，確立 300 PPI 為頂級電子書閱讀器的全球黃金標準。",
    citation: "元太規格書",
    category: "bw",
    link: "https://tw.eink.com/tech/detail/FAQ"
  },
  {
    year: "2019",
    title: "ACeP 全彩微粒子技術發表 (Gallery 雛形)",
    desc: "擺脫 RGB 濾光片，首次在微膠囊中注入青、洋紅、黃、白四色彩色粒子，實現全彩飽和混色。",
    citation: "tw.eink 官方發布",
    category: "color",
    link: "https://tw.eink.com/upload/2024_05_27/47_20240527170202zo92fgjJH6.pdf"
  },
  {
    year: "2020",
    title: "E Ink Kaleido™ 彩色印刷電子紙上市",
    desc: "以彩色濾光片陣列 (CFA) 完美結合成熟的 Carta 墨水，提供 4,096 色與流暢的漫畫翻頁體驗。",
    citation: "Kaleido 品牌專頁",
    category: "color",
    link: "https://tw.eink.com/brand/detail/Kaleido"
  },
  {
    year: "2021",
    title: "Kaleido Plus 與 Spectra 3100 擴大零售佈局",
    desc: "改善濾光片透光度與飽和度；四色 Spectra 導入零售電子標籤，支持醒目黃紅促銷標示。",
    citation: "元太新聞發布",
    category: "color",
    link: "https://tw.eink.com/news/detail/B5GBRBN5KO"
  },
  {
    year: "2022",
    title: "Kaleido 3 與 Gallery 3 同步大放異彩",
    desc: "Kaleido 3 達到彩色 150 PPI / 黑白 300 PPI；Gallery 3 翻頁刷新時間壓低至 1~1.5 秒並正式量產。",
    citation: "Gallery 3 量產發布",
    category: "key",
    link: "https://tw.eink.com/news/detail/E%20Ink_Announces_E%20Ink_Gallery%E2%84%A2_3_Moves_Into_Mass_Production_With_Customer_Launches"
  },
  {
    year: "2026",
    title: "Spectra 6 出貨面積突破黑白消費電子產品",
    desc: "元太法說會官方數據指出：彩色電子紙在智慧零售與公共顯示看板的出貨面積已超越黑白消費裝置，迎來全面彩色化元年！",
    citation: "2026 Q1 線上法說會",
    category: "key",
    link: "https://tw.eink.com/investor/82260508167j976611/2026%E5%B9%B4%E7%AC%AC1%E5%AD%A3%E7%B7%9A%E4%B8%8A%E6%B3%95%E4%BA%BA%E8%AA%AA%E6%98%8E%E6%9C%83(%E8%8B%B1%E6%96%87)"
  }
];

// 17 處權威來源索引庫 (依據 tech.md)
const CITATIONS_DATA = [
  {
    domain: "tw.eink.com",
    title: "元太科技技術中心 - 電泳式電子紙顯示原理",
    url: "https://tw.eink.com/tech/detail/How_it_works",
    tag: "顯示原理",
    category: "原理與規格"
  },
  {
    domain: "tw.eink.com",
    title: "常見問題集 (FAQ) - 電子紙微膠囊與雙穩態維持特性",
    url: "https://tw.eink.com/tech/detail/FAQ",
    tag: "雙穩態",
    category: "原理與規格"
  },
  {
    domain: "esg.eink.com",
    title: "永續發展報告 - 反射式顯示與超低功耗綠色價值",
    url: "https://esg.eink.com/tw/focus/article/product",
    tag: "反射式",
    category: "原理與規格"
  },
  {
    domain: "tw.eink.com",
    title: "E Ink 宣布全彩電子紙 Gallery 3 邁入量產與客戶採用",
    url: "https://tw.eink.com/news/detail/E%20Ink_Announces_E%20Ink_Gallery%E2%84%A2_3_Moves_Into_Mass_Production_With_Customer_Launches",
    tag: "ACeP 全彩",
    category: "彩色技術"
  },
  {
    domain: "eink.com",
    title: "E Ink Global - Benefits & Ultra-low Power Physics",
    url: "https://www.eink.com/tech/detail/Benefits",
    tag: "耗電模型",
    category: "原理與規格"
  },
  {
    domain: "tw.eink.com",
    title: "E Ink Kaleido™ 品牌與彩色濾光片技術說明",
    url: "https://tw.eink.com/brand?bookmark=Kaleido",
    tag: "Kaleido",
    category: "彩色技術"
  },
  {
    domain: "tw.eink.com",
    title: "Kaleido 3 規格突破：彩色 150 PPI 與黑白 300 PPI",
    url: "https://tw.eink.com/news/detail/JDD4V8G3ZG",
    tag: "解析度",
    category: "彩色技術"
  },
  {
    domain: "tw.eink.com",
    title: "Spectra 系列有限色彩規格書與波形控制技術文件",
    url: "https://tw.eink.com/upload/2024_05_27/47_20240527170202zo92fgjJH6.pdf",
    tag: "Spectra",
    category: "彩色技術"
  },
  {
    domain: "en.wikipedia.org",
    title: "E Ink Corporation 歷史與 MIT Media Lab 成立起源",
    url: "https://en.wikipedia.org/wiki/E_Ink",
    tag: "產業歷史",
    category: "原理與規格"
  },
  {
    domain: "diversifiedautonc.com",
    title: "Sony LIBRIé 與全球第一台商用電子紙閱讀器發展紀實",
    url: "http://www.diversifiedautonc.com/history.html",
    tag: "消費電子",
    category: "原理與規格"
  },
  {
    domain: "tw.eink.com",
    title: "E Ink Kaleido 產品專區與 4,096 色印刷技術解析",
    url: "https://tw.eink.com/brand/detail/Kaleido",
    tag: "CFA 彩色",
    category: "彩色技術"
  },
  {
    domain: "tw.eink.com",
    title: "Kaleido Plus 與 Spectra 3100 發表新聞稿",
    url: "https://tw.eink.com/news/detail/B5GBRBN5KO",
    tag: "零售 ESL",
    category: "彩色技術"
  },
  {
    domain: "tw.eink.com",
    title: "Kaleido 3 Outdoor 與戶外全彩數位看板技術",
    url: "https://tw.eink.com/news/detail/Q7FU6K47HU",
    tag: "戶外看板",
    category: "彩色技術"
  },
  {
    domain: "tw.eink.com",
    title: "2026 年第 1 季線上法人說明會 (英文) - Spectra 6 出貨超越黑白",
    url: "https://tw.eink.com/investor/82260508167j976611/2026%E5%B9%B4%E7%AC%AC1%E5%AD%A3%E7%B7%9A%E4%B8%8A%E6%B3%95%E4%BA%BA%E8%AA%AA%E6%98%8E%E6%9C%83(%E8%8B%B1%E6%96%87)",
    tag: "法說會",
    category: "原理與規格"
  },
  {
    domain: "inkframe.net",
    title: "e-Paper Technology Guide (Pearl, Carta, Waveform 歷史演進)",
    url: "https://inkframe.net/en/guides/e-paper-technology-guide",
    tag: "演進歷史",
    category: "硬體與通訊"
  },
  {
    domain: "na.industrial.panasonic.com",
    title: "Panasonic BLE 模組超低功耗與待機 1µA / 峰值 15mA 規範",
    url: "https://na.industrial.panasonic.com/products/wireless-connectivity/bluetooth/bluetooth-low-energy",
    tag: "BLE 規範",
    category: "硬體與通訊"
  },
  {
    domain: "tw.eink.com",
    title: "E Ink 智慧識別證 (eBadge) 與無線無電池能量採集展示",
    url: "https://tw.eink.com/application/detail/ebadge",
    tag: "無電池 NFC",
    category: "硬體與通訊"
  }
];


// ================= 2. 全頁翻轉刷新波形特效 (E-Ink Flash) =================

function triggerEinkFullRefresh(callback) {
  const overlay = document.getElementById('einkFlashOverlay');
  if (!overlay) return;

  overlay.classList.remove('refreshing');
  void overlay.offsetWidth; // 強制重繪觸發動畫
  overlay.classList.add('refreshing');

  setTimeout(() => {
    overlay.classList.remove('refreshing');
    if (typeof callback === 'function') callback();
  }, 760);
}

function initEinkRefreshTriggers() {
  const btnHeader = document.getElementById('einkRefreshBtn');
  const btnDrawer = document.getElementById('drawerRefreshBtn');
  const btnSim = document.getElementById('btnTriggerRefresh');

  const handler = () => {
    triggerEinkFullRefresh(() => {
      // 刷新後震動反饋 (若裝置支援)
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    });
  };

  if (btnHeader) btnHeader.addEventListener('click', handler);
  if (btnDrawer) btnDrawer.addEventListener('click', handler);
  if (btnSim) btnSim.addEventListener('click', handler);
}


// ================= 3. 電泳微膠囊 3.0 物理模擬器與波形示波器 =================

class ElectrophoreticSimulator {
  constructor(particleCanvasId, waveformCanvasId) {
    this.canvas = document.getElementById(particleCanvasId);
    this.waveCanvas = document.getElementById(waveformCanvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.waveCtx = this.waveCanvas ? this.waveCanvas.getContext('2d') : null;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // 電壓狀態: 1 = +V (顯白), -1 = -V (顯黑), 2 = 灰階 (~V), 0 = 0V 斷電 (雙穩態)
    this.voltageState = 1;
    this.targetState = 1;
    this.ambientLux = 10000; // 預設 10,000 Lux

    this.particles = [];
    this.capsules = [];
    this.waveHistory = new Array(80).fill(15); // 波形緩衝區
    this.waveTimer = 0;

    this._initCapsulesAndParticles();
    this._setupControls();
    this._setupLuxSlider();

    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  _initCapsulesAndParticles() {
    const capsuleCount = 3;
    const paddingX = 40;
    const availableWidth = this.width - paddingX * 2;
    const radius = availableWidth / (capsuleCount * 2);
    const centerY = this.height / 2 + 10;

    this.capsules = [];
    for (let i = 0; i < capsuleCount; i++) {
      const centerX = paddingX + radius + i * (radius * 2);
      this.capsules.push({ x: centerX, y: centerY, r: radius - 8 });
    }

    this.particles = [];
    const particlesPerCapsule = 50;

    this.capsules.forEach((capsule, cIdx) => {
      // 白色帶負電粒子 (q = -1)
      for (let p = 0; p < particlesPerCapsule; p++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (capsule.r - 8);
        this.particles.push({
          capsuleIndex: cIdx,
          x: capsule.x + Math.cos(angle) * dist,
          y: capsule.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          radius: 3.2,
          type: 'white',
          charge: -1,
          color: '#FFFFFF'
        });
      }

      // 黑色帶正電粒子 (q = +1)
      for (let p = 0; p < particlesPerCapsule; p++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (capsule.r - 8);
        this.particles.push({
          capsuleIndex: cIdx,
          x: capsule.x + Math.cos(angle) * dist,
          y: capsule.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          radius: 3.2,
          type: 'black',
          charge: +1,
          color: '#1A1C20'
        });
      }
    });
  }

  setVoltage(voltage) {
    this.voltageState = voltage;
    this._updateUIBadges();
  }

  _updateUIBadges() {
    const badge = document.getElementById('simStateBadge');
    const voltText = document.getElementById('currentVoltageText');
    const expTitle = document.getElementById('physicsExpTitle');
    const expText = document.getElementById('physicsExpText');
    const waveStatus = document.getElementById('waveformStatus');

    if (!badge) return;

    badge.className = 'sim-state-badge';

    if (this.voltageState === 1) {
      badge.classList.add('active-pos');
      badge.innerHTML = '⚡ +V 正電場 (頂部顯白)';
      if (voltText) voltText.innerText = '+15V (正向驅動)';
      if (expTitle) expTitle.innerText = '⚪ +V 正電場作用中（純白像素顯色）';
      if (expText) expText.innerText = '頂部透明導電電極 (ITO) 施加正電位，帶負電的白色二氧化鈦粒子受庫倫電力 F = qE 浮升至微膠囊頂端；環境光照射後強烈散射回人眼，呈現純白色。黑色碳黑粒子則沉降於底部隱蔽。';
      if (waveStatus) waveStatus.innerText = '狀態: 正向驅動脈衝 (+15V)';
    } else if (this.voltageState === -1) {
      badge.classList.add('active-neg');
      badge.innerHTML = '⚡ -V 負電場 (頂部顯黑)';
      if (voltText) voltText.innerText = '-15V (反向驅動)';
      if (expTitle) expTitle.innerText = '⚫ -V 負電場作用中（純黑像素吸光）';
      if (expText) expText.innerText = '電場反向！頂部透明電極切換為負電位，底部 TFT 像素電極為正電位。帶正電之黑色碳黑粒子升至微膠囊表面吸收光線，呈現純黑色；白色粒子沉降至微膠囊底部。';
      if (waveStatus) waveStatus.innerText = '狀態: 反向驅動脈衝 (-15V)';
    } else if (this.voltageState === 2) {
      badge.classList.add('active-gray');
      badge.innerHTML = '〰️ 灰階驅動 (~V 振鈴混合)';
      if (voltText) voltText.innerText = '±5V 振盪 (形成灰階)';
      if (expTitle) expTitle.innerText = '🔘 中間灰階混合態 (Grayscale Modulation)';
      if (expText) expText.innerText = '顯示控制器 (TCON) 送出高頻振盪微脈衝波形，使黑白粒子在微膠囊中程懸浮均勻混合，光學反射介於純白與純黑之間，精準實現 16 級細膩灰階！';
      if (waveStatus) waveStatus.innerText = '狀態: 灰階調製微脈衝波形 (AC Dither)';
    } else {
      badge.classList.add('bistable');
      badge.innerHTML = '🔒 0V 斷電狀態：雙穩態生效 (0 功耗)';
      if (voltText) voltText.innerText = '0V (斷電恆久維持)';
      if (expTitle) expTitle.innerText = '✨ 雙穩態 (Bi-stability) 物理特性展現';
      if (expText) expText.innerText = '此時驅動電壓完全為 0V！黏滯流體阻尼與凡得瓦分子附著力將粒子牢牢鎖定在當前深度，畫面完全不褪色、不閃爍。電子紙僅在「更新瞬間」消耗電能，靜態維持完全零耗電！';
      if (waveStatus) waveStatus.innerText = '狀態: 0V 電源斷開 (雙穩態鎖定 🔒)';
    }
  }

  _setupControls() {
    const btnPos = document.getElementById('btnVoltagePos');
    const btnNeg = document.getElementById('btnVoltageNeg');
    const btnGray = document.getElementById('btnVoltageGray');
    const btnZero = document.getElementById('btnVoltageZero');

    const updateBtns = (activeBtn, activeClass) => {
      [btnPos, btnNeg, btnGray, btnZero].forEach(b => {
        if (b) {
          b.classList.remove('active-pos', 'active-neg', 'active-gray', 'active-bistable');
        }
      });
      if (activeBtn) activeBtn.classList.add(activeClass);
    };

    if (btnPos) btnPos.addEventListener('click', () => { this.setVoltage(1); updateBtns(btnPos, 'active-pos'); });
    if (btnNeg) btnNeg.addEventListener('click', () => { this.setVoltage(-1); updateBtns(btnNeg, 'active-neg'); });
    if (btnGray) btnGray.addEventListener('click', () => { this.setVoltage(2); updateBtns(btnGray, 'active-gray'); });
    if (btnZero) btnZero.addEventListener('click', () => { this.setVoltage(0); updateBtns(btnZero, 'active-bistable'); });
  }

  _setupLuxSlider() {
    const slider = document.getElementById('ambientLuxSlider');
    const luxDisplay = document.getElementById('ambientLuxValue');
    const einkBar = document.getElementById('einkContrastBar');
    const lcdBar = document.getElementById('lcdContrastBar');
    const einkText = document.getElementById('einkContrastText');
    const lcdText = document.getElementById('lcdContrastText');

    if (!slider) return;

    slider.addEventListener('input', (e) => {
      const lux = parseInt(e.target.value, 10);
      this.ambientLux = lux;

      let luxDesc = '';
      if (lux < 200) luxDesc = `${lux} Lux (暗房/夜燈)`;
      else if (lux < 1000) luxDesc = `${lux} Lux (標準辦公室照明)`;
      else if (lux < 15000) luxDesc = `${lux.toLocaleString()} Lux (戶外多雲)`;
      else luxDesc = `${lux.toLocaleString()} Lux (戶外烈日直射 ☀️)`;

      if (luxDisplay) luxDisplay.innerText = luxDesc;

      // 電子紙反射可讀性 (越亮越好, 65% ~ 98%)
      const einkScore = Math.min(65 + Math.round((lux / 50000) * 33), 98);
      // LCD 背光可視度 (暗時好, 豔陽下洗白, 95% ~ 15%)
      const lcdScore = Math.max(95 - Math.round((lux / 50000) * 80), 12);

      if (einkBar) einkBar.style.width = `${einkScore}%`;
      if (lcdBar) lcdBar.style.width = `${lcdScore}%`;

      if (einkText) {
        einkText.innerText = lux > 20000 ? '☀️ 豔陽直射！反射對比極致鮮明，完全無眩光' : '🌿 環境光反射成像，柔和護眼如同印刷紙張';
      }
      if (lcdText) {
        lcdText.innerText = lux > 20000 ? '⚠️ 嚴重泛白！直射光壓過背光，畫面幾乎難以辨識' : '室內清晰可見，但在強光下容易產生強烈鏡面反光';
      }
    });
  }

  updatePhysics(dt) {
    const electricFieldStrength = 0.68;
    const fluidViscosity = 0.88;

    this.particles.forEach(p => {
      const capsule = this.capsules[p.capsuleIndex];

      if (this.voltageState === 1 || this.voltageState === -1) {
        // 純電場 F = q * E
        const forceY = -p.charge * this.voltageState * electricFieldStrength;
        p.vy += forceY * dt * 60;
      } else if (this.voltageState === 2) {
        // 灰階微脈衝：黑白粒子往中層靠攏形成均勻混合
        const targetMidY = capsule.y + (p.charge * 8);
        const distToMid = targetMidY - p.y;
        p.vy += distToMid * 0.08 + (Math.random() - 0.5) * 0.4;
      } else {
        // 0V 雙穩態：流體迅速定格煞車
        p.vx *= 0.65;
        p.vy *= 0.65;
      }

      // 輕微布朗運動
      const brownian = this.voltageState === 0 ? 0.015 : 0.07;
      p.vx += (Math.random() - 0.5) * brownian;
      p.vy += (Math.random() - 0.5) * brownian;

      p.vx *= fluidViscosity;
      p.vy *= fluidViscosity;

      p.x += p.vx;
      p.y += p.vy;

      // 微膠囊圓形物理邊界
      const dx = p.x - capsule.x;
      const dy = p.y - capsule.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = capsule.r - p.radius - 1.5;

      if (dist > maxDist) {
        const angle = Math.atan2(dy, dx);
        p.x = capsule.x + Math.cos(angle) * maxDist;
        p.y = capsule.y + Math.sin(angle) * maxDist;
        p.vx *= -0.2;
        p.vy *= -0.2;
      }
    });

    // 更新即時波形時序圖資料
    this.waveTimer += dt;
    if (this.waveTimer > 0.035) {
      this.waveTimer = 0;
      let targetV = 0;
      if (this.voltageState === 1) targetV = 15;
      else if (this.voltageState === -1) targetV = -15;
      else if (this.voltageState === 2) targetV = Math.sin(performance.now() * 0.02) * 8;
      else targetV = 0;

      this.waveHistory.push(targetV);
      if (this.waveHistory.length > 80) this.waveHistory.shift();
    }
  }

  drawWaveform() {
    if (!this.waveCtx) return;
    const ctx = this.waveCtx;
    const w = this.waveCanvas.width;
    const h = this.waveCanvas.height;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    ctx.clearRect(0, 0, w, h);

    // 示波器網格底線
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const midY = h / 2;
    const topY = midY - 22;
    const botY = midY + 22;

    ctx.beginPath();
    ctx.moveTo(0, topY); ctx.lineTo(w, topY); // +15V
    ctx.moveTo(0, midY); ctx.lineTo(w, midY); // 0V
    ctx.moveTo(0, botY); ctx.lineTo(w, botY); // -15V
    ctx.stroke();
    ctx.setLineDash([]);

    // 刻度文字
    ctx.font = '600 9px JetBrains Mono';
    ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
    ctx.fillText('+15V', 6, topY + 3);
    ctx.fillText(' 0V', 6, midY + 3);
    ctx.fillText('-15V', 6, botY + 3);

    // 繪製波形即時曲線
    ctx.beginPath();
    ctx.lineWidth = 2;
    if (this.voltageState === 1) ctx.strokeStyle = '#10B981';
    else if (this.voltageState === -1) ctx.strokeStyle = '#EF4444';
    else if (this.voltageState === 2) ctx.strokeStyle = '#8B5CF6';
    else ctx.strokeStyle = '#F59E0B';

    const stepX = w / (this.waveHistory.length - 1);
    this.waveHistory.forEach((v, i) => {
      const y = midY - (v / 15) * 22;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * stepX, y);
    });
    ctx.stroke();
  }

  draw() {
    const ctx = this.ctx;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. 頂部透明電極 (ITO Layer)
    const electrodeHeight = 18;
    ctx.fillStyle = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(23, 84, 236, 0.14)';
    ctx.fillRect(15, 10, this.width - 30, electrodeHeight);
    ctx.strokeStyle = isDark ? '#3B82F6' : '#1754EC';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, 10, this.width - 30, electrodeHeight);

    ctx.font = '600 11px JetBrains Mono, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isDark ? '#93C5FD' : '#1754EC';
    const topElectrodeSign = this.voltageState === 1 ? '(+) 正極電位' : (this.voltageState === -1 ? '(-) 負極電位' : (this.voltageState === 2 ? '(~) 灰階高頻振盪' : '(0V) 斷電無場'));
    ctx.fillText(`頂部透明導電電極 [ITO Layer] ${topElectrodeSign} ── 使用者視角 👀`, this.width / 2, 10 + electrodeHeight / 2);

    // 2. 底部 TFT 像素電極
    const bottomY = this.height - 28;
    ctx.fillStyle = isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(74, 85, 104, 0.15)';
    ctx.fillRect(15, bottomY, this.width - 30, electrodeHeight);
    ctx.strokeStyle = isDark ? '#64748B' : '#4A5568';
    ctx.strokeRect(15, bottomY, this.width - 30, electrodeHeight);

    const bottomElectrodeSign = this.voltageState === 1 ? '(-) 負極電位' : (this.voltageState === -1 ? '(+) 正極電位' : (this.voltageState === 2 ? '(~) 振鈴反向' : '(0V) 斷電維持'));
    ctx.fillStyle = isDark ? '#CBD5E1' : '#4A5568';
    ctx.fillText(`底部 TFT 像素電極 [Pixel Electrode] ${bottomElectrodeSign}`, this.width / 2, bottomY + electrodeHeight / 2);

    // 3. 環境光反射光束
    const luxRatio = Math.min(this.ambientLux / 35000, 1.2);
    this.capsules.forEach(capsule => {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;

      if (this.voltageState === 1) {
        // 顯白：強烈反射環境光
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + luxRatio * 0.5})`;
        ctx.moveTo(capsule.x - 24, 10 + electrodeHeight);
        ctx.lineTo(capsule.x - 8, capsule.y - capsule.r + 8);
        ctx.lineTo(capsule.x + 20, 10 + electrodeHeight);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#FCD34D' : '#D97706';
        ctx.font = '600 10px sans-serif';
        ctx.fillText('☀️ 環境光散射反射回眼', capsule.x, capsule.y - capsule.r - 8);
      } else if (this.voltageState === -1) {
        // 顯黑：吸收光線
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
        ctx.moveTo(capsule.x, 10 + electrodeHeight);
        ctx.lineTo(capsule.x, capsule.y - capsule.r + 14);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
        ctx.font = '600 10px sans-serif';
        ctx.fillText('⬛ 黑色粒子吸收光線', capsule.x, capsule.y - capsule.r - 8);
      }
      ctx.restore();
    });

    // 4. 繪製微膠囊
    this.capsules.forEach((capsule, idx) => {
      ctx.beginPath();
      ctx.arc(capsule.x, capsule.y, capsule.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.65)' : 'rgba(237, 234, 226, 0.75)';
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isDark ? '#475569' : '#C7C2B4';
      ctx.stroke();

      ctx.font = '600 10px JetBrains Mono';
      ctx.fillStyle = isDark ? '#94A3B8' : '#78716C';
      ctx.fillText(`微膠囊 #${idx + 1}`, capsule.x, capsule.y + capsule.r + 14);
    });

    // 5. 繪製黑白粒子
    const sortedParticles = [...this.particles].sort((a, b) => a.y - b.y);

    sortedParticles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      if (p.type === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('-', p.x, p.y);
      } else {
        ctx.fillStyle = '#1A1C20';
        ctx.fill();
        ctx.strokeStyle = isDark ? '#3F3F46' : '#27272A';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = '#E4E4E7';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', p.x, p.y);
      }
    });

    // 繪製波形示波器
    this.drawWaveform();
  }

  animate(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    this.updatePhysics(dt);
    this.draw();

    requestAnimationFrame(this.animate);
  }
}


// ================= 4. 技術名詞字典即時搜尋與分類篩選 =================

function initGlossaryExplorer() {
  const grid = document.getElementById('glossaryGrid');
  const searchInput = document.getElementById('glossarySearchInput');
  const clearBtn = document.getElementById('glossarySearchClear');
  const filterChips = document.querySelectorAll('.filter-chip');
  if (!grid) return;

  let currentCategory = 'all';
  let searchQuery = '';

  const categoryNameMap = {
    principle: '顯示原理',
    hardware: '硬體與驅動',
    color: '彩色光學',
    application: '終端應用'
  };

  const render = () => {
    grid.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();

    const filtered = GLOSSARY_DATA.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = !q ||
        item.zh.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; color: var(--ink-400);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🔍</div>
          <p>找不到符合「<strong>${searchQuery}</strong>」的技術名詞，請嘗試其他關鍵字（例如：雙穩態、ACeP、波形）。</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'term-card reveal in-view';

      // 關鍵字高亮處理
      let zhTitle = item.zh;
      let meaningText = item.meaning;
      if (q) {
        const regex = new RegExp(`(${q})`, 'gi');
        zhTitle = zhTitle.replace(regex, '<mark style="background:var(--accent-pulse); color:var(--accent); font-weight:800; border-radius:2px;">$1</mark>');
        meaningText = meaningText.replace(regex, '<mark style="background:var(--accent-pulse); color:var(--accent); font-weight:800; border-radius:2px;">$1</mark>');
      }

      card.innerHTML = `
        <div class="term-header">
          <span class="term-zh">${zhTitle}</span>
          <span class="term-cat-badge">${categoryNameMap[item.category] || '核心技術'}</span>
        </div>
        <div class="term-en">${item.en}</div>
        <div class="term-def">${meaningText}</div>
      `;
      grid.appendChild(card);
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) clearBtn.classList.toggle('visible', searchQuery.length > 0);
      render();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearBtn.classList.remove('visible');
      render();
      if (searchInput) searchInput.focus();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-category');
      render();
    });
  });

  render();
}


// ================= 5. 彩色電子紙四大架構即時模擬工作室 =================

class ColorArchitectureStudio {
  constructor(canvasId, loupeId, loupeCanvasId) {
    this.canvas = document.getElementById(canvasId);
    this.loupe = document.getElementById(loupeId);
    this.loupeCanvas = document.getElementById(loupeCanvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.loupeCtx = this.loupeCanvas ? this.loupeCanvas.getContext('2d') : null;

    this.currentSample = 'manga'; // 'manga' | 'art' | 'retail'
    this.currentTech = 'carta';    // 'carta' | 'kaleido' | 'gallery' | 'spectra'

    this.specSpecs = {
      carta: {
        title: "Carta 1200 黑白電子墨水",
        desc: "元太黑白電子紙的頂級旗艦標準，具備最高反射率與最高黑白文字對比，毫無彩色濾光片的亮度損失。",
        colorCount: "純黑白 (16 級灰階)",
        bwPpi: "300 PPI (視網膜印刷級)",
        colorPpi: "無彩色",
        speed: "~350 ms (超極速局部更新)",
        structure: "黑白電泳微膠囊 / 微杯",
        verdict: "最適應用：純文字小說、論文閱讀、長效辦公記事本與高專注度閱讀裝置。"
      },
      kaleido: {
        title: "Kaleido 3 彩色濾光片陣列 (CFA)",
        desc: "以彩色濾光片陣列貼合於黑白 Carta 墨水之上，實現流暢的 4,096 色色彩與超高反應速度。",
        colorCount: "4,096 色 (16 灰階混色)",
        bwPpi: "300 PPI (文字邊緣依舊銳利)",
        colorPpi: "150 PPI (子像素混色)",
        speed: "~450 ms (翻頁極流暢)",
        structure: "RGB 彩色濾光片陣列 ✕ Carta",
        verdict: "最適應用：彩色漫畫、教科書圖表、雜誌、以及需要流暢手寫繪圖的彩色數位筆記本。"
      },
      gallery: {
        title: "Gallery 3 / ACeP 全彩微粒子",
        desc: "完全擺脫 RGB 濾光片！微膠囊內直接懸浮青、洋紅、黃、白四色粒子進行物理混色，呈現海報級飽和度。",
        colorCount: "50,000+ 全彩色域",
        bwPpi: "300 PPI",
        colorPpi: "300 PPI (彩色黑白等高解析)",
        speed: "1,000 ~ 1,500 ms (多階波形)",
        structure: "C/M/Y/W 四色電泳彩色微粒子",
        verdict: "最適應用：數位畫廊、博物館典藏展品說明、高端公共資訊看板、高級藝術繪本。"
      },
      spectra: {
        title: "Spectra 6 零售鮮豔高飽和架構",
        desc: "專為商業零售量身打造，以黑、白、紅、黃、藍、綠等微粒子營造比擬商業宣傳紙張的奪目光彩。",
        colorCount: "高飽和 6 色微粒子",
        bwPpi: "200 ~ 300 PPI",
        colorPpi: "200 ~ 300 PPI",
        speed: "2,000 ~ 5,000 ms (強調飽和度)",
        structure: "高彩度微粒聚合物 TFT 背板",
        verdict: "最適應用：智慧零售 ESL 標籤、量販超商 POP 特價促銷看板、百貨公司櫥窗展示牌。"
      }
    };

    this._setupUI();
    this._setupLoupe();
    this.render();
  }

  _setupUI() {
    // 樣張切換按鈕
    document.querySelectorAll('.sample-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSample = btn.getAttribute('data-sample');
        this.render();
      });
    });

    // 技術模式切換按鈕
    document.querySelectorAll('.tech-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tech-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTech = btn.getAttribute('data-tech');
        this.updateSpecCard();
        this.render();
      });
    });
  }

  updateSpecCard() {
    const spec = this.specSpecs[this.currentTech];
    if (!spec) return;

    const title = document.getElementById('studioSpecTitle');
    const desc = document.getElementById('studioSpecDesc');
    const colorCount = document.getElementById('specColorCount');
    const bwPpi = document.getElementById('specBwPpi');
    const colorPpi = document.getElementById('specColorPpi');
    const speed = document.getElementById('specRefreshSpeed');
    const structure = document.getElementById('specStructure');
    const verdict = document.getElementById('specVerdict');
    const techLabel = document.getElementById('studioTechLabel');

    if (title) title.innerText = spec.title;
    if (desc) desc.innerText = spec.desc;
    if (colorCount) colorCount.innerText = spec.colorCount;
    if (bwPpi) bwPpi.innerText = spec.bwPpi;
    if (colorPpi) colorPpi.innerText = spec.colorPpi;
    if (speed) speed.innerText = spec.speed;
    if (structure) structure.innerText = spec.structure;
    if (verdict) verdict.innerHTML = `<strong>最適應用：</strong>${spec.verdict.replace('最適應用：', '')}`;
    if (techLabel) techLabel.innerText = `${spec.title} (模擬渲染視角)`;
  }

  _setupLoupe() {
    const box = document.getElementById('viewportCanvasBox');
    if (!box || !this.loupe || !this.loupeCanvas) return;

    const onMove = (e) => {
      const rect = box.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
        this.loupe.classList.remove('active');
        return;
      }

      this.loupe.classList.add('active');
      this.loupe.style.left = `${mouseX}px`;
      this.loupe.style.top = `${mouseY}px`;

      // 將對應區域以 3 倍放大繪製於放大鏡畫布中，並疊加微觀像素特徵
      this.drawLoupe(mouseX, mouseY);
    };

    box.addEventListener('mousemove', onMove);
    box.addEventListener('mouseleave', () => this.loupe.classList.remove('active'));
    box.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        onMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    }, { passive: true });
    box.addEventListener('touchend', () => this.loupe.classList.remove('active'));
  }

  drawLoupe(centerX, centerY) {
    const lCtx = this.loupeCtx;
    if (!lCtx) return;

    const lw = this.loupeCanvas.width;
    const lh = this.loupeCanvas.height;
    lCtx.clearRect(0, 0, lw, lh);

    // 擷取原始 Canvas 周圍區域
    const sampleSize = 46;
    lCtx.imageSmoothingEnabled = false;
    lCtx.drawImage(
      this.canvas,
      centerX - sampleSize / 2, centerY - sampleSize / 2, sampleSize, sampleSize,
      0, 0, lw, lh
    );

    // 根據當前架構疊加微觀光學特徵網格
    if (this.currentTech === 'kaleido') {
      // 疊加微細 RGB 子像素濾光片網格 (CFA Array Pattern)
      lCtx.save();
      lCtx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      lCtx.lineWidth = 1;
      for (let x = 0; x < lw; x += 12) {
        lCtx.beginPath();
        lCtx.moveTo(x, 0); lCtx.lineTo(x, lh);
        lCtx.stroke();
      }
      for (let y = 0; y < lh; y += 12) {
        lCtx.beginPath();
        lCtx.moveTo(0, y); lCtx.lineTo(lw, y);
        lCtx.stroke();
      }
      lCtx.restore();
    } else if (this.currentTech === 'carta') {
      // 疊加黑白微膠囊微顆粒質感
      lCtx.save();
      lCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let i = 0; i < 40; i++) {
        const rx = (i * 29) % lw;
        const ry = (i * 37) % lh;
        lCtx.fillRect(rx, ry, 2, 2);
      }
      lCtx.restore();
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 清空背景
    ctx.clearRect(0, 0, w, h);

    // 1. 繪製基底樣張圖案 (漫畫 / 名畫 / 標籤)
    this.drawSampleGraphics(ctx, w, h);

    // 2. 套用該顯示膜技術之後處理光學濾鏡效果
    this.applyTechPostProcessing(ctx, w, h);
  }

  drawSampleGraphics(ctx, w, h) {
    if (this.currentSample === 'manga') {
      // 漫畫風格樣張：黑白網點、對比強烈的線條與日文對白框
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      // 漫畫分鏡格
      ctx.strokeStyle = '#111118';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // 背景速度線
      ctx.save();
      ctx.strokeStyle = '#888888';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + Math.cos(i * 0.2) * 20, h / 2 + Math.sin(i * 0.2) * 20);
        ctx.lineTo(w / 2 + Math.cos(i * 0.2) * 320, h / 2 + Math.sin(i * 0.2) * 320);
        ctx.stroke();
      }
      ctx.restore();

      // 主角輪廓剪影與彩度焦點 (紅披風/藍光環)
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(w / 2 - 40, h / 2, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(w / 2 + 50, h / 2 + 20, 50, 0, Math.PI * 2);
      ctx.fill();

      // 墨水高對比文字
      ctx.fillStyle = '#111118';
      ctx.font = '900 24px Noto Sans TC, sans-serif';
      ctx.fillText('⚡ 電泳墨水 ✕ 破界覺醒！', 45, 65);

      ctx.font = '700 14px sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText('EPAPER REVOLUTION vol.2026', 45, 90);

      // 對話氣泡
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#111118';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(w - 140, h - 90, 85, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#111118';
      ctx.font = '800 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('「斷電依然存在！」', w - 140, h - 95);
      ctx.font = '500 11px sans-serif';
      ctx.fillText('雙穩態物理封鎖', w - 140, h - 78);
      ctx.textAlign = 'left';
    } else if (this.currentSample === 'art') {
      // 印象派名畫樣張：莫內睡蓮與夕陽漸層
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(0.35, '#818CF8');
      grad.addColorStop(0.7, '#F472B6');
      grad.addColorStop(1, '#FBBF24');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 水波與光影筆觸
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const x = (i * 67) % (w - 100);
        const y = 80 + (i * 23) % (h - 140);
        ctx.fillRect(x, y, 50, 4);
      }

      ctx.fillStyle = 'rgba(23, 84, 236, 0.6)';
      for (let i = 0; i < 30; i++) {
        const x = 50 + (i * 73) % (w - 120);
        const y = 140 + (i * 29) % (h - 180);
        ctx.fillRect(x, y, 40, 5);
      }

      // 油畫畫框
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'italic 700 18px serif';
      ctx.fillText('Water Lilies & Dusk Glow, E Ink Gallery Studio', 35, h - 35);
    } else {
      // 零售超商 ESL 特價標籤樣張 (紅黃黑白極度醒目)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      // 特價醒目紅標底塊
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(20, 20, w - 40, 75);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px Noto Sans TC, sans-serif';
      ctx.fillText('超商週年慶 ✕ 限時搶購', 40, 55);
      ctx.font = '700 13px sans-serif';
      ctx.fillText('SPECIAL PROMOTION ESL 2026', 40, 78);

      // 大數字價格
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(35, 115, 80, 28);
      ctx.fillStyle = '#000000';
      ctx.font = '900 14px sans-serif';
      ctx.fillText('特價 6 折', 45, 134);

      ctx.fillStyle = '#DC2626';
      ctx.font = '900 68px JetBrains Mono, sans-serif';
      ctx.fillText('$199', 130, 175);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '600 18px sans-serif';
      ctx.fillText('原價 $350', 360, 155);

      // 條碼
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 50; i++) {
        const bw = (i % 3 === 0 || i % 7 === 0) ? 3 : 1.5;
        ctx.fillRect(40 + i * 5, 230, bw, 60);
      }
      ctx.font = '600 11px JetBrains Mono';
      ctx.fillText('4 719864 120264', 80, 310);
    }
  }

  applyTechPostProcessing(ctx, w, h) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    if (this.currentTech === 'carta') {
      // 1. Carta 黑白模式：灰階化 ✕ 16階量化
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // 16 階灰階量化
        const quant = Math.round(gray / 17) * 17;
        data[i] = quant;
        data[i + 1] = quant;
        data[i + 2] = quant;
      }
      ctx.putImageData(imgData, 0, 0);

      // 增加微幅紙質對比
      ctx.fillStyle = 'rgba(247, 245, 238, 0.08)';
      ctx.fillRect(0, 0, w, h);
    } else if (this.currentTech === 'kaleido') {
      // 2. Kaleido 3 模式：4096 色色彩量化 (4-bit per channel) ✕ 模擬微細 CFA 濾光片
      for (let i = 0; i < data.length; i += 4) {
        // 色彩量化為 16 階 (4-bit, 16*16*16 = 4096 色)
        data[i] = Math.round(data[i] / 17) * 17;
        data[i + 1] = Math.round(data[i + 1] / 17) * 17;
        data[i + 2] = Math.round(data[i + 2] / 17) * 17;
      }
      ctx.putImageData(imgData, 0, 0);

      // 疊加微細 RGB 濾光片紋理
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, 600, 1);
      }
    } else if (this.currentTech === 'gallery') {
      // 3. Gallery 3 / ACeP 模式：50,000 色全彩，高飽和微粒擴散質感
      for (let i = 0; i < data.length; i += 4) {
        // 略微增加飽和度，但帶有紙質反射溫潤調
        data[i] = Math.min(255, data[i] * 1.05);
        data[i + 1] = Math.min(255, data[i + 1] * 1.02);
        data[i + 2] = Math.min(255, data[i + 2] * 0.98);
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (this.currentTech === 'spectra') {
      // 4. Spectra 6 模式：高飽和 6 色微粒子鎖定 (黑、白、純紅、純黃、純藍、純綠)
      const palette = [
        [20, 20, 24],      // 黑
        [250, 250, 250],  // 白
        [220, 38, 38],    // 紅
        [234, 179, 8],    // 黃
        [37, 99, 235],    // 藍
        [22, 163, 74]     // 綠
      ];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];

        // 尋找色盤中最接近之顏色 (歐式距離)
        let minD = Infinity;
        let chosen = palette[0];

        palette.forEach(c => {
          const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
          if (d < minD) {
            minD = d;
            chosen = c;
          }
        });

        data[i] = chosen[0];
        data[i + 1] = chosen[1];
        data[i + 2] = chosen[2];
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }
}


// ================= 6. 技術演進時間軸渲染與分類篩選 =================

function initTimeline() {
  const container = document.getElementById('timelineContainer');
  const filterBtns = document.querySelectorAll('.tl-filter-btn');
  if (!container) return;

  let currentFilter = 'all';

  const render = () => {
    container.innerHTML = '';
    const filtered = TIMELINE_DATA.filter(item => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'bw') return item.category === 'bw';
      if (currentFilter === 'color') return item.category === 'color';
      if (currentFilter === 'key') return item.category === 'key';
      return true;
    });

    filtered.forEach(item => {
      const milestone = document.createElement('div');
      const isBreakthrough = item.category === 'key';
      milestone.className = `tl-item ${isBreakthrough ? 'key-breakthrough' : ''} reveal in-view`;

      milestone.innerHTML = `
        <div class="tl-dot"></div>
        <div class="tl-card">
          <span class="tl-year">${item.year}</span>
          <h3 class="tl-title">${item.title}</h3>
          <p class="tl-desc">${item.desc}</p>
          <div>
            <a class="citation-tag" href="${item.link}" target="_blank" rel="noopener noreferrer">
              📑 官方考證：${item.citation} ↗
            </a>
          </div>
        </div>
      `;
      container.appendChild(milestone);
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  render();
}


// ================= 7. 系統元件拓撲動態模擬器 ✕ 節點檢測器 =================

class SystemDataFlowVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.mode = 'local';
    this.packets = [];
    this.packetTimer = 0;
    this.selectedNode = 'mcu';

    this.nodeSpecs = {
      user: {
        icon: "👆",
        title: "使用者介面 (UI / Keypad)",
        sub: "實體按鍵 / 低功耗觸控感應",
        power: "運行: &lt;100 µA / 待機: 0 µA",
        desc: "提供實體按鈕、低功耗按鍵中斷喚醒與翻頁信號，在使用者按下時觸發 MCU 外部中斷 (EXTI)，使整機瞬間退出深度休眠。",
        specs: ["介面: GPIO 外部中斷", "防彈跳時間: 15 ms", "超低漏電流設計"]
      },
      mcu: {
        icon: "💻",
        title: "主控 MCU / SoC",
        sub: "終端系統邏輯中樞",
        power: "運行: 5 mA / 待機: 1.5 µA",
        desc: "負責協調 BLE 無線封包接收、差分圖像解碼、以及透過 SPI 介面呼叫顯示控制器 (TCON) 的波形演算法。更新完畢後立即進入 Deep Sleep。",
        specs: ["典型晶片: Nordic nRF52840 / STM32L4", "介面: QSPI / SPI / UART", "喚醒延遲: &lt; 5 µs"]
      },
      flash: {
        icon: "💾",
        title: "Flash 快取記憶體",
        sub: "本地斷電儲存最後畫面",
        power: "寫入: 8 mA / 待機: 0.1 µA",
        desc: "用於保存上一幀畫面的差分二值化資料 (Diff Buffer)，使局部更新時不需向外部手機重新請求全頁資料。",
        specs: ["容量: 4 MB ~ 16 MB NOR Flash", "介面: Dual/Quad SPI", "保留年限: &gt; 20 年"]
      },
      ble: {
        icon: "📡",
        title: "BLE 低功耗藍牙 IC",
        sub: "2.4GHz 極低功耗無線收發",
        power: "TX/RX 峰值: 15 mA / 待機: &lt; 1 µA",
        desc: "與手機 App 建立 BLE 連線，以差分封包格式（MTU 247 bytes）快速傳輸圖像與配置，大幅減少通訊開銷。",
        specs: ["協定: Bluetooth 5.2 / 5.3", "調變: GFSK 2 Mbps", "通訊距離: 10 ~ 30 米"]
      },
      phone: {
        icon: "📱",
        title: "智慧型手機 App",
        sub: "運算與儲存外移協同端",
        power: "手機電池供電 (不佔用終端能耗)",
        desc: "負責執行語音辨識 (Whisper)、連接雲端大模型、排版渲染、以及將 AI 輸出快速轉為電子紙專用二值化點陣圖。",
        specs: ["架構: 端側協同外移", "支援: iOS / Android 原生連線", "差分演算法壓縮率: &gt; 90%"]
      },
      cloud: {
        icon: "☁️",
        title: "雲端 AI 伺服器 (LLM)",
        sub: "龐大智慧算力與知識庫",
        power: "雲端伺服器算力集裝箱",
        desc: "執行龐大大語言模型 (Gemini / Claude / GPT) 摘要生成、智慧助理角色問答與跨裝置數據持久化同調。",
        specs: ["算力: GPU 叢集推論", "延遲: 500 ~ 1200 ms", "API: RESTful / WebSocket"]
      },
      tcon: {
        icon: "⚙️",
        title: "顯示控制器 TCON",
        sub: "波形 Waveform 運算核心",
        power: "運算: 8 mA / 休眠: 0.5 µA",
        desc: "儲存溫度補償查表 (LUT)，根據環境溫度與前一幀狀態精確計算出每個像素需要施加的電壓脈衝時序。",
        specs: ["內建: 溫度感測器 (NTC)", "演算法: 局部刷新防殘影", "支援: 16 灰階演算法"]
      },
      driver: {
        icon: "⚡",
        title: "高壓驅動 IC (Source / Gate Driver)",
        sub: "精密高壓微脈衝產生器",
        power: "峰值瞬間: 15 ~ 25 mA",
        desc: "將 TCON 傳來的邏輯電平放大為 +15V、-15V 與 0V 的高電壓訊號，驅動 TFT 矩陣上的源極與閘極電極。",
        specs: ["耐壓等級: 30V ~ 40V", "通道數: 640 ~ 1404 channels", "防漏電保護設計"]
      },
      epd: {
        icon: "📄",
        title: "EPD 電子紙面板",
        sub: "雙穩態微膠囊顯示膜",
        power: "維持: 0 µW (斷電零耗電)",
        desc: "電泳墨水層與微膠囊物理成像單元。光線照射於表面反射出黑、白或彩色像素，斷電時畫面永久定格！",
        specs: ["解析度: 300 PPI", "視角: 接近 180° 完全無色偏", "光學類型: 環境光反射式"]
      }
    };

    this._setupControls();
    this.updateInspector('mcu');

    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  _setupControls() {
    const btnLocal = document.getElementById('btnPathLocal');
    const btnExternal = document.getElementById('btnPathExternal');

    if (btnLocal) {
      btnLocal.addEventListener('click', () => {
        this.mode = 'local';
        this.packets = [];
        btnLocal.classList.add('active');
        if (btnExternal) btnExternal.classList.remove('active');
      });
    }

    if (btnExternal) {
      btnExternal.addEventListener('click', () => {
        this.mode = 'external';
        this.packets = [];
        btnExternal.classList.add('active');
        if (btnLocal) btnLocal.classList.remove('active');
      });
    }

    // 節點快捷點擊
    document.querySelectorAll('.node-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeKey = btn.getAttribute('data-node');
        this.selectNode(nodeKey);
      });
    });

    // 畫布點擊判定
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (this.width / rect.width);
      const clickY = (e.clientY - rect.top) * (this.height / rect.height);

      Object.keys(this.nodes).forEach(key => {
        const n = this.nodes[key];
        const w = 110, h = 52;
        if (Math.abs(clickX - n.x) < w / 2 && Math.abs(clickY - n.y) < h / 2) {
          this.selectNode(key);
        }
      });
    });
  }

  selectNode(nodeKey) {
    this.selectedNode = nodeKey;
    document.querySelectorAll('.node-chip').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-node') === nodeKey);
    });
    this.updateInspector(nodeKey);
  }

  updateInspector(nodeKey) {
    const data = this.nodeSpecs[nodeKey];
    if (!data) return;

    const icon = document.getElementById('ndcIcon');
    const title = document.getElementById('ndcTitle');
    const sub = document.getElementById('ndcSub');
    const power = document.getElementById('ndcPowerBadge');
    const desc = document.getElementById('ndcDesc');
    const specsRow = document.getElementById('ndcSpecsRow');

    if (icon) icon.innerText = data.icon;
    if (title) title.innerText = data.title;
    if (sub) sub.innerText = data.sub;
    if (power) power.innerText = data.power;
    if (desc) desc.innerText = data.desc;

    if (specsRow) {
      specsRow.innerHTML = data.specs.map(s => `<span class="spec-tag">${s}</span>`).join('');
    }
  }

  animate(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawTopology();
    this.updateAndDrawPackets(dt);

    requestAnimationFrame(this.animate);
  }

  drawTopology() {
    const ctx = this.ctx;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    this.nodes = {
      user: { x: 75, y: 70, label: '使用者介面', sub: '按鍵 / 觸控' },
      mcu: { x: 260, y: 170, label: '主控 MCU / SoC', sub: '協調排程中樞' },
      flash: { x: 260, y: 265, label: 'Flash 記憶體', sub: '儲存最後畫面' },
      ble: { x: 440, y: 70, label: 'BLE / 通訊晶片', sub: '15mA 峰值收發' },
      phone: { x: 650, y: 70, label: '智慧型手機 App', sub: '排版差分渲染' },
      cloud: { x: 825, y: 70, label: '雲端 AI 模型', sub: 'LLM 龐大算力' },
      tcon: { x: 520, y: 215, label: '顯示控制器 TCON', sub: 'Waveform 波形' },
      driver: { x: 690, y: 215, label: '驅動 IC', sub: '高壓脈衝脈波' },
      epd: { x: 825, y: 215, label: 'E Ink 面板', sub: '雙穩態顯示膜' }
    };

    // 繪製連線底軌
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    const drawConnection = (fromKey, toKey, color) => {
      const from = this.nodes[fromKey];
      const to = this.nodes[toKey];
      ctx.beginPath();
      ctx.strokeStyle = color || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)');
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    };

    // 本地運算連線
    drawConnection('user', 'mcu');
    drawConnection('mcu', 'flash');
    drawConnection('mcu', 'tcon');
    drawConnection('tcon', 'driver');
    drawConnection('driver', 'epd');

    // 外部運算連線
    drawConnection('mcu', 'ble');
    drawConnection('ble', 'phone');
    drawConnection('phone', 'cloud');

    ctx.setLineDash([]);

    // 繪製節點卡片
    Object.keys(this.nodes).forEach(key => {
      const n = this.nodes[key];
      const w = 110, h = 50;
      const rx = n.x - w / 2;
      const ry = n.y - h / 2;

      let isHighlight = false;
      if (this.mode === 'local') {
        isHighlight = ['user', 'mcu', 'flash', 'tcon', 'driver', 'epd'].includes(key);
      } else {
        isHighlight = true;
      }

      const isSelected = this.selectedNode === key;

      ctx.fillStyle = isSelected
        ? (isDark ? '#26344E' : '#EEF4FF')
        : (isHighlight
          ? (isDark ? '#182030' : '#FFFFFF')
          : (isDark ? '#10141D' : '#F1F3F7'));

      ctx.strokeStyle = isSelected
        ? '#1754EC'
        : (isHighlight
          ? (isDark ? '#3B74FF' : '#1754EC')
          : (isDark ? 'rgba(255,255,255,0.06)' : '#E2E6EE'));

      ctx.lineWidth = isSelected ? 2.5 : (isHighlight ? 1.5 : 1);

      ctx.beginPath();
      ctx.roundRect(rx, ry, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // 文字
      ctx.fillStyle = isHighlight
        ? (isDark ? '#F1F5F9' : '#0F172A')
        : (isDark ? '#64748B' : '#94A3B8');
      ctx.font = isSelected ? 'bold 11px sans-serif' : '600 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y - 7);

      ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(n.sub, n.x, n.y + 11);
    });
  }

  updateAndDrawPackets(dt) {
    this.packetTimer += dt;

    if (this.packetTimer > 1.25) {
      this.packetTimer = 0;
      if (this.mode === 'local') {
        this.packets.push({
          route: ['user', 'mcu', 'flash', 'mcu', 'tcon', 'driver', 'epd'],
          stepIndex: 0,
          progress: 0,
          color: '#10B981',
          label: '本機快取畫面'
        });
      } else {
        this.packets.push({
          route: ['user', 'phone', 'cloud', 'phone', 'ble', 'mcu', 'tcon', 'driver', 'epd'],
          stepIndex: 0,
          progress: 0,
          color: '#8B5CF6',
          label: 'AI 生成差分封包'
        });
      }
    }

    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.progress += dt * 1.6;

      if (p.progress >= 1.0) {
        p.progress = 0;
        p.stepIndex++;
        if (p.stepIndex >= p.route.length - 1) {
          this.packets.splice(i, 1);
          continue;
        }
      }

      const fromNode = this.nodes[p.route[p.stepIndex]];
      const toNode = this.nodes[p.route[p.stepIndex + 1]];
      if (!fromNode || !toNode) continue;

      const curX = fromNode.x + (toNode.x - fromNode.x) * p.progress;
      const curY = fromNode.y + (toNode.y - fromNode.y) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      this.ctx.font = 'bold 9px sans-serif';
      this.ctx.fillStyle = p.color;
      this.ctx.fillText(p.label, curX, curY - 11);
    }
  }
}


// ================= 8. 藍牙 BLE 與輕量電源試算模擬器 3.0 =================

function initPowerCalculator() {
  const slider = document.getElementById('refreshSlider');
  const countDisplay = document.getElementById('refreshCountDisplay');
  const connBle = document.getElementById('connBle');
  const connWifi = document.getElementById('connWifi');
  const pwrCr2032 = document.getElementById('pwrCr2032');
  const pwrLipo = document.getElementById('pwrLipo');
  const pwrNfc = document.getElementById('pwrNfc');
  const pwrSolar = document.getElementById('pwrSolar');

  const resBatteryLife = document.getElementById('resBatteryLife');
  const resDeviceWeight = document.getElementById('resDeviceWeight');
  const resBomCost = document.getElementById('resBomCost');
  const resConvenience = document.getElementById('resConvenience');
  const calcVerdictText = document.getElementById('calcVerdictText');
  const selectedConnText = document.getElementById('selectedConnText');
  const selectedPowerText = document.getElementById('selectedPowerText');

  const segStandby = document.getElementById('segStandby');
  const segComm = document.getElementById('segComm');
  const segEpd = document.getElementById('segEpd');
  const pctStandby = document.getElementById('pctStandby');
  const pctComm = document.getElementById('pctComm');
  const pctEpd = document.getElementById('pctEpd');
  const totalMaDisplay = document.getElementById('breakdownTotalMa');

  if (!slider) return;

  const calculate = () => {
    const dailyRefreshes = parseInt(slider.value, 10);
    if (countDisplay) countDisplay.innerText = `${dailyRefreshes} 次 / 天`;

    const isBle = connBle ? connBle.checked : true;
    if (selectedConnText) {
      selectedConnText.innerText = isBle ? 'BLE (藍牙低功耗 - 15mA 峰值)' : 'Wi-Fi (區域網路 - 300mA 峰值)';
    }

    let pwrType = 'cr2032';
    if (pwrLipo && pwrLipo.checked) pwrType = 'lipo';
    if (pwrNfc && pwrNfc.checked) pwrType = 'nfc';
    if (pwrSolar && pwrSolar.checked) pwrType = 'solar';

    const pwrSpecs = {
      cr2032: { capMah: 220, weightG: 3.2, costIdx: '$ 極低', name: 'CR2032 紐扣電池 (220 mAh)' },
      lipo: { capMah: 350, weightG: 12.0, costIdx: '$$ 中等', name: '小型鋰聚合物充電池 (350 mAh)' },
      nfc: { capMah: 0, weightG: 0.5, costIdx: '$ 極低', name: '無電池 NFC 能量採集 (免維護)' },
      solar: { capMah: 50, weightG: 5.5, costIdx: '$$$ 較高', name: '室內弱光太陽能 ✕ 超級電容' }
    };

    if (selectedPowerText) {
      selectedPowerText.innerText = pwrSpecs[pwrType].name;
    }

    // 耗電模型
    const standbyCurrentMa = isBle ? 0.002 : 0.05;
    const standbyMahPerDay = standbyCurrentMa * 24;

    const refreshEnergyMah = 0.00625;
    const commEnergyMah = isBle ? 0.00166 : 0.116;
    const totalMahPerRefresh = refreshEnergyMah + commEnergyMah;

    const commDailyMah = commEnergyMah * dailyRefreshes;
    const epdDailyMah = refreshEnergyMah * dailyRefreshes;
    const totalMahPerDay = standbyMahPerDay + commDailyMah + epdDailyMah;

    // 能耗佔比計算
    const pStandby = Math.round((standbyMahPerDay / totalMahPerDay) * 100);
    const pComm = Math.round((commDailyMah / totalMahPerDay) * 100);
    const pEpd = Math.max(1, 100 - pStandby - pComm);

    if (segStandby) segStandby.style.width = `${pStandby}%`;
    if (segComm) segComm.style.width = `${pComm}%`;
    if (segEpd) segEpd.style.width = `${pEpd}%`;

    if (pctStandby) pctStandby.innerText = `${pStandby}%`;
    if (pctComm) pctComm.innerText = `${pComm}%`;
    if (pctEpd) pctEpd.innerText = `${pEpd}%`;

    if (totalMaDisplay) {
      totalMaDisplay.innerText = `約 ${totalMahPerDay.toFixed(4)} mAh / 天`;
    }

    let estDays = 0;
    let estWeight = 15;
    let convenienceScore = 8.5;
    let verdict = '';

    if (pwrType === 'nfc') {
      estDays = '永久 (免換電池)';
      estWeight = 16;
      convenienceScore = 7.8;
      verdict = '💡 <strong>NFC 能量採集方案：</strong>終端完全不需裝載任何電池！重量僅 16g 極致輕薄。每次畫面更新需由手機靠近感應供電，特別適合倉庫盤點標籤、免維護數位名牌與固定門牌。';
    } else if (pwrType === 'solar') {
      estDays = '室內光源永久循環';
      estWeight = 21;
      convenienceScore = 9.0;
      verdict = '💡 <strong>弱光太陽能方案：</strong>只要室內有辦公室照明即可自行補充微能量，完全免插線換電池，適合固定式會議看板與工廠流程卡。';
    } else {
      const cap = pwrSpecs[pwrType].capMah;
      estDays = Math.round(cap / totalMahPerDay);
      estWeight = Math.round(15 + pwrSpecs[pwrType].weightG);

      if (isBle) {
        convenienceScore = pwrType === 'cr2032' ? 9.4 : 8.8;
        if (pwrType === 'cr2032') {
          verdict = `💡 <strong>BLE ✕ CR2032 黃金推薦組合：</strong>每日更新 ${dailyRefreshes} 次可維持高達 <strong>${estDays} 天</strong>（約 ${(estDays / 30).toFixed(1)} 個月）！總重量僅 18g，極致省電與便攜。`;
        } else {
          verdict = `💡 <strong>BLE ✕ 鋰聚合物組合：</strong>適合需要背光與高頻率互動的使用者，續航約 ${estDays} 天，支援 Type-C 重複充電。`;
        }
      } else {
        convenienceScore = 6.8;
        verdict = `⚠️ <strong>Wi-Fi 耗能警示：</strong>Wi-Fi 每次連線與握手協定峰值電流過大（300mA），大幅消耗容量，CR2032 電池恐難以負荷峰值電流，建議改用鋰電池或切換為 BLE！`;
      }
    }

    if (resBatteryLife) resBatteryLife.innerText = typeof estDays === 'number' ? `${estDays} 天` : estDays;
    if (resDeviceWeight) resDeviceWeight.innerText = `${estWeight} g`;
    if (resBomCost) resBomCost.innerText = pwrSpecs[pwrType].costIdx;
    if (resConvenience) resConvenience.innerText = `${convenienceScore} / 10`;
    if (calcVerdictText) calcVerdictText.innerHTML = verdict;
  };

  slider.addEventListener('input', calculate);
  if (connBle) connBle.addEventListener('change', calculate);
  if (connWifi) connWifi.addEventListener('change', calculate);
  if (pwrCr2032) pwrCr2032.addEventListener('change', calculate);
  if (pwrLipo) pwrLipo.addEventListener('change', calculate);
  if (pwrNfc) pwrNfc.addEventListener('change', calculate);
  if (pwrSolar) pwrSolar.addEventListener('change', calculate);

  // 快速情境預設按鈕
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const preset = chip.getAttribute('data-preset');

      if (preset === 'cr2032_daily') {
        if (connBle) connBle.checked = true;
        if (pwrCr2032) pwrCr2032.checked = true;
        slider.value = 12;
      } else if (preset === 'esl') {
        if (connBle) connBle.checked = true;
        if (pwrCr2032) pwrCr2032.checked = true;
        slider.value = 2;
      } else if (preset === 'ai_dash') {
        if (connBle) connBle.checked = true;
        if (pwrLipo) pwrLipo.checked = true;
        slider.value = 60;
      } else if (preset === 'nfc_badge') {
        if (connBle) connBle.checked = true;
        if (pwrNfc) pwrNfc.checked = true;
        slider.value = 8;
      }
      calculate();
    });
  });

  calculate();
}


// ================= 9. 權威資料來源索引庫渲染與分類篩選 =================

function initCitationsCatalog() {
  const grid = document.getElementById('citationsGrid');
  const filterBtns = document.querySelectorAll('.cit-filter-btn');
  if (!grid) return;

  let currentCategory = 'all';

  const render = () => {
    grid.innerHTML = '';
    const filtered = CITATIONS_DATA.filter(item => {
      return currentCategory === 'all' || item.category === currentCategory;
    });

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'citation-item reveal in-view';
      card.innerHTML = `
        <div>
          <div class="cit-source">
            <span>🌐</span> ${item.domain}
            <span class="cit-tag">${item.tag}</span>
          </div>
          <div class="cit-title">[${index + 1}] ${item.title}</div>
        </div>
        <a class="cit-open-btn" href="${item.url}" target="_blank" rel="noopener noreferrer">
          開啟官方文件 ↗
        </a>
      `;
      grid.appendChild(card);
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      render();
    });
  });

  render();
}


// ================= 10. 主題切換 (Theme Toggle) =================

function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (!btn) return;

  const savedTheme = localStorage.getItem('eink_theme') || 'light';
  applyTheme(savedTheme);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('eink_theme', next);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (icon) icon.innerText = '☀️';
      if (label) label.innerText = '淺色';
    } else {
      if (icon) icon.innerText = '🌙';
      if (label) label.innerText = '暗色';
    }
  }
}


// ================= 11. 頁面捲動進度條 =================

function initScrollProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}


// ================= 12. 導覽列滾動狀態與 Active 高亮 =================

function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }
}


// ================= 13. Scroll Reveal 動畫 =================

function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal:not(.in-view)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}


// ================= 14. 手機漢堡選單抽屜 =================

function initMobileDrawer() {
  const hamburger = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  if (!hamburger || !drawer) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggle(!drawer.classList.contains('open')));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  if (overlay) overlay.addEventListener('click', () => toggle(false));
  drawer.querySelectorAll('.drawer-link').forEach(link => link.addEventListener('click', () => toggle(false)));
}


// ================= 應用程式入口 =================

document.addEventListener('DOMContentLoaded', () => {
  // 1. 全域 UI / UX 強化
  initThemeToggle();
  initScrollProgressBar();
  initNavScroll();
  initMobileDrawer();
  initEinkRefreshTriggers();

  // 2. 核心功能互動模組
  new ElectrophoreticSimulator('particleCanvas', 'waveformCanvas');
  initGlossaryExplorer();
  new ColorArchitectureStudio('colorStudioCanvas', 'studioLoupe', 'loupeCanvas');
  initTimeline();
  new SystemDataFlowVisualizer('flowCanvas');
  initPowerCalculator();
  initCitationsCatalog();

  // 3. 頁面載入完成與動畫啟動
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
    initRevealAnimations();
  });
});
