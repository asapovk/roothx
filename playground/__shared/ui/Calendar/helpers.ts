type DisplayedType = {
  displayMonth: number;
  displayYear: number;
};

type DatesType = {
  options: {
    displayMonth: number;
    displayYear: number;
    firstDate: number;
    lastDate: number;
  };
  dates: number[];
};

/**
 * Объединение числовых значений даты в одно
 */
export const toNumber = (year: number, month: number, date: number): number =>
  year * 1e4 + month * 100 + date;

/**
 * Перевод даты в число
 */
export const dateToNumber = (d: Date): number =>
  d instanceof Date ? toNumber(d.getFullYear(), d.getMonth(), d.getDate()) : 0;

/**
 * Перевод числа в дату
 */
export const numberToDate = (n: number): Date =>
  new Date(Math.floor(n / 1e4), Math.floor((n % 1e4) / 100), n % 100);

/**
 * Массив отображаемых года и месяца для всех календарей
 */
export const getDisplayed = (
  numberDate: number,
  severalMonths: number
): DisplayedType[] => {
  const displayData = [];

  const displayMonth = Math.floor((numberDate % 1e4) / 100);
  const displayYear = Math.floor(numberDate / 1e4);

  for (let i = severalMonths - 1; i >= 0; i--) {
    let month = displayMonth - i;
    let year = displayYear;

    if (month < 0) {
      year -= Math.ceil(Math.abs(month / 12));
      month = (12 + (month % 12)) % 12;
    }

    displayData.push({
      displayMonth: month,
      displayYear: year,
    });
  }

  return displayData;
};

/**
 * Значение года, месяца, его первого и последнего числа
 * И все необходимые числа для рендера
 */
const getDates = (months: number[], displayData: DisplayedType): DatesType => {
  const { displayYear, displayMonth } = displayData;
  const dates = [];
  let firstDate;
  let lastDate;

  months.forEach((calculatedMonth, index) => {
    let month = calculatedMonth;
    let year = displayYear;

    if (calculatedMonth < 0) {
      month = calculatedMonth + 12;
      year -= 1;
    } else if (calculatedMonth > 11) {
      month = calculatedMonth - 12;
      year += 1;
    }

    let dateFrom = 1;
    let dateTo = new Date(year, month + 1, 0).getDate();

    if (index === 0) {
      dateFrom = dateTo - (new Date(year, month + 1, 1).getDay() || 7) + 2;
    } else if (index === months.length - 1) {
      dateTo = 8 - (new Date(year, month, 1).getDay() || 7) + 7;
    }

    if (month === displayMonth) {
      firstDate = toNumber(year, month, 1);
      lastDate = toNumber(year, month, dateTo);
    }

    for (let i = dateFrom; i <= dateTo; i++) {
      dates.push(toNumber(year, month, i));
    }
  });

  return {
    options: {
      displayMonth,
      displayYear,
      firstDate,
      lastDate,
    },
    dates,
  };
};

/**
 * Данные, необходимые для рендера выбранных календарей
 */
export const getRenderingDates = (
  showMonthSwitch: boolean,
  displayData: DisplayedType[]
): [DatesType['options'][], DatesType['dates'][]] => {
  const options = [];
  const dates = [];

  for (let i = 0; i < displayData.length; i++) {
    const { displayMonth } = displayData[i];

    const months = showMonthSwitch
      ? [
          displayMonth - 2,
          displayMonth - 1,
          displayMonth,
          displayMonth + 1,
          displayMonth + 2,
        ]
      : [displayMonth - 1, displayMonth, displayMonth + 1];

    const monthDates = getDates(months, displayData[i]);

    options.push(monthDates.options);
    dates.push(monthDates.dates);
  }

  return [options, dates];
};
