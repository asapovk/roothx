import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import cn from 'classnames';
import {
  toNumber,
  dateToNumber,
  numberToDate,
  getDisplayed,
  getRenderingDates,
} from './helpers';
import {
  ANIMATE_DURATION,
  WIDTH_CALENDAR,
  HEIGHT_DAY,
  HEIGHT_YEAR,
  YEARS_SPACE,
  MIN_YEAR,
  MAX_YEAR,
  RU_MONTHS,
  RU_DAYS_OF_WEEK,
  SMALL_HEIGHT_DAY,
} from './constants';
//import IconPrev from './img/iconEdit.svg';
//import IconEdit from '/img/iconEdit.svg';
import './styles.less';
import { Edit } from '../Svg/Edit';
import { Arrow } from '../Svg/Arrow';
//import { IProps } from './typings';
export interface IProps {
  /**
   * Дополнительный CSS-класс
   */
  className?: string;
  /**
   * Дополнительные CSS-стили
   */
  style?: React.CSSProperties;
  /**
   * Количество месяцев отображаемых в одном календаре
   */
  severalMonths?: number;
  /**
   * Начальное значение выранного периода или даты
   */
  value?: Date[] | Date;
  /**
   * Дата, месяц который отобразится при ините
   */
  initDate?: Date;
  /**
   * Сегодняшняя дата для подсветки.
   * Приминяется вместо initDate, если она не указана
   */
  today?: Date;
  /**
   * Возможность выбора даты
   */
  isSelectable?: boolean;
  /**
   * Отображать дни за пределами месяца
   */
  isAbroadDaysHidden?: boolean;
  /**
   * Выделять крайние дни периода
   */
  isEdgeDaysActive?: boolean;
  /**
   * Выбор ширины виджета
   */
  isSmallWidth?: boolean;
  /**
   * Выбора периода
   */
  isRange?: boolean;
  /**
   * Минимальная дата для выбора
   */
  minDate?: Date;
  /**
   * Максимальная дата для выбора
   */
  maxDate?: Date;
  /**
   * Показывать год в заголовке
   */
  showYear?: boolean;
  /**
   * Показывать переключатель годов
   */
  showYearSwitch?: boolean;
  /**
   * Показывать переключатель месяцев
   */
  showSwitch?: boolean;
  /**
   * Переключение месяцев с анимацией
   */
  animatedSwitch?: boolean;
  /**
   * Минимальный год для переключения
   */
  minYearSwitch?: number;
  /**
   * Максимальный год для переключения
   */
  maxYearSwitch?: number;
  /**
   * Подсвечивать выходные
   */
  highlightWeekend?: boolean;
  /**
   * Коллбэк изменения значения выбранного периода или даты
   */
  onChange?: (value: Date[] | Date) => void | Promise<void>;
}

const isInteger = (value: number) =>
  typeof value === 'number' && Math.floor(value) === value;

export const Calendar: React.FC<IProps> = ({
  className,
  style,
  severalMonths: propSeveralMonths = 1,
  value,
  initDate: propInitDate,
  today: propToday,
  isSelectable,
  isAbroadDaysHidden,
  isEdgeDaysActive,
  isRange,
  minDate: propMinDate,
  maxDate: propMaxDate,
  showYear = true,
  showYearSwitch,
  showSwitch = true,
  animatedSwitch = true,
  minYearSwitch = MIN_YEAR,
  maxYearSwitch = MAX_YEAR,
  highlightWeekend,
  onChange,
  isSmallWidth,
}) => {
  // Значение календаря
  const [numberFrom, numberTo] = useMemo(
    () => [].concat(value).map(dateToNumber),
    [value]
  );

  // Дата инита
  const initDate = useMemo(
    () =>
      dateToNumber(propInitDate) ||
      dateToNumber(propToday) ||
      dateToNumber(new Date()),
    [propInitDate, propToday]
  );

  // Сегодняшняя дата
  const today = useMemo(() => dateToNumber(propToday), [propToday]);

  // Минимальная дата
  const minDate = useMemo(() => dateToNumber(propMinDate), [propMinDate]);

  // Максимальная дата
  const maxDate = useMemo(
    () => dateToNumber(propMaxDate) || 1e8,
    [propMaxDate]
  );

  // Количество отображаемых календарей
  const severalMonths = useMemo(
    () => (propSeveralMonths > 0 ? propSeveralMonths : 1),
    [propSeveralMonths]
  );

  // Родительский класс
  const rootClassName = useMemo(
    () =>
      cn(
        'root',
        className,

        showSwitch && 'isSwitchable',
        showSwitch && severalMonths > 1 && 'isMultiple',
        isSmallWidth && 'isSmallWidth'
      ),
    [className, isSmallWidth, showSwitch, severalMonths]
  );

  // Родительские стили
  const rootStyle = useMemo(() => {
    const compilatedStyle = {
      ...style,
    };

    if (severalMonths > 1) {
      compilatedStyle.width = WIDTH_CALENDAR * severalMonths;
    }

    return compilatedStyle;
    // eslint-disable-next-line
    }, [style, showSwitch, severalMonths]);

  // Отображаемый(-е) месяцы в календаре
  const [displayData, setDisplayData] = useState(
    getDisplayed(initDate, severalMonths)
  );

  // Настройки и видимые числа в календаре
  const [calculatedOptions, calculatedDates] = getRenderingDates(
    showSwitch,
    displayData
  );
  const [options, setOptions] = useState(calculatedOptions);
  const [dates, setDates] = useState(calculatedDates);

  // Нода переключалки годов
  const yearSwitchElement = useRef<HTMLDivElement>();

  // Флаг на время анимации
  const [animated, setAnimated] = useState(false);

  // Флаг переключателя годов
  const [isYearSwitch, setYearSwitch] = useState(false);

  // Выбор даты/периода
  const setNewDates = useCallback(
    (nextNumberFrom, nextNumberTo = null) => {
      const dateFrom = nextNumberFrom && numberToDate(nextNumberFrom);
      const dateTo = nextNumberTo && numberToDate(nextNumberTo);
      const nextValue = isRange ? [dateFrom, dateTo || dateFrom] : dateFrom;

      if (typeof onChange === 'function') {
        onChange(nextValue);
      }
    },
    [isRange, onChange]
  );

  // Был нажат prev или next
  const pressedSwitch = useRef(false);

  // Переключатель на предыдущий месяц
  const onPrev = useCallback(() => {
    if (animated) {
      return;
    }

    pressedSwitch.current = true;

    const nextDisplayData = options.map(({ displayMonth, displayYear }) => {
      const prevMonth = displayMonth - 1;

      if (prevMonth < 0) {
        return {
          displayMonth: 11,
          displayYear: displayYear - 1,
        };
      }

      return {
        displayMonth: prevMonth,
        displayYear,
      };
    });

    setDisplayData(nextDisplayData);
  }, [options, animated]);

  // Переключатель на следующий месяц
  const onNext = useCallback(() => {
    if (animated) {
      return;
    }

    pressedSwitch.current = true;

    const nextDisplayData = options.map(({ displayMonth, displayYear }) => {
      const nextMonth = displayMonth + 1;

      if (nextMonth > 11) {
        return {
          displayMonth: 0,
          displayYear: displayYear + 1,
        };
      }

      return {
        displayMonth: nextMonth,
        displayYear,
      };
    });

    setDisplayData(nextDisplayData);
  }, [options, animated]);

  // Переключатель на выбор года
  const onShowYear = useCallback(
    (displayYear) => {
      if (animated || !yearSwitchElement.current) {
        return;
      }

      setYearSwitch(true);

      const yearPosition = HEIGHT_YEAR * (displayYear - minYearSwitch);
      const yearOffset =
        yearSwitchElement.current.clientHeight / 2 - YEARS_SPACE;
      yearSwitchElement.current.scrollTop = yearPosition - yearOffset;
    },
    [minYearSwitch, animated]
  );

  // Выбор года
  const onSetYear = useCallback(
    (year) => {
      if (animated) {
        return;
      }

      pressedSwitch.current = false;

      const nextDisplayData = options.map(({ displayMonth }) => ({
        displayMonth,
        displayYear: year,
      }));

      setDisplayData(nextDisplayData);
    },
    [options, animated]
  );

  // Клик по дате
  const onClick = useCallback(
    (day) => {
      if (isRange && numberFrom && (!numberTo || numberFrom === numberTo)) {
        if (day < numberFrom) {
          setNewDates(day, numberFrom);
        } else {
          setNewDates(numberFrom, day);
        }
      } else {
        setNewDates(day);
      }
    },
    [numberFrom, numberTo, isRange, setNewDates]
  );

  useEffect(() => {
    setDisplayData(getDisplayed(initDate, severalMonths));
  }, [initDate, severalMonths]);

  useEffect(() => {
    const [calcOptions, calcDates] = getRenderingDates(showSwitch, displayData);
    const withAnimate = showSwitch && animatedSwitch && pressedSwitch.current;

    pressedSwitch.current = false;

    if (withAnimate) {
      setAnimated(true);
    }

    setOptions(calcOptions);

    if (withAnimate) {
      setTimeout(() => {
        setDates(calcDates);
        setAnimated(false);
      }, ANIMATE_DURATION);
    } else {
      setDates(calcDates);
    }

    setYearSwitch(false);
  }, [showSwitch, animatedSwitch, displayData]);

  /** Рендер календаря */
  const elements = options.map((option, i) => {
    const { displayMonth, displayYear, lastDate, firstDate } = option;

    const renderDates = dates[i];

    const weeksBeforeVisible = Math.floor(renderDates.indexOf(firstDate) / 7);
    const weeksAfterVisible = Math.ceil(
      (renderDates.indexOf(lastDate) + 1) / 7
    );
    const weeksVisible = weeksAfterVisible - weeksBeforeVisible;

    const disabledPrev =
      (isInteger(minYearSwitch) &&
        (displayYear < minYearSwitch ||
          (displayYear === minYearSwitch && displayMonth === 0))) ||
      minDate >= toNumber(displayYear, displayMonth, 1);

    const disabledNext =
      (isInteger(maxYearSwitch) &&
        (displayYear > maxYearSwitch ||
          (displayYear === maxYearSwitch && displayMonth === 11))) ||
      maxDate <= toNumber(displayYear, displayMonth, 31);

    const showPrevSwitch = i === 0;
    const showNextSwitch = i === options.length - 1;
    const showYearEditSwitch =
      showYearSwitch && severalMonths === 1 && !isSmallWidth;

    return (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        className={cn(
          'calendar',
          isSelectable && 'isSelectable',
          animated && 'isAnimated'
        )}
      >
        <div className={'headline'}>
          <div
            className={cn('monthLine', !showYearEditSwitch && 'monthLineFull')}
          >
            {showSwitch && (
              <button
                className={cn('prev', !showPrevSwitch && 'hidden')}
                type='button'
                disabled={disabledPrev}
                onClick={onPrev}
                aria-label='previous month'
              >
                <Arrow className={'prevIcon'} />
              </button>
            )}

            <div className={'month'}>
              {RU_MONTHS[displayMonth] + (showYear ? `, ${displayYear}` : '')}
            </div>

            {showSwitch && (
              <button
                className={cn('next', !showNextSwitch && 'hidden')}
                type='button'
                disabled={disabledNext}
                onClick={onNext}
                aria-label='next month'
              >
                <Arrow className={'nextIcon'} />
              </button>
            )}
          </div>

          {showYearEditSwitch && (
            <button
              className={'yearEdit'}
              type='button'
              onClick={() => onShowYear(displayYear)}
              aria-label='switch year'
            >
              {displayYear}
              <Edit className={'yearEditIcon'} />
            </button>
          )}
        </div>

        <div className={'week'}>
          {RU_DAYS_OF_WEEK.map((name, index) => (
            <div
              key={name}
              className={cn(
                'day',
                highlightWeekend && (index === 5 || index === 6) && 'isWeekend'
              )}
            >
              {name}
            </div>
          ))}
        </div>

        <div
          className={'dates'}
          style={{
            height: isSmallWidth
              ? (SMALL_HEIGHT_DAY + 5) * weeksVisible - 5
              : HEIGHT_DAY * weeksVisible,
          }}
        >
          <div
            className={'datesSheet'}
            style={{
              transform: `translateY(${
                -1 *
                (isSmallWidth ? SMALL_HEIGHT_DAY + 5 : HEIGHT_DAY) *
                weeksBeforeVisible
              }px)`,
            }}
          >
            {renderDates.map((number, index) => {
              // Запрещена к выбору
              const disabled = number < minDate || number > maxDate;

              // Выходит за период выбранного месяца
              const abroad = number < firstDate || number > lastDate;

              const classNameDateday = cn('date', {
                ['isActive']: isEdgeDaysActive
                  ? number === numberFrom || (isRange && number === numberTo)
                  : false,
                ['isSameActive']: !isEdgeDaysActive
                  ? number === numberFrom || (isRange && number === numberTo)
                  : false,
                ['isActiveLeft']:
                  isRange && number === numberFrom && numberTo !== numberFrom,
                ['isActiveRight']:
                  isRange && number === numberTo && numberTo !== numberFrom,
                ['isSelected']:
                  isRange && number > numberFrom && number < numberTo,
                ['isToday']: number === today,
                ['isWeekend']:
                  highlightWeekend &&
                  ((index + 1) % 7 === 6 || (index + 1) % 7 === 0),
                ['isUnavailable']: isAbroadDaysHidden ? disabled : abroad,
                ['isHidden']:
                  isAbroadDaysHidden || severalMonths > 1 ? abroad : false,
                ['isMonday']: (index + 1) % 7 === 1,
                ['isSunday']: (index + 1) % 7 === 0,
              });

              if (isSelectable && !disabled) {
                return (
                  <button
                    key={number}
                    className={classNameDateday}
                    type='button'
                    onClick={() => onClick(number)}
                  >
                    <span className={'dateNumber'}>{number % 100}</span>
                  </button>
                );
              }

              return (
                <span key={number} className={classNameDateday}>
                  <span className={'dateNumber'}>{number % 100}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  });

  const renderYearSwitch = () => {
    if (isSmallWidth || !showYearSwitch || severalMonths !== 1) {
      return null;
    }

    const minYear =
      propMinDate instanceof Date ? propMinDate.getFullYear() : minYearSwitch;
    const maxYear =
      propMaxDate instanceof Date ? propMaxDate.getFullYear() : maxYearSwitch;
    const currentYear = options[0].displayYear;

    const years = [...Array(MAX_YEAR - MIN_YEAR + 1)].map((_, i) => {
      const year = MIN_YEAR + i;

      return (
        <button
          className={cn(
            'yearRow',
            currentYear === year && 'current',
            (year < minYear || year > maxYear) && 'disabled'
          )}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          type='button'
          onClick={() => onSetYear(year)}
        >
          {year}
        </button>
      );
    });

    return (
      <div
        className={cn(
          'yearSwitch',
          animated && 'isAnimated',
          isYearSwitch && 'yearSwitchVisible'
        )}
        ref={yearSwitchElement}
      >
        <div className={'years'}>{years}</div>
      </div>
    );
  };

  return (
    <div className={rootClassName} style={rootStyle}>
      {elements}
      {renderYearSwitch()}
    </div>
  );
};
