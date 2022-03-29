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
  clamp,
} from "date-fns"
import { calendar_v3 } from "googleapis"

export type DaysTuple = [boolean, boolean, boolean, boolean, boolean, boolean, boolean]

export interface ICalendarOptions {
  date: {
    customDate?: Date | number | null
    range: number | null
    days: DaysTuple
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
  { time: timeOptions, date: { days: daysOfWeek } }: ICalendarOptions,
): Interval[] {
  const range: Interval = {
    start: timeOptions?.start ?? set(new Date(), { hours: 9, minutes: 0 }),
    end: timeOptions?.end ?? set(new Date(), { hours: 17, minutes: 0 }),
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

  let busy: Interval | undefined = queue.shift()
  if (!busy) return []

  function setTime(timeA: Date | number, timeB: Date | number) {
    return set(timeA, {
      hours: getHours(new Date(timeB)),
      minutes: getMinutes(new Date(timeB)),
    })
  }

  function getDayRange(interval: Interval) {
    return {
      start: setTime(interval.start, range.start),
      end: setTime(interval.start, range.end),
    }
  }

  let day = getDayRange(busy)

  let current: Interval = { start: day.start, end: day.start }

  const freeTimes: Interval[] = []

  while (busy) {
    let { start, end } = busy

    //If event crosses midnight split (at midnight) into two events
    if (getDay(start) !== getDay(end)) {
      queue.unshift({ start: startOfDay(end), end })
      end = endOfDay(start)
    }

    //If next event is on a different day, reset day
    if (getDay(current.end) !== getDay(start)) {
      day = getDayRange(busy)
      current.start = setTime(start, range.start)
      current.end = current.start
    }

    if (!daysOfWeek[getDay(start)]) {
      busy = queue.shift()
      continue
    }

    start = clamp(start, day)
    end = clamp(end, day)

    if (start <= max([current.end, add(current.start, duration)])) {
      if (end <= current.end) {
        busy = queue.shift()
        continue
      }
      current.end = end
      busy = queue.shift()
      continue
    }
    freeTimes.push({
      start: current.end,
      end: start,
    })

    current.end = end
    busy = queue.shift()
  }

  return freeTimes
}

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
