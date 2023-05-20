const apiKey = 'aa7dcd9030de206f0d1b34f933653c57';
const secondsInHour = 60 * 60;

async function GetItWillRainByHour(city, hoursForecast) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${'Israel'}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const currentTime = Math.floor(Date.now() / 1000);
    const twelveHoursFromNow = currentTime + hoursForecast * secondsInHour;
    const willRain = data.list.some(item => {
      return item.weather.some(weather => weather.main === 'Rain') && item.dt <= twelveHoursFromNow;
    });
    return willRain;
  } catch (error) {
    console.log('Error fetching weather data:', error);
    return false;
  }
}

async function GetCurrentTemperature(city) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},IL&appid=${apiKey}&units=metric`;
  return await fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.main.temp;
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

export default { GetItWillRainByHour, GetCurrentTemperature };