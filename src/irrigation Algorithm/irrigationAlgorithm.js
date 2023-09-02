const MIN_HUMIDITY_PERCENTAGE = 25;
const MAX_HUMIDITY_PERCENTAGE = 30;
const AVG_HUMIDITY_PERCENTAGE =
  (MAX_HUMIDITY_PERCENTAGE + MIN_HUMIDITY_PERCENTAGE) / 2;
const CRITIC_HUMIDITY_PERCENTAGE = 10;
const SIX_AM = 10;
const EIGHT_PM = 10;

function irrigationProcess(currentHumidity) {
  if (doNeedToIrrigate()) {
    return getTimeToIrrigate();
  }
  return 0;
}

function doNeedToIrrigate() {
  if (
    doesdHumidityLow(currentHumidity) &&
    !currentlyInHeatHours() &&
    !precipitationForcasted()
  ) {
    return true;
  }
  return false;
}

function doesdHumidityLow(currentHumidity) {
  return currentHumidity < CRITIC_HUMIDITY_PERCENTAGE;
}

function getTimeToIrrigate() {
  let sizeOfLoan = getSizeOfLoan();
  let totalLitersToIrrigate = sizeOfLoan * getLitersPerMeter();

  return (totalLitersToIrrigate / getLitersPerMinute()) * 60; // time in seconds
}

function currentlyInHeatHours() {
  const hour = new Date().getHours();
  return hour >= 8 && hour <= 20;
}

function afterIrrigationHandler(
  humidityAfterTwentyMinutes,
  humidityBeforeIrrigation
) {
  if (
    humidityAfterTwentyMinutes >= MIN_HUMIDITY_PERCENTAGE &&
    humidityAfterTwentyMinutes <= MAX_HUMIDITY_PERCENTAGE
  ) {
    // to document to database the amount That was Irrigated - it was good (in liters per minute)
    //
    return;
  } else {
    const exception =
      (humidityAfterTwentyMinutes - humidityBeforeIrrigation) /
      (AVG_HUMIDITY_PERCENTAGE - humidityBeforeIrrigation);
    // document to DB: (1 / exeption )*amountThatIrrigated;
    return;
  }
}

// function convertLitersToDuration(amountOfLiters, litersPerMinute) {
//   // check if object is fine
//   return Math.floor(amountOfLiters / litersPerMinute);
// }

// function convertDurationToLiters(amountOfMinutes) {
//   // check if object is fine
//   return amountOfMinutes * LITERS_PER_MINUTE;
// }
