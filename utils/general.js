const date = (actualDate = Date()) => {
  const fullDateArr = actualDate.split(" ");

  let date = "";
  for (let i = 0; i < 5; i++) {
    date += fullDateArr[i];
    if (i < 4) date += " ";
  }
  return date;
};

module.exports = { date };
