const weatherCache = {};

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

const renderForecast = (city, data) => {
  const el = document.getElementById(`forecast-${city}`);
  if (!el) return;

  const today = new Date().getDay();
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
  } catch (err) {
    const el = document.getElementById(`forecast-${city}`);
    if (el) {
      el.textContent = "";
      el.className = "";
    }
  }
};
