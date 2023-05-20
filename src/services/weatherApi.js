const apiKey = 'aa7dcd9030de206f0d1b34f933653c57';

async function fetchWeatherForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${'Israel'}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Filter forecast data for next rainfall
    const currentTime = Math.floor(Date.now() / 1000);
    const twelveHoursFromNow = currentTime + 12 * 60 * 60;
    const willRain = data.list.some(item => {
      return item.weather.some(weather => weather.main === 'Rain') && item.dt <= twelveHoursFromNow;
    });
    return willRain;
  } catch (error) {
    console.log('Error fetching weather data:', error);
    return null;
  }
}

// Example usage
const city = 'Acre';
fetchWeatherForecast(city)
  .then(forecast => {
    console.log('Rainfall forecast:', forecast);
  })
  .catch(error => {
    console.log('Error:', error);
  });
