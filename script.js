const apiKey = "65646105ab2d0cdac212a8608d066b91";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", () => {
    searchWeather();
});

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWeather();
    }
});

function searchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
}

function getWeather(city) {

    weatherResult.innerHTML = "<p>Loading...</p>";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.cod !== 200) {
                weatherResult.innerHTML = `
                    <div class="error">
                        ${data.message}
                    </div>
                `;
                return;
            }

            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const icon = data.weather[0].icon;

            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            changeBackground(data.weather[0].main);

            weatherResult.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${iconUrl}" alt="weather icon">
                <h3>${temperature}°C</h3>
                <p>${description}</p>
                <p>Humidity: ${humidity}%</p>
            `;
        })
        .catch(error => {
            weatherResult.innerHTML = `
                <div class="error">
                    Something went wrong.
                </div>
            `;
        });
}

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