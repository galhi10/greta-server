import { config } from "../config";

const apiKey = config.weather.api_key;
const secondsInHour = 60 * 60;

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

export default { GetItWillRainByHour, GetCurrentTemperature, readCitiesFromFile, readCountriesFromFile, GetAirHumidity };