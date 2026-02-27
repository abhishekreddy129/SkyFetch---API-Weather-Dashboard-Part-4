this.recentContainer = document.getElementById("recentContainer");
this.clearHistoryBtn = document.getElementById("clearHistoryBtn");
this.recentSearches = [];

WeatherApp.prototype.loadRecentSearches = function () {
    const stored = localStorage.getItem("recentSearches");
    this.recentSearches = stored ? JSON.parse(stored) : [];
    this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    this.recentSearches = this.recentSearches.filter(c => c !== city);
    this.recentSearches.unshift(city);

    if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
    }

    localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
    localStorage.setItem("lastCity", city);

    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
    this.recentContainer.innerHTML = "";

    this.recentSearches.forEach(city => {
        const btn = document.createElement("button");
        btn.className = "recent-btn";
        btn.textContent = city;

        btn.addEventListener("click", () => {
            this.getWeather(city);
        });

        this.recentContainer.appendChild(btn);
    });
};

WeatherApp.prototype.loadLastCity = function () {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        this.getWeather(lastCity);
    }
};

WeatherApp.prototype.clearHistory = function () {
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("lastCity");
    this.recentSearches = [];
    this.displayRecentSearches();
};

this.saveRecentSearch(city);

this.loadRecentSearches();
this.loadLastCity();

this.clearHistoryBtn.addEventListener("click", this.clearHistory.bind(this));