const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/",
};

const defaultCity = "Chennai";

const ui = {
  searchBox: document.querySelector(".search-box"),
  searchButton: document.querySelector(".search-btn"),
  status: document.querySelector(".status"),
  weatherShell: document.querySelector(".weather"),
  city: document.querySelector(".location .city"),
  date: document.querySelector(".location .date"),
  temp: document.querySelector(".current .temp"),
  weatherText: document.querySelector(".current .weather"),
  hiLow: document.querySelector(".current .hi-low"),
  feels: document.querySelector(".details-grid .feels"),
  humidity: document.querySelector(".details-grid .humidity"),
  wind: document.querySelector(".details-grid .wind"),
  pressure: document.querySelector(".details-grid .pressure"),
};

const setStatus = (message, type = "info") => {
  ui.status.textContent = message;
  ui.status.dataset.type = type;
};

const handleSearch = () => {
  const query = ui.searchBox.value.trim();
  if (!query) {
    setStatus("Please enter a city name to look up its weather.", "error");
    ui.weatherShell.classList.add("hidden");
    return;
  }
  getResults(query);
};

ui.searchButton.addEventListener("click", handleSearch);
ui.searchBox.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    handleSearch();
  }
});

async function getResults(query) {
  try {
    setStatus(`Looking up weather for “${query}”...`, "loading");
    ui.weatherShell.classList.add("hidden");

    const url = `${api.base}weather?q=${encodeURIComponent(query)}&units=metric&APPID=${api.key}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found. Please try a different search.");
    }

    const weather = await response.json();
    displayResults(weather);
    setStatus(`Updated recently for ${weather.name}, ${weather.sys.country}.`, "success");
  } catch (error) {
    setStatus(error.message || "Unable to fetch weather right now.", "error");
  }
}

function displayResults(weather) {
  ui.city.textContent = `${weather.name}, ${weather.sys.country}`;
  ui.date.textContent = dateBuilder(new Date(weather.dt * 1000));

  ui.temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  ui.weatherText.textContent = weather.weather[0].description;
  ui.hiLow.textContent = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  ui.feels.textContent = `${Math.round(weather.main.feels_like)}°c`;
  ui.humidity.textContent = `${weather.main.humidity}%`;
  ui.wind.textContent = `${Math.round(weather.wind.speed * 3.6)} km/h`;
  ui.pressure.textContent = `${weather.main.pressure} hPa`;

  ui.weatherShell.classList.remove("hidden");
}

function dateBuilder(dateObject) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[dateObject.getDay()];
  const date = dateObject.getDate();
  const month = months[dateObject.getMonth()];
  const year = dateObject.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

// Load a default city the first time.
setStatus(`Loading default city (${defaultCity})...`, "loading");
getResults(defaultCity);