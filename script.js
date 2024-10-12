const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-information');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const countryText = document.querySelector('.country-text');
const temperatureText = document.querySelector('.temperature-text');
const conditionText = document.querySelector('.condition-text');
const humidityValueText = document.querySelector('.humidity-value-text');
const windValueText = document.querySelector('.wind-value-text');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateText = document.querySelector('.current-date-text');
const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = 'a76b6c9742e15ed6cc9ba0ada1625d7b';
console.log('API Key:', apiKey);


searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        console.log(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        console.log(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiURL);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'icons8-storm-96.png';
    if (id <= 321) return 'icons8-light-rain-96.png';
    if (id <= 531) return 'icons8-heavy-rain-96.png';
    if (id <= 622) return 'icons8-snow-96.png';
    if (id <= 781) return 'icons8-tornado-96.png';
    if (id <= 800) return 'icons8-weather-96.png';
    return 'icons8-clouds-96.png';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }
    console.log(weatherData);

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData;

    const dateTaken = new Date();
    const dateOption = {
        day: '2-digit',
        month: 'short',


    };

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    countryText.textContent = country;
    temperatureText.textContent = Math.round(temp) + '°C';
    conditionText.textContent = main;
    humidityValueText.textContent = humidity + '%';
    windValueText.textContent = speed + 'km/h';

    currentDateText.textContent = getCurrentDate();
    console.log(getCurrentDate());
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastsInfo(city);

    showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = ''

    forecastsData.list.forEach((forecastWeather) => {
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastsItems(forecastWeather);
            console.log(forecastWeather);
        }
    });
    
}

function updateForecastsItems(weatherData) {
    const{
        dt_txt: date,
        weather: [{id}],
        main: { temp }

    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short',
    };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = ` 
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-text">${dateResult}</h5>
        <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
        <h5 class="forecast-item-temperature">${Math.round(temp)}°C</h5>    
    </div>           
`;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem );
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach((currentSection) => {
        currentSection.style.display = 'none';
    });

    section.style.display = 'flex';
}

