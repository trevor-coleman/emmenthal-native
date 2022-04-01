import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CalendarModel } from "../calendar/calendar"
import { api, GetFreeBusyResponse, GetFreeBusySuccess } from "../../services/api"
import { DaysTuple, findFreeTime, formatFreeTimeText } from "../../services/free-busy/free-busy"
import { addDays, set } from "date-fns"
import { TimeRangeModel } from "../time-range/time-range"

/**
 * Model description here for TypeScript hints.
 */
export const CalendarStoreModel = types
  .model("CalendarStore")
  .props({
    calendars: types.optional(types.map(CalendarModel), {}),
    selectedIds: types.optional(types.array(types.string), []),
    freeTimeText: types.optional(types.string, ""),
    startDate: types.optional(types.Date, addDays(new Date(), 1)),
    daysForward: types.optional(types.number, 7),
    daysOfTheWeek: types.optional(types.array(types.boolean), [
      false,
      true,
      true,
      true,
      true,
      true,
      false,
    ]),
    timeRange: types.optional(TimeRangeModel, {
      startHour: 10,
      startMinute: 30,
      endHour: 18,
      endMinute: 30,
      startMeridiem: "AM",
      endMeridiem: "PM",
    }),
  })

  .views((self) => ({
    get calendarNames(): string[] {
      const result = []
      self.calendars.forEach((item) => result.push(item.summaryOverride ?? item.summary))
      return result
    },
    get calendarIds(): { id: string }[] {
      const result = []
      self.calendars.forEach(({ id }) => result.push({ id }))
      return result
    },
    get calendarList() {
      const result = []
      self.calendars.forEach((calendar) => {
        result.push({
          id: calendar.id,
          label: calendar?.summaryOverride ?? calendar?.summary,
        })
      })
      return result
    },
    get timeRangeInfo(): { start: Date; end: Date; duration: Duration } {
      const {
        startHour,
        startMinute,
        endHour,
        endMinute,
        startMeridiem,
        endMeridiem,
      } = self.timeRange

      console.log({ endHour, endMeridiem, endMinute })

      const start = {
        hours: startMeridiem === "AM" ? startHour : startHour + 12,
        minutes: startMinute,
      }

      const end = {
        hours: endMeridiem === "AM" ? endHour : endHour + 12,
        minutes: endMinute,
      }

      console.log({ start, end })

      return {
        start: set(new Date(0), start),
        end: set(new Date(0), end),
        duration: { hours: 1, minutes: 0 },
      }
    },
  }))
  .actions((self) => ({
    handleGetCalendarResponse(response): void {
      const calendars = response?.data?.items
      if (!calendars) return
      calendars.forEach((calendar) => {
        self.calendars.set(calendar.id, calendar)
      })
    },
    updateFreeTimeText() {
      const selectedCalendars = {}

      if (self.selectedIds.length === 0) {
        self.freeTimeText = "Select a Calendar"
        return
      }

      self.calendars.forEach((calendar) => {
        if (!self.selectedIds.includes(calendar.id)) return
        selectedCalendars[calendar.id] = calendar
      })

      const freeTimes = findFreeTime(selectedCalendars, {
        date: {
          customDate: self.startDate,
          daysForward: self.daysForward,
          daysOfWeek: (self.daysOfTheWeek as unknown) as DaysTuple,
        },
        time: self.timeRangeInfo,
      })

      console.log({ freeTimes })

      self.freeTimeText = formatFreeTimeText(freeTimes)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async handleGetFreeBusyResponse(response: GetFreeBusySuccess) {
      const { calendars } = response.data

      if (!calendars) return
      Object.entries(calendars).forEach(([id, { busy }]) => {
        const calendar = self.calendars.get(id)
        calendar.setBusy(busy)
      })
      self.updateFreeTimeText()
    },
  }))
  .actions((self) => ({
    async getCalendars(): Promise<void> {
      const response = await api.getCalendars()
      console.log(response)
      self.handleGetCalendarResponse(response)
    },
    async getFreeBusy(): Promise<void> {
      const response: GetFreeBusyResponse = await api.getFreeBusy({
        timeMin: self.startDate,
        timeMax: addDays(self.startDate, self.daysForward),
        calendars: self.calendarIds,
      })
      if (response.result === "success") {
        self.handleGetFreeBusyResponse(response)
      }
    },
    signOut() {
      console.log("signOut")
      self.calendars.clear()
      self.selectedIds.replace([])
      self.freeTimeText = ""
    },
  }))
  .actions((self) => ({
    setDaysForward(daysForward: number) {
      self.daysForward = daysForward
      self.getFreeBusy()
    },
    setCalendarSelected(target: string, selected: boolean) {
      self.selectedIds.replace(self.selectedIds.filter((id) => id !== target))
      if (selected) {
        self.selectedIds.push(target)
      }
      self.getFreeBusy()
    },
    setDay(index, checked) {
      self.daysOfTheWeek[index] = checked
      self.updateFreeTimeText()
    },
    setAllDays(newDays) {
      self.daysOfTheWeek.replace(newDays)
      self.updateFreeTimeText()
    },
  }))

type CalendarStoreType = Instance<typeof CalendarStoreModel>

export interface CalendarStore extends CalendarStoreType {}

type CalendarStoreSnapshotType = SnapshotOut<typeof CalendarStoreModel>

export interface CalendarStoreSnapshot extends CalendarStoreSnapshotType {}

export const createCalendarStoreDefaultModel = () => types.optional(CalendarStoreModel, {})
