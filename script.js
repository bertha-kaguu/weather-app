const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const forecastDiv = document.getElementById("forecast");
const locationBtn = document.getElementById("locationBtn");
const darkToggle = document.getElementById("darkToggle");
const recentDiv = document.getElementById("recentSearches");
const container = document.querySelector(".container");
const dateElement = document.getElementById("date");

const today = new Date();
dateElement.textContent = today.toDateString();

searchBtn.addEventListener("click", () => searchWeather());
cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchWeather();
});

locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoords(latitude, longitude);
        },
        error => {
            weatherResult.innerHTML = "Location access denied ❌";
        }
    );
});

darkToggle.addEventListener("click", () => {
    const container = document.querySelector(".container");

    // Toggle dark class on container instead of body
    container.classList.toggle("dark");

    // Save preference
    localStorage.setItem("darkMode", container.classList.contains("dark"));

    // Change the icon dynamically
    if (container.classList.contains("dark")) {
        darkToggle.textContent = "☀️"; // Sun icon for dark mode
    } else {
        darkToggle.textContent = "🌙"; // Moon icon for light mode
    }
});

if (localStorage.getItem("darkMode") === "true") {
    container.classList.add("dark");
    darkToggle.textContent = "☀️";
} else {
    darkToggle.textContent = "🌙";
}

function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;
    getWeather(city);
    saveRecent(city);
}

function getWeather(city) {
    weatherResult.innerHTML = `<div class="loader"></div>`;
    forecastDiv.innerHTML = "";

    fetch(`http://localhost:3000/weather?city=${city}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherResult.innerHTML = data.message;
                return;
            }

            displayWeather(data);
            getForecast(city);
        });
}

function getWeatherByCoords(lat, lon) {
    weatherResult.innerHTML = `<div class="loader"></div>`;
    forecastDiv.innerHTML = "";

    fetch(`http://localhost:3000/weather?lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                weatherResult.innerHTML = data.error;
                return;
            }

            displayWeather(data);

            // use returned city name
            getForecast(data.name);
        })
        .catch(err => {
            weatherResult.innerHTML = "Failed to fetch location weather";
            console.error(err);
        });
}

function displayWeather(data) {
    const icon = data.weather[0].icon;
    const weatherType = data.weather[0].main;

    changeBackground(weatherType);

    weatherResult.innerHTML = `
        <h2>${data.name}</h2>

        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

        <h3>${data.main.temp}°C</h3>

        <p>${data.weather[0].description}</p>

        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Feels like: ${data.main.feels_like}°C</p>
    `;
}

function getForecast(city) {
    fetch(`http://localhost:3000/forecast?city=${city}`)
        .then(res => res.json())
        .then(data => {

            const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

            forecastDiv.innerHTML = "";

            daily.slice(0, 5).forEach((day, index) => {

                const date = new Date(day.dt_txt);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

                const temp = Math.round(day.main.temp);
                const icon = day.weather[0].icon;

                forecastDiv.innerHTML += `
                <div class="forecast-card" style="animation-delay:${index * 0.2}s">
                <p class="day">
                ${new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p class="temp">${Math.round(day.main.temp)}°C</p>
                </div>
               `;
            });
        });
}

function saveRecent(city) {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    if (!cities.includes(city)) {
        cities.unshift(city);
        if (cities.length > 5) cities.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(cities));
    showRecent();
}

function showRecent() {
    const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    recentDiv.innerHTML = cities.map(city =>
        `<button onclick="searchFromRecent('${city}')">${city}</button>`
    ).join("");
}

function searchFromRecent(city) {
    cityInput.value = city;
    getWeather(city);
}

showRecent();

function changeBackground(weatherType) {
    if (weatherType === "Clear") {
        document.body.style.background = "linear-gradient(to right, #56ccf2, #2f80ed)";
    } 
    else if (weatherType === "Rain") {
        document.body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
    } 
    else if (weatherType === "Clouds") {
        document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } 
    else {
        document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
    }
}