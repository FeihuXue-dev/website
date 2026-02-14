const dateLine = document.getElementById("dateLine");
const timeLine = document.getElementById("timeLine");
const weatherLine = document.getElementById("weatherLine");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

const weatherMap = {
  0: "晴",
  1: "多云",
  2: "局部多云",
  3: "阴",
  45: "雾",
  48: "冻雾",
  51: "小毛雨",
  53: "毛雨",
  55: "大毛雨",
  56: "冻毛雨",
  57: "强冻毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "冻雨",
  67: "强冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "冰粒",
  80: "阵雨",
  81: "强阵雨",
  82: "暴雨",
  85: "阵雪",
  86: "强阵雪",
  95: "雷暴",
  96: "雷暴伴小冰雹",
  99: "雷暴伴大冰雹"
};

function updateClock() {
  const now = new Date();

  if (dateLine) {
    dateLine.textContent = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      timeZone: "Asia/Shanghai"
    }).format(now);
  }

  if (timeLine) {
    timeLine.textContent = new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Shanghai"
    }).format(now);
  }
}

async function fetchWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonSmart(url) {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  try {
    const direct = await fetchWithTimeout(url);
    return await direct.json();
  } catch (_) {
    const proxied = await fetchWithTimeout(proxyUrl);
    return await proxied.json();
  }
}

async function loadWuhanWeather() {
  if (!weatherLine) {
    return;
  }

  const url = "https://api.open-meteo.com/v1/forecast?latitude=30.5928&longitude=114.3055&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FShanghai";

  try {
    const data = await fetchJsonSmart(url);
    const current = data.current;

    if (!current) {
      throw new Error("Missing weather data");
    }

    const temp = Math.round(current.temperature_2m);
    const wind = Math.round(current.wind_speed_10m);
    const weatherText = weatherMap[current.weather_code] || "天气正常";

    weatherLine.textContent = `武汉市 ${weatherText} ${temp}°C 风速 ${wind} km/h`;
  } catch (error) {
    weatherLine.textContent = "武汉市 天气数据暂不可用";
  }
}

async function loadRandomQuote() {
  if (!quoteText || !quoteAuthor) {
    return;
  }

  const url = "https://v1.hitokoto.cn/?c=d&c=i&c=k&encode=json";

  try {
    const data = await fetchJsonSmart(url);
    const text = data.hitokoto || "保持热爱，奔赴山海。";
    const source = data.from_who || data.from || "佚名";

    quoteText.textContent = `"${text}"`;
    quoteAuthor.textContent = `- ${source}`;
  } catch (error) {
    quoteText.textContent = "\"保持热爱，奔赴山海。\"";
    quoteAuthor.textContent = "- 佚名";
  }
}

updateClock();
setInterval(updateClock, 1000);

loadWuhanWeather();
setInterval(loadWuhanWeather, 10 * 60 * 1000);

loadRandomQuote();
setInterval(loadRandomQuote, 30 * 60 * 1000);
