const MIN_HUMIDITY_PERCENTAGE = 25;
const MAX_HUMIDITY_PERCENTAGE = 30;
const AVG_HUMIDITY_PERCENTAGE =
  (MAX_HUMIDITY_PERCENTAGE + MIN_HUMIDITY_PERCENTAGE) / 2;
const TWENTY_MINUTES = 1000 * 60 * 20; // to change
// let REMINDER_POPED_UP = false;
// let ABORTED_DUE_TO_PERCIPITAION = 0;

function hourlyCheckForHumidityAndWeather() {
  const humidityPercentage = checkForHumiditySensor();
  if (humidityPercentage < 10) {
    const hourNow = new Date().getHours();
    const isPercipitation = checkForPercipitaion(DBMyLocation()); // 50% for percipitation in next 12 hours
    if (!isPercipitation /*|| ABORTED_DUE_TO_PERCIPITAION > 2*/) {
      if (!(hourNow > 6 && hourNow < 20)) {
        // not between 06:00 to 20:00
        initIrrigationProcess();
      } else {
        return;
      }
    } else {
      return;
    }
  }
}

function initIrrigationProcess() {
  // considering hour is good and humidity is low, and no percipitation
  const loanSize = DBcheckForLoanSize();
  const litersPerMinute = DBcheckForLitersPerMinute();
  const humidityPercentageBefore = checkForHumiditySensor();
  let irrigatingDuration = 0;
  const neededLitersPerMeter = DBgetEstimatedLitersPerMeter(
    location,
    light,
    grass,
    soil,
    evaporationRate
  );
  irrigatingDuration = convertLitersToDuration(
    neededLitersPerMeter * loanSize,
    litersPerMinute
  );
  activateSprinklers(irrigatingDuration);

  var firstInterval = setInterval(function () {
    checkSensorAfterFirstIrrigation(
      firstInterval,
      humidityPercentageBefore,
      neededLitersPerMeter
    );
  }, TWENTY_MINUTES + irrigatingDuration); // verify it works plus irrigation time

  // REMINDER_POPED_UP = false;
  // ABORTED_DUE_TO_PERCIPITAION = 0;
}

function checkSensorAfterFirstIrrigation(
  firstInterval,
  humidityPercentageBefore,
  neededLitersPerMeter
) {
  clearInterval(firstInterval);
  const humidityPercentageAfter = checkForHumiditySensor();
  if (
    humidityPercentageAfter >= MIN_HUMIDITY_PERCENTAGE &&
    humidityPercentageAfter <= MAX_HUMIDITY_PERCENTAGE
  ) {
    // to document to database the liters per minute - it was good
    return;
  }
  if (
    humidityPercentageAfter < MIN_HUMIDITY_PERCENTAGE ||
    humidityPercentageAfter > MAX_HUMIDITY_PERCENTAGE
  ) {
    const exception =
      (AVG_HUMIDITY_PERCENTAGE - humidityPercentageBefore) /
      (humidityPercentageAfter - humidityPercentageBefore);
    // document to DB: neededLitersPerMeter * exception
    return;
  }
}

// function secondInterval(secondInterval, totalIrrigationLiters) {
//   clearInterval(secondInterval);
//   const humidityPercentageAfterSecondIrrigation = checkForHumiditySensor();
//   if (
//     humidityPercentageAfterSecondIrrigation >= MIN_HUMIDITY_PERCENTAGE &&
//     humidityPercentageAfterSecondIrrigation <= MAX_HUMIDITY_PERCENTAGE
//   ) {
//     //document to data base: totalIrrigationLiters / loan size --- thats the best liters per meter
//     return;
//   } else {
//     const toChange =
//       AVG_HUMIDITY_PERCENTAGE / humidityPercentageAfterSecondIrrigation;
//     //document to data base: (totalIrrigationLiters / loan size)*toAdd --- thats the best liters per meter
//   }
//   clearInterval(secondInterval);
// }

function convertLitersToDuration(amountOfLiters, litersPerMinute) {
  // check if object is fine
  return Math.floor(amountOfLiters / litersPerMinute);
}

function convertDurationToLiters(amountOfMinutes) {
  // check if object is fine
  return amountOfMinutes * LITERS_PER_MINUTE;
}
