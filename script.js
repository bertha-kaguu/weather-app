const apiKey = "65646105ab2d0cdac212a8608d066b91";

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
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
    });
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

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
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
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
            getForecast(data.name);
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
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

            forecastDiv.innerHTML = "";

            daily.slice(0, 5).forEach(day => {

                const date = new Date(day.dt_txt);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

                const temp = Math.round(day.main.temp);
                const icon = day.weather[0].icon;

                forecastDiv.innerHTML += `
                    <div class="forecast-card">
                        <p>${dayName}</p>
                        <img src="https://openweathermap.org/img/wn/${icon}.png">
                        <p>${temp}°C</p>
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
        `<button onclick="getWeather('${city}')">${city}</button>`
    ).join("");
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