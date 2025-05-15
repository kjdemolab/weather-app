const app = document.getElementById("app");
app.innerHTML = `
  <div class="w-full max-w-md bg-white bg-opacity-10 rounded-2xl shadow-xl p-6 backdrop-blur-sm text-center">
    <h1 class="text-4xl font-extrabold mb-4 tracking-tight">🌍 Live Weather Anywhere</h1>
    <p class="mb-4 text-white text-opacity-80">Search or select a city below to use your current location.</p>

    <select id="cityDropdown" class="w-full mb-2 p-3 rounded-lg text-black">
      <option value="">-- Select a city --</option>
      <option value="Singapore">Singapore</option>
      <option value="Kuala Lumpur">Kuala Lumpur</option>
      <option value="George Town">George Town</option>
      <option value="Johor Bahru">Johor Bahru</option>
      <option value="Bangkok">Bangkok</option>
    </select>

    <input id="cityInput" type="text" placeholder="Or type city name"
      class="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-purple-400" />

    <button onclick="getWeather()"
      class="mt-4 bg-white text-blue-700 font-bold px-6 py-2 rounded-lg hover:bg-blue-100 transition w-full">
      🔍 Get Weather
    </button>

    <button onclick="getWeatherByLocation()"
      class="mt-2 bg-yellow-300 text-blue-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition w-full">
      📍 Use My Location
    </button>

    <div id="loader" class="hidden mt-6 text-white text-lg animate-pulse">Loading...</div>

    <div id="weatherResult" class="mt-6 hidden">
      <h2 class="text-2xl font-semibold" id="cityName"></h2>
      <div class="flex flex-col items-center mt-2">
        <img id="icon" class="w-20 h-20" alt="Weather icon" />
        <p class="text-lg mt-2" id="temperature"></p>
        <p class="italic" id="condition"></p>
      </div>
    </div>

    <div id="forecast" class="mt-8 hidden">
      <h3 class="text-xl font-bold mb-2">5-Day Forecast</h3>
      <div id="forecastCards" class="grid grid-cols-2 sm:grid-cols-3 gap-4"></div>
    </div>
  </div>
`;

window.getWeather = async function () {
  const dropdownValue = document.getElementById("cityDropdown").value;
  const inputValue = document.getElementById("cityInput").value;
  const city = inputValue || dropdownValue;
  if (!city) return alert("Please select or enter a city");
  fetchWeather(`q=${encodeURIComponent(city)}`);
};

window.getWeatherByLocation = async function () {
  if (!navigator.geolocation) return alert("Geolocation not supported");
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(`lat=${lat}&lon=${lon}`);
  }, () => alert("Unable to retrieve your location"));
};

async function fetchWeather(query) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const resultDiv = document.getElementById("weatherResult");
  const cityName = document.getElementById("cityName");
  const temp = document.getElementById("temperature");
  const condition = document.getElementById("condition");
  const icon = document.getElementById("icon");
  const loader = document.getElementById("loader");
  const forecastDiv = document.getElementById("forecast");
  const forecastCards = document.getElementById("forecastCards");

  loader.classList.remove("hidden");
  resultDiv.classList.add("hidden");
  forecastDiv.classList.add("hidden");
  forecastCards.innerHTML = "";

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    if (!res.ok) throw new Error("City not found");

    cityName.innerText = data.name;
    temp.innerText = `🌡️ ${data.main.temp.toFixed(1)}°C`;
    condition.innerText = `☁️ ${data.weather[0].description}`;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    resultDiv.classList.remove("hidden");

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();
    const days = {};

    for (let i = 0; i < forecastData.list.length; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt_txt);
      const day = date.toDateString();
      if (!days[day] && Object.keys(days).length < 5) {
        days[day] = item;
      }
    }

    Object.values(days).forEach(day => {
      const card = document.createElement("div");
      card.className = "bg-white bg-opacity-20 rounded-xl p-3 text-sm";
      card.innerHTML = `
        <p class="font-bold">${new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="w-10 h-10 mx-auto" alt="">
        <p>${day.main.temp.toFixed(1)}°C</p>
      `;
      forecastCards.appendChild(card);
    });

    forecastDiv.classList.remove("hidden");
  } catch (err) {
    alert("Unable to retrieve weather. Check your API key or internet connection.");
  } finally {
    loader.classList.add("hidden");
  }
}
