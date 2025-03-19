const apiKey = "21896df6e4d5fbeee2e8e295fedfcec5";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const precipitation = document.getElementById("precipitation");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const forecastDays = document.getElementById("forecastDays");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(apiUrl),
      fetch(forecastUrl),
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error("Invalid API response");
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    if (weatherData.cod === 200) {
      displayCurrentWeather(weatherData);
      displayForecast(forecastData);
    } else {
      alert("City not found. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("An error occurred while fetching weather data.");
  }
}

function displayCurrentWeather(data) {
  cityName.textContent = data.name;
  dateTime.textContent = new Date().toLocaleString();
  temperature.textContent = `${data.main.temp}°C`;
  weatherDescription.textContent = data.weather[0].description;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  precipitation.textContent = `Precipitation: ${data.rain ? data.rain["1h"] || 0 : 0} mm`;
}

function displayForecast(data) {
  forecastDays.innerHTML = "";
  const dailyForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  dailyForecast.forEach((item) => {
    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";
    forecastDay.innerHTML = `
      <p>${new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</p>
      <p>${item.main.temp}°C</p>
      <p>${item.weather[0].description}</p>
    `;
    forecastDays.appendChild(forecastDay);
  });
}
