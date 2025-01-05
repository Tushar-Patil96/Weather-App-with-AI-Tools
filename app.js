document.getElementById('searchBtn').addEventListener('click', getWeather);

async function getWeather() {
  const city = document.getElementById('city').value;
  const weatherContainer = document.getElementById('weather-container');
  const error = document.getElementById('error');

  if (city === '') {
    error.textContent = 'Please enter a city name';
    error.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
    return;
  }

  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name } = geocodeData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const { temperature, windspeed, weathercode } = weatherData.current_weather;

    document.getElementById('cityName').textContent = name;
    document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${windspeed} km/h`;

    const gifUrl = getWeatherGif(weathercode);
    document.getElementById('weatherGif').src = gifUrl;

    error.classList.add('hidden');
    weatherContainer.classList.remove('hidden');
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
  }
}

function getWeatherGif(weatherCode) {
  const weatherGifMap = {
    0: 'clear_sky.gif',       // Clear sky
    1: 'partly cloud.gif',   // Partly cloudy
    2: 'cloudy.gif',          // Cloudy
    3: 'overcast.gif',        // Overcast
    45: 'fog1.gif',            // Fog
    48: 'fog.gif',            // Fog
    51: 'drizzle.gif',        // Drizzle
    61: 'rain.gif',           // Rain
    71: 'snow.gif',           // Snow
    95: 'thunderstorm.gif',   // Thunderstorm
  };

  return `gifs/${weatherGifMap[weatherCode] || 'default.gif'}`;
}
