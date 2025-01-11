async function getWeatherData(location) {
    // You should store your API key in a secure way in a production environment
    const apiKey = '88FUU7325848M4DGATLJ5B8YE';
    const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    
    try {
        const response = await fetch(
            `${baseUrl}/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}`,
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
    
    // Add temperature
    tempDiv.textContent = `${Math.round(weatherData.temperature)}°C`;
    
    // Add weather description and additional info
    descDiv.innerHTML = `
        <p>${weatherData.description}</p>
        <p>Feels like: ${Math.round(weatherData.feelsLike)}°C</p>
        <p>Humidity: ${weatherData.humidity}%</p>
        <p>Wind Speed: ${weatherData.windSpeed} km/h</p>
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
