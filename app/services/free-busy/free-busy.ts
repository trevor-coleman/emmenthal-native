import {
  isBefore,
  isEqual,
  Interval,
  getHours,
  getDay,
  endOfDay,
  startOfDay,
  set,
  getMinutes,
  max,
  add,
  format,
  getTime,
  clamp, addDays, differenceInCalendarDays,
} from "date-fns"
import { calendar_v3 } from "googleapis"

export type DaysTuple = [boolean, boolean, boolean, boolean, boolean, boolean, boolean]

export interface ICalendarOptions {
  date: {
    customDate?: Date | number | null
    daysForward: number | null
    daysOfWeek: DaysTuple
  }
  time: {
    start: Date | number | null
    end: Date | number | null
    duration: Duration
  }
}

export type FreeBusyData = Record<string, { busy: { start: Date | number; end: Date | number }[] }>



export function findFreeTime(
  freeBusyData: FreeBusyData,
  { time: timeOptions, date: { customDate, daysForward, daysOfWeek } }: ICalendarOptions,
): Interval[] {

  const timeOfDayRange: Interval = {
    start: timeOptions?.start ?? set(new Date(0), { hours: 9, minutes: 0 }),
    end: timeOptions?.end ?? set(new Date(0), { hours: 17, minutes: 0 }),
  }

  const { duration } = timeOptions
  const queue: Interval[] = []

  Object.keys(freeBusyData).forEach((i) =>
    freeBusyData[i].busy.forEach((time) =>
      queue.push({ start: new Date(time.start!), end: new Date(time.end!) }),
    ),
  )

  queue.sort((a, b) => {
    if (isEqual(b.start, a.start)) {
      if (isEqual(a.end, b.end)) return 0
      return isBefore(a.end, b.end) ? -1 : 1
    }
    return isBefore(a.start, b.end) ? -1 : 1
  })

  let calendarEvent: Interval | undefined = queue.shift()
  if (!calendarEvent) return []



  const startDate = customDate ?? addDays(new Date(), 1)

  let periodOfInterest:Interval = {
    start: startDate,
    end: addDays(startDate, daysForward ?? 7)
  }

  let day = getDayRange(periodOfInterest, timeOfDayRange)

  let currentBusyPeriod: Interval = { start: day.start, end: day.start }

  const freeTimes: Interval[] = []

  /**
   * This is the core loop -- it iterates over the events in the calendar, and merges them into a single array of free times.
   */
  while (calendarEvent) {
    let { start, end } = calendarEvent


    let eventCrossesMidnight = getDay(start) !== getDay(end);

    if (eventCrossesMidnight) {
      //split into two events
      queue.unshift({ start: startOfDay(end), end })
      end = endOfDay(start)
    }

    // Handle events that start before or after the end of the day of the currentBusyPeriod.
    if (getDay(currentBusyPeriod.end) !== getDay(start)) {

      const skippedDays = differenceInCalendarDays(start, currentBusyPeriod.end) - 1;

      // next day in calendar is before the beginning of the window.
      // This happens when there are events in the queue before the start
      // of the time the user cares about. (Shouldn't happen if we clean
      // up our store properly)
      if(skippedDays < 0) {
        calendarEvent = queue.shift()
        continue;
      }

      // next event in calendar is more than one day away -- add a blank day and move ahead
      if(skippedDays > 0) {
        currentBusyPeriod.start = setTime(addDays(currentBusyPeriod.start, 1), timeOfDayRange.start);
          currentBusyPeriod.end = currentBusyPeriod.start;
          freeTimes.push({
            start: currentBusyPeriod.start,
            end: setTime(currentBusyPeriod.start,timeOfDayRange.end)
          });
        continue;
      }

      // otherwise just move to the next day, and check again.
      day = getDayRange(calendarEvent, timeOfDayRange)
      currentBusyPeriod.start = setTime(start, timeOfDayRange.start)
      currentBusyPeriod.end = currentBusyPeriod.start
    }

    // ignore events on unselected days of the week
    if (!daysOfWeek[getDay(start)]) {
      calendarEvent = queue.shift()
      continue
    }

    start = clamp(start, day)
    end = clamp(end, day)


    if (start <= max([currentBusyPeriod.end, add(currentBusyPeriod.start, duration)])) {
      if (end <= currentBusyPeriod.end) {
        calendarEvent = queue.shift()
        continue
      }
      currentBusyPeriod.end = end
      calendarEvent = queue.shift()
      continue
    }
    freeTimes.push({
      start: currentBusyPeriod.end,
      end: start,
    })

    currentBusyPeriod.end = end
    calendarEvent = queue.shift()
  }

  const paddedFreeTimes = addEmptyDaysAtEndIfNeeded(periodOfInterest, currentBusyPeriod, timeOfDayRange, daysOfWeek, freeTimes);


  return paddedFreeTimes;
}

/**
 * Take the freeTime array of intervals and render into copy-pasteable text.
 */
export function formatFreeTimeText(freeTime: Interval[]) {
  const lines: string[] = []

  let lastDay: Date | number | undefined

  freeTime.forEach(({ start, end }, index) => {
    if (getDay(start) !== lastDay) {
      lastDay = getDay(start)
      if (index > 0) {
        lines.push("")
      }
      lines.push(format(start, "EEE LLL do"))
    }
    lines.push(`• ${format(start, "h:mmaaaaa")} - ${format(end, "h:mmaaaaa")}`)
  })

  return lines.join("\n")
}

/**
 * If the last event in the FreeBusyData is earlier than the last day of the periodOfInterest,
 * then add whole empty days for the rest of the available time.
 */
function addEmptyDaysAtEndIfNeeded(
    periodOfInterest: Interval,
    current: Interval,
    timeOfDayRange: Interval,
    daysOfWeek: DaysTuple,
    freeTimes: Interval[]) {

  const daysLeft = differenceInCalendarDays(periodOfInterest.end, current.end) - 1;
  for (let i = daysLeft; i > 0; i--) {
    current.start = setTime(addDays(current.start, 1), timeOfDayRange.start);
    current.end = current.start;
    //only add windows on selected days
    if (daysOfWeek[getDay(current.start)]) {
      freeTimes.push({
        start: current.start,
        end: setTime(current.start, timeOfDayRange.end)
      });
    }

  }

  return freeTimes;
}

function setTime(timeA: Date | number, timeB: Date | number) {
  return set(timeA, {
    hours: getHours(new Date(timeB)),
    minutes: getMinutes(new Date(timeB)),
  })
}

function getDayRange(interval: Interval, range:Interval) {
  return {
    start: setTime(interval.start, range.start),
    end: setTime(interval.start, range.end),
  }
}