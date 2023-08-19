import { STATUS_CODES } from "http";
import { config } from "../config";

const apiKey = config.weather.api_key;
const secondsInHour = 60 * 60;
const hoursOfHistoryWeatherData = 2;
const nowDate = Math.floor(Date.now() / 1000)
const weatherExtremeCondition = ["light snow", "snow", "heavy snow", "sleet", "light shower sleet", "shower sleet", "light rain and snow", "rain and snow", "light shower snow", "shower snow", "heavy shower snow", "heavy intensity shower rain", "shower rain", "light intensity shower rain", "freezing rain", "extreme rain", "very heavy rain", "heavy intensity rain", "heavy shower rain and drizzle", "tornado", "volcanic ash", "sand"]
const fs = require('fs');
const path = require('path');
const citiesFilePath = path.join(__dirname, '..', 'utils', '\cities_list.json');
const countriesFilePath = path.join(__dirname, '..', 'utils', '\countries_list.json');

async function readCitiesFromFile(country) {
  const jsonFileData = fs.readFileSync(citiesFilePath, 'utf-8');
  const citiesList = JSON.parse(jsonFileData);
  const filteredCities = citiesList.filter(city => city.country === country);
  const cities = filteredCities.map(city => city.city);
  return cities;
}

async function readCountriesFromFile() {
  const jsonFileData = fs.readFileSync(countriesFilePath, 'utf-8');
  const countriesList = JSON.parse(jsonFileData);
  return countriesList;
}

async function GetItWillRainByHour(city, countryCode, hoursForecast) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}`;

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

async function GetCurrentTemperature(city, countryCode) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&units=metric`;
  return await fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.main.temp;
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

async function GetAirHumidity(city, countryCode) {
  await calculateEvaporationForLocation(city, countryCode);
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&units=metric`;
  return await fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.main.humidity;
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

async function GetWeatherAlert(city, countryCode) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    console.log(response.status);
    if (response.status != 200)
      return {
        extreme: false,
        msg: response.status
      };
    const data = await response.json();
    for (let i = 0; i < 8; i++) {
      let weatherCondition = data.list[i].weather[0].description;
      let weatherTempMax = data.list[i].main.temp_max;
      let weatherTempMin = data.list[i].main.temp_max;
      if (weatherTempMin < 10 || weatherTempMax > 30 || weatherExtremeCondition.includes(weatherCondition)) {
        if (weatherTempMax > 30) {
          weatherCondition = "Heat Wave"
        }
        if (weatherTempMin < 30) {
          weatherCondition = "Freeze Wave"
        }
        return {
          extreme: true,
          msg: `Extreme weather condition ${weatherCondition} is expected at ${data.list[i].dt_txt} with a temperature of ${data.list[i].main.temp}°C.`
        };
      }
    }
    return {
      extreme: false,
      msg: 'No extreme weather conditions for farmers in the next 24 hours.'
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function convertCityCountryToLatLong(city, countryCode) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.city.coord;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

async function getWeatherData(lat, lon, weatherDate) {
  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${weatherDate}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

async function calculateEvaporationForLocation(city, country) {
  let evpParams = {
    temp: 0,
    humidity: 0,
    clouds: 0,
    wind: 0,
  }
  try {
    for (let i = 0; i < hoursOfHistoryWeatherData; i++) {
      const weatherData = await getWeatherData(city, country, nowDate - (i * 3600));
      if (weatherData == null)
        return null;
      evpParams.temp += parseFloat(weatherData.data[0].temp);
      evpParams.humidity += parseFloat(weatherData.data[0].humidity);
      evpParams.clouds += parseFloat(weatherData.data[0].clouds);
      evpParams.wind += parseFloat(weatherData.data[0].wind_speed);
    }
    evpParams.temp /= hoursOfHistoryWeatherData;
    evpParams.humidity /= hoursOfHistoryWeatherData;
    evpParams.clouds /= hoursOfHistoryWeatherData;
    evpParams.wind /= hoursOfHistoryWeatherData;

    return evpParams;

  } catch (error) {
    console.error('Error calculating evaporation:', error);
  }
}
async function calculateEvaporationByData(windSpeed, temperature, cloudiness, humidity) {
  const saturationVaporPressure = 6.11 * Math.pow(10, (7.5 * temperature) / (237.3 + temperature));
  const actualVaporPressure = saturationVaporPressure * Math.exp(-(6737.6 - 237.3 * temperature) / (237.3 * temperature));
  const windSpeedFactor = 1 + 0.005 * windSpeed;
  const evaporation = actualVaporPressure * windSpeedFactor * (1 - cloudiness / 100);
  console.log("Evaporation: " + evaporation + " mm/day");
  return evaporation;
}

export default { convertCityCountryToLatLong, calculateEvaporationForLocation, GetWeatherAlert, GetItWillRainByHour, GetCurrentTemperature, readCitiesFromFile, readCountriesFromFile, GetAirHumidity };