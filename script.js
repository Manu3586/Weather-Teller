async function getWeather() {
  const location = document.getElementById('locationInput').value.trim();
  const resultBox = document.getElementById('weatherResult');
  const effectBox = document.getElementById('weatherEffect');

  resultBox.innerHTML = '';
  effectBox.innerHTML = '';
  resultBox.classList.remove('show');

  if (!location) return showError('Please enter a city name');

  showLoading(true);

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) return showError(data.message);

    displayWeather(data);
    applyWeatherEffects(data);

    document.getElementById('locationInput').value = '';
  } catch {
    showError('Failed to fetch weather data. Please try again.');
  } finally { showLoading(false); }
}

function displayWeather(data) {
  const resultBox = document.getElementById('weatherResult');
  const { temp, feels_like: feelsLike, humidity, pressure } = data.main;
  const { speed: wind } = data.wind;
  const { description } = data.weather[0];
  const locationName = `${data.name}, ${data.sys.country}`;

  resultBox.innerHTML = `
    <div class="weather-dashboard">
      <div class="location-header">
        <div class="location-name">${locationName}</div>
        <div class="weather-desc">${description}</div>
      </div>
      <div class="weather-grid">
        <div class="weather-section">
          <div class="label">Temperature</div>
          <div class="value">${Math.round(temp)}°C</div>
          <div class="feels-like">Feels like: ${Math.round(feelsLike)}°C</div>
        </div>
        <div class="weather-section">
          <div class="label">Humidity</div>
          <div class="value">${humidity}%</div>
        </div>
        <div class="weather-section">
          <div class="label">Pressure</div>
          <div class="value">${pressure} hPa</div>
        </div>
        <div class="weather-section">
          <div class="label">Wind</div>
          <div class="value">${wind} m/s</div>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => resultBox.classList.add('show'), 100);
}

function applyWeatherEffects(data) {
  const condition = data.weather[0].main;
  const container = document.getElementById('weatherEffect');
  const effectMap = {
    Rain: createRainEffect,
    Drizzle: createRainEffect,
    Snow: createSnowEffect,
    Clear: createSunEffect,
    Clouds: createCloudEffect,
    Thunderstorm: createThunderEffect
  };
  if (effectMap[condition]) effectMap[condition](container);
}

function createRainEffect(container) {
  for (let i = 0; i < 100; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = `${Math.random()*100}vw`;
    drop.style.animationDelay = `${Math.random()*2}s`;
    drop.style.animationDuration = `${1 + Math.random()*0.5}s`;
    container.appendChild(drop);
  }
}

function createSnowEffect(container) {
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.style.left = `${Math.random()*100}vw`;
    flake.style.animationDelay = `${Math.random()*3}s`;
    flake.style.animationDuration = `${3 + Math.random()*2}s`;
    container.appendChild(flake);
  }
}

function createSunEffect(container) { container.appendChild(Object.assign(document.createElement('div'), {className:'sun'})); }

function createCloudEffect(container) {
  for (let i=0;i<3;i++){
    const cloud = document.createElement('div');
    cloud.className='cloud';
    cloud.style.top=`${50+i*80}px`;
    cloud.style.animationDelay=`${i*5}s`;
    container.appendChild(cloud);
  }
}

function createThunderEffect(container) { container.appendChild(Object.assign(document.createElement('div'), {className:'thunder'})); }

function showLoading(show) {
  const spinner = document.getElementById('loadingSpinner');
  const btn = document.querySelector('.search-btn');
  spinner.classList.toggle('show', show);
  btn.style.opacity = show ? '0.6' : '1';
  btn.style.pointerEvents = show ? 'none' : 'auto';
}

function showError(message) {
  const resultBox = document.getElementById('weatherResult');
  resultBox.innerHTML = `<div class="error-card"><div class="error-title">Error</div><div class="error-message">${message}</div></div>`;
  setTimeout(()=>resultBox.classList.add('show'),100);
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('locationInput');
  input.addEventListener('keypress', e => { if(e.key==='Enter'){ e.preventDefault(); getWeather(); } });
  input.focus();
});
