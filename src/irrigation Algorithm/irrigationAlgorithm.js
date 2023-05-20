const MIN_HUMIDITY_PERCENTAGE = 25;
const MAX_HUMIDITY_PERCENTAGE = 30;
const AVG_HUMIDITY_PERCENTAGE =
  (MAX_HUMIDITY_PERCENTAGE + MIN_HUMIDITY_PERCENTAGE) / 2;
const CRITIC_HUMIDITY_PERCENTAGE = 10;
const SIX_AM = 10;
const EIGHT_PM = 10;

const TWENTY_MINUTES = 1000 * 60 * 20;
// let REMINDER_POPED_UP = false;
// let ABORTED_DUE_TO_PERCIPITAION = 0;

function hourlyCheckForHumidityAndWeather() {
  const humidityPercentage = checkForHumiditySensor();
  if (humidityPercentage < CRITIC_HUMIDITY_PERCENTAGE) {
    const hourNow = new Date().getHours();
    const isPercipitation = checkForPercipitaion(DBMyLocation()); // 50% for percipitation in next 12 hours
    if (!isPercipitation /*|| ABORTED_DUE_TO_PERCIPITAION > 2*/) {
      if (!(hourNow > SIX_AM && hourNow < EIGHT_PM)) {
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
  // considering hour is good, humidity low, no predicted percipitation
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
    checkSensorAfterIrrigation(
      firstInterval,
      humidityPercentageBefore,
      neededLitersPerMeter
    );
  }, TWENTY_MINUTES + irrigatingDuration); // verify it works plus irrigation time

  // REMINDER_POPED_UP;
}

function checkSensorAfterIrrigation(
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
  } else {
    const exception =
      (humidityPercentageAfter - humidityPercentageBefore) /
      (AVG_HUMIDITY_PERCENTAGE - humidityPercentageBefore);
    // document to DB: (1 / exeption )*neededLitersPerMeter;
    return;
  }
}

function convertLitersToDuration(amountOfLiters, litersPerMinute) {
  // check if object is fine
  return Math.floor(amountOfLiters / litersPerMinute);
}

function convertDurationToLiters(amountOfMinutes) {
  // check if object is fine
  return amountOfMinutes * LITERS_PER_MINUTE;
}
