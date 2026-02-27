function WeatherApp() {
    this.apiKey = "8e5805bef5462319012c71d0b5e0b3e2";
    this.baseUrl = "https://api.openweathermap.org/data/2.5/";

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherContainer = document.getElementById("weatherContainer");
    this.forecastContainer = document.getElementById("forecastContainer");
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.handleSearch();
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherContainer.innerHTML =
        "<h3>Search for a city to see weather 🌤️</h3>";
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();
    if (!city) {
        this.showError("Please enter a city name");
        return;
    }

    this.getWeather(city);
};

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();

        const weatherUrl =
            `${this.baseUrl}weather?q=${city}&appid=${this.apiKey}&units=metric`;

        const forecastUrl =
            `${this.baseUrl}forecast?q=${city}&appid=${this.apiKey}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(forecastUrl)
        ]);

        this.displayWeather(weatherRes.data);

        const processedData =
            this.processForecastData(forecastRes.data.list);

        this.displayForecast(processedData);

    } catch (error) {
        this.showError("City not found. Try again.");
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <h3>${data.main.temp}°C</h3>
        <p>${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    `;
};

WeatherApp.prototype.processForecastData = function (list) {
    const daily = list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );
    return daily.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastData) {
    this.forecastContainer.innerHTML = "";

    forecastData.forEach(day => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <h4>${new Date(day.dt_txt).toDateString()}</h4>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;

        this.forecastContainer.appendChild(card);
    });
};

WeatherApp.prototype.showLoading = function () {
    this.weatherContainer.innerHTML =
        "<div class='spinner'></div>";
};

WeatherApp.prototype.showError = function (message) {
    this.weatherContainer.innerHTML =
        `<p class="error">${message}</p>`;
};

const app = new WeatherApp();
app.init();