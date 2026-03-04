const apiKey = "65646105ab2d0cdac212a8608d066b91";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
});

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); // 🔍 See what API returns

            // If API returns error
            if (data.cod !== 200) {
                weatherResult.innerHTML = `<p>Error: ${data.message}</p>`;
                return;
            }

            // Safe access
            const temperature = data.main?.temp;
            const description = data.weather?.[0]?.description;
            const humidity = data.main?.humidity;

            weatherResult.innerHTML = `
                <h2>${data.name}</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Weather: ${description}</p>
                <p>Humidity: ${humidity}%</p>
            `;
        })
        .catch(error => {
            console.error("Error:", error);
            weatherResult.innerHTML = "<p>Something went wrong.</p>";
        });
}