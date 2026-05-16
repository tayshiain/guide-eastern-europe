const weatherCache = {};
const monthlyClimateCache = {};

const MONTH_INDEX = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const WMO_ICON = (code, isDay = true) => {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "🌤️" : "🌤️";
  if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  if (code <= 86) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
};

const DAY_ABBR = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const pad2 = (n) => String(n).padStart(2, "0");

const daysInMonth = (year, monthNum) => new Date(year, monthNum, 0).getDate();

const average = (values) => {
  const nums = values.filter((x) => x != null && !Number.isNaN(Number(x)));
  if (!nums.length) return null;
  const sum = nums.reduce((acc, x) => acc + Number(x), 0);
  return sum / nums.length;
};

const modeWeatherCode = (codes) => {
  const counts = {};
  codes.forEach((c) => {
    if (c == null || Number.isNaN(Number(c))) return;
    const key = Number(c);
    counts[key] = (counts[key] || 0) + 1;
  });
  let bestCode = 0;
  let bestCount = 0;
  Object.entries(counts).forEach(([code, n]) => {
    if (n > bestCount) {
      bestCount = n;
      bestCode = Number(code);
    }
  });
  return bestCode;
};

const formatMonthTitle = (monthKey) =>
  monthKey ? monthKey.charAt(0).toUpperCase() + monthKey.slice(1) : "";

const getSurveyTravelMonth = () => {
  try {
    return typeof activeTrip !== "undefined" && activeTrip?.survey?.travelMonth
      ? activeTrip.survey.travelMonth
      : "";
  } catch {
    return "";
  }
};

const summarizeMonthlyArchive = (data) => {
  const daily = data?.daily;
  if (!daily) return null;
  const { temperature_2m_max: highs, temperature_2m_min: lows, weathercode } = daily;
  if (!highs?.length || !lows?.length) return null;

  const avgHigh = average(highs);
  const avgLow = average(lows);
  if (avgHigh == null || avgLow == null) return null;

  const typicalCode = modeWeatherCode(weathercode || []);
  return {
    avgHigh: Math.round(avgHigh),
    avgLow: Math.round(avgLow),
    icon: WMO_ICON(typicalCode),
  };
};

const fetchMonthlyClimateArchive = async (city, monthKey) => {
  const monthNum = MONTH_INDEX[monthKey];
  if (!monthNum || !cityCoords[city]) return null;

  const cacheKey = `${city}:${monthKey}`;
  if (monthlyClimateCache[cacheKey]) return monthlyClimateCache[cacheKey];

  const year = 2024;
  const start = `${year}-${pad2(monthNum)}-01`;
  const end = `${year}-${pad2(monthNum)}-${pad2(daysInMonth(year, monthNum))}`;
  const { lat, lon, tz } = cityCoords[city];
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
    `&start_date=${start}&end_date=${end}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=${encodeURIComponent(tz)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const summary = summarizeMonthlyArchive(data);
    if (summary) monthlyClimateCache[cacheKey] = summary;
    return summary;
  } catch {
    return null;
  }
};

const renderMonthlyClimateSection = async (city) => {
  const el = document.getElementById(`forecast-${city}`);
  if (!el) return;

  el.querySelectorAll(".weather-month-summary").forEach((node) => node.remove());

  const monthKey = getSurveyTravelMonth();
  if (!monthKey) {
    const hint = document.createElement("p");
    hint.className = "weather-month-summary weather-month-hint";
    hint.textContent = "Select a travel month above to see typical weather.";
    el.appendChild(hint);
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "weather-month-summary weather-month-loading";
  wrap.textContent = "Loading typical weather…";
  el.appendChild(wrap);

  const summary = await fetchMonthlyClimateArchive(city, monthKey);

  const slot = el.querySelector(".weather-month-summary.weather-month-loading");
  if (!slot) return;

  slot.classList.remove("weather-month-loading");

  if (!summary) {
    slot.textContent = "Typical weather for this month is unavailable.";
    return;
  }

  const title = formatMonthTitle(monthKey);
  slot.innerHTML = `
    <div class="weather-month-head">
      <span class="weather-month-icon" aria-hidden="true">${summary.icon}</span>
      <div class="weather-month-body">
        <div class="weather-month-title">${title} · typical</div>
        <div class="weather-month-temps">Avg high <strong>${summary.avgHigh}°</strong> · Avg low <strong>${summary.avgLow}°</strong></div>
        <div class="weather-month-note">Based on ${title} 2024 · Open-Meteo archive</div>
      </div>
    </div>
  `;
};

const renderForecast = (city, data) => {
  const el = document.getElementById(`forecast-${city}`);
  if (!el) return;

  const { time, temperature_2m_max, temperature_2m_min, weathercode } = data.daily;

  const strip = document.createElement("div");
  strip.className = "weather-forecast-strip";

  time.slice(0, 7).forEach((dateStr, i) => {
    const d = new Date(dateStr);
    const dayIdx = d.getDay();
    const isToday = i === 0;
    const high = Math.round(temperature_2m_max[i]);
    const low = Math.round(temperature_2m_min[i]);
    const icon = WMO_ICON(weathercode[i]);

    const dayEl = document.createElement("div");
    dayEl.className = "weather-day" + (isToday ? " today" : "");
    dayEl.innerHTML = `
      <span class="weather-day-name">${isToday ? "Today" : DAY_ABBR[dayIdx]}</span>
      <span class="weather-day-icon">${icon}</span>
      <span class="weather-day-high">${high}°</span>
      <span class="weather-day-low">${low}°</span>
    `;
    strip.appendChild(dayEl);
  });

  const liveLabel = document.createElement("p");
  liveLabel.className = "weather-live-label";
  liveLabel.innerHTML = '<span class="dot"></span>Live · 7-day · Open-Meteo';

  el.innerHTML = "";
  el.className = "";
  el.appendChild(strip);
  el.appendChild(liveLabel);
};

const fetchWeather = async (city) => {
  if (weatherCache[city]) {
    renderForecast(city, weatherCache[city]);
    await renderMonthlyClimateSection(city);
    return;
  }
  const { lat, lon, tz } = cityCoords[city];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=${encodeURIComponent(tz)}&forecast_days=7`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    weatherCache[city] = data;
    renderForecast(city, data);
    await renderMonthlyClimateSection(city);
  } catch (err) {
    const el = document.getElementById(`forecast-${city}`);
    if (el) {
      el.textContent = "";
      el.className = "";
    }
  }
};
