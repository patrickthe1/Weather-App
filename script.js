// Add temperature unit state
let isCelsius = true;
const tempToggleBtn = document.getElementById('temp-toggle');

// Add loading spinner functions
function showLoading() {
    const spinner = document.getElementById('loading-spinner');
    const weatherContainer = document.getElementById('weather-container');
    spinner.classList.remove('hidden');
    weatherContainer.style.display = 'none';
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('hidden');
}

async function getWeatherData(location) {
    showLoading(); // Show loading spinner
    
    // You should store your API key in a secure way in a production environment
    const apiKey = '88FUU7325848M4DGATLJ5B8YE';
    const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    const units = isCelsius ? 'metric' : 'us';
    
    try {
        const response = await fetch(
            `${baseUrl}/${encodeURIComponent(location)}?unitGroup=${units}&key=${apiKey}`,
            {
                mode: 'cors'
            }
        );
        
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        
        const data = await response.json();
        const processedData = processWeatherData(data);
        return processedData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    } finally {
        hideLoading(); // Hide loading spinner regardless of success/failure
    }
}

function processWeatherData(data) {
    const currentConditions = data.currentConditions;
    
    return {
        temperature: currentConditions.temp,
        feelsLike: currentConditions.feelslike,
        humidity: currentConditions.humidity,
        windSpeed: currentConditions.windspeed,
        description: currentConditions.conditions,
        icon: currentConditions.icon,
        datetime: currentConditions.datetime
    };
}



// Select form and input elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function displayWeatherData(weatherData) {
    const weatherContainer = document.getElementById('weather-container');
    const iconDiv = document.getElementById('weather-icon');
    const tempDiv = document.getElementById('temperature');
    const descDiv = document.getElementById('description');
    
    // Clear previous content
    weatherContainer.style.display = 'block';
    iconDiv.innerHTML = '';
    tempDiv.innerHTML = '';
    descDiv.innerHTML = '';
    
    // Add weather icon
    const iconImg = document.createElement('img');
    iconImg.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Color/${weatherData.icon}.svg`;
    iconImg.alt = weatherData.description;
    iconDiv.appendChild(iconImg);
    
    // Add temperature with correct unit
    const unit = isCelsius ? '°C' : '°F';
    tempDiv.textContent = `${Math.round(weatherData.temperature)}${unit}`;
    
    // Add weather description and additional info
    descDiv.innerHTML = `
        <p>${weatherData.description}</p>
        <p>Feels like: ${Math.round(weatherData.feelsLike)}${unit}</p>
        <p>Humidity: ${weatherData.humidity}%</p>
        <p>Wind Speed: ${weatherData.windSpeed} ${isCelsius ? 'km/h' : 'mph'}</p>
    `;
}

// Add form submission handler
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from submitting normally
    
    const location = searchInput.value.trim();
    
    if (!location) {
        alert('Please enter a location');
        return;
    }
    
    try {
        const weatherData = await getWeatherData(location);
        displayWeatherData(weatherData);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching weather data. Please try again.');
    }
});

// Add temperature toggle event listener
tempToggleBtn.addEventListener('click', async () => {
    isCelsius = !isCelsius; // Toggle the unit
    
    // Update button text
    tempToggleBtn.textContent = isCelsius ? '°C / °F' : '°F / °C';
    
    // If weather is currently displayed, update it
    const location = searchInput.value.trim();
    if (location) {
        try {
            const weatherData = await getWeatherData(location);
            displayWeatherData(weatherData);
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating weather data. Please try again.');
        }
    }
});
