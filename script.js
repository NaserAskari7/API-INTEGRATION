// --- IMPORTANT ---
// 1. Sign up for a free API key at OpenWeatherMap.
// 2. Replace 'YOUR_API_KEY' with your actual key.
const API_KEY = '1d28ffd9437bfcffaf780092c68df5bc'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Element Selectors
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const weatherDataContainer = document.getElementById('weather-data');
const errorMsg = document.getElementById('error-msg');

// Data Display Elements
const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity-val');
const windSpeedElement = document.getElementById('wind-speed-val');
const weatherIconElement = document.getElementById('weather-icon');


/**
 * Hides the data container and error message.
 */
function resetDisplay() {
    weatherDataContainer.style.display = 'none';
    errorMsg.style.display = 'none';
}


/**
 * Fetches weather data from OpenWeatherMap API.
 * @param {string} city - The name of the city to search.
 */
async function getWeatherData(city) {
    resetDisplay();

    // Construct the full API URL
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`; // units=metric for Celsius

    try {
        const response = await fetch(url);
        
        // Check for HTTP errors (e.g., 404 for city not found)
        if (!response.ok) {
            // Throw an error with the status for specific handling
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayWeatherData(data);

    } catch (error) {
        console.error('Fetch error:', error);
        // Display user-friendly error message
        errorMsg.style.display = 'block';
    }
}

/**
 * Parses the API response and updates the DOM elements.
 * @param {object} data - The JSON weather data object.
 */
function displayWeatherData(data) {
    // Round temperature and set content
    const tempCelsius = Math.round(data.main.temp);
    temperatureElement.textContent = `${tempCelsius}°C`;
    
    // Set other data fields
    cityNameElement.textContent = data.name;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed} m/s`;

    // Construct the URL for the weather icon
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.alt = data.weather[0].main;

    // Show the data container
    weatherDataContainer.style.display = 'block';
}


// Event listener for the search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Optional: Allow search by pressing Enter in the input field
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

// Load a default city on page load
window.onload = () => {
    getWeatherData('London'); 
};