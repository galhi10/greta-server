import { STATUS_CODES } from "http";
import { config } from "../config";

const apiKey = config.weather.api_key;
const secondsInHour = 60 * 60;
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


export default { GetWeatherAlert, GetItWillRainByHour, GetCurrentTemperature, readCitiesFromFile, readCountriesFromFile, GetAirHumidity };