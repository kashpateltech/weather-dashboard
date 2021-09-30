var cities = []; 
var enterCityEL = document.getElementById("enter-city");
var searchFieldEl = document.getElementById("search-button");
var clearHistoryEl = document.getElementById("clear-history");
var cityNameEl= document.getElementById("city-name");
var fivedayEL = document.getElementById("fiveday-header");
var currWeatherEl = document.getElementById("curr-weather");
var searchHistoryEL = document.getElementById("search-history");
var clearHistory = document.getElementById("clear-history");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = enterCityEL.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift(city);
        enterCityEL.value ="";
    } else{
        alert("Enter City Name:");
    }
    saveSearch(city);
    searchHistory();
};

var saveSearch = function(cities){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    var apiKey = "621cbfce1356e527e13d22f8d2d6998f";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};
var displayWeather = function (weather, searchCity) {
    currWeatherEl.textContent="";
    
    
    //console.log(weather);
    var cityDiv = document.createElement("h3");    
    cityDiv.classList.add("city-name", "align-middle");    
    cityDiv.setAttribute("id","city-name");
    currWeatherEl.appendChild(cityDiv);
    cityDiv.textContent= searchCity;

    var currentDate = document.createElement("span");
    currentDate.textContent = "(" + moment(weather.dt.value).format("DD MMMM YYYY") + ")";
    cityDiv.appendChild(currentDate);

    //Create image Element
    var weatherImage = document.createElement("img");
    weatherImage.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    cityDiv.appendChild(weatherImage);

    //Temperature data
    var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item";

   //Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item";

   //wind data
   var windEl = document.createElement("span");
   windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windEl.classList = "list-group-item";

    currWeatherEl.appendChild(temperatureEl);

    currWeatherEl.appendChild(humidityEl);

    currWeatherEl.appendChild(windEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUVIndex(lat,lon);
};

    var getUVIndex = function (lat,lon) {
    var apiKey = "621cbfce1356e527e13d22f8d2d6998f";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            displayUVIndex(data);
        });
    });

};

    var displayUVIndex = function(index) {
    var UVIndexEl = document.createElement("div");
    UVIndexEl.textContent = "UV Index: ";
    UVIndexEl.classList = "list-group-item";

    var UVIndexValue = document.createElement("span");
    UVIndexValue.textContent = index.value;

    if(index.value<=2){
        UVIndexValue.classList = "favourable";
    } 
    else if(index.value>2 && index.value<=8){
        UVIndexValue.classList = "moderate";
    }
    else if(index.value>8){
        UVIndexValue.classList = "severe";
    }
    UVIndexEl.appendChild(UVIndexValue);
    currWeatherEl.appendChild(UVIndexEl);
};

var get5Day = function(city){
    var apiKey = "621cbfce1356e527e13d22f8d2d6998f";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            display5Day(data);
        });
    });
};

var display5Day = function(weather){
    fivedayEL.textContent = "";
    var fiveDayFore = document.createElement("h3");    
    fiveDayFore.classList.add("col-12");    
  
    fiveDayFore.textContent = "5 Day Forecast";
    fivedayEL.appendChild(fiveDayFore);

    var forecast = weather.list;
    for(var i=5; i < forecast.length; i=i+8){
        var dailyForecast = forecast[i];

        var fivedayForecastEl = document.createElement("div");
        fivedayForecastEl.classList = "card bg-primary text-light m-2";

        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("DD MMM YYYY");
        forecastDate.classList = "card-header text-center";
        fivedayForecastEl.appendChild(forecastDate);

        var weatherImage = document.createElement("img");
        weatherImage.classList = "card-body text-center";
        weatherImage.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        fivedayForecastEl.appendChild(weatherImage);


        //forecast temperature
        var forecastTemperatureEl = document.createElement("span");
        forecastTemperatureEl.classList = "card-body text-center";
        forecastTemperatureEl.textContent = "Temperature: " + dailyForecast.main.temp + " °F";

        fivedayForecastEl.appendChild(forecastTemperatureEl);

        //humidity
        var forecastHumidityEl = document.createElement("span");
        forecastHumidityEl.classList = "card-body text-center";
        forecastHumidityEl.textContent = "Humidity: " + dailyForecast.main.humidity + " %";

        fivedayForecastEl.appendChild(forecastHumidityEl);

        var forecastWindEl = document.createElement("span");
        forecastWindEl.classList = "card-body text-center";
        forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";

        fivedayForecastEl.appendChild(forecastWindEl);
        fivedayEL.appendChild(fivedayForecastEl);
    }
};

var searchHistory = function() {
    var citiesNameList = document.getElementById('cities-name');
    var citiesData = JSON.parse(localStorage.getItem("cities"));
    //for(var i in citiesData){
        var citiesName = document.createElement("span");
        citiesName.classList = "card-body text-center";
        citiesName.textContent = citiesData;
        citiesName.setAttribute("data-city", citiesData);
        citiesName.addEventListener("click", searchHistoryHandler);
        citiesNameList.appendChild(citiesName);
   // }
};

var searchHistoryHandler = function(event){
    var city = event.target.getAttribute("data-city");
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
};

var clearHistoryHandler = function(event){
    localStorage.clear();
    var clearCities = document.getElementById("cities-name");
    clearCities.textContent = "";
};

searchFieldEl.addEventListener("click", formSubmitHandler);
clearHistory.addEventListener("click", clearHistoryHandler);