import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CalendarModel } from "../calendar/calendar"
import { DaysTuple, findFreeTime, formatFreeTimeText } from "../../services/free-busy/free-busy"
import { addDays, set } from "date-fns"
import { TimeRangeModel } from "../time-range/time-range"
import { GetFreeBusyResult } from "../../services/api"
import { withEnvironment } from "../extensions/with-environment"
import { withRootStore } from "../extensions/with-root-store"

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
  })
  .extend(withEnvironment)
  .extend(withRootStore)
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
  }))
  .actions((self) => ({
    clear() {
      console.log("clearing CalendarStore")
      self.calendars.clear()
      self.selectedIds.replace([])
      self.startDate = addDays(new Date(), 1)
      self.daysForward = 7
    },
    handleGetCalendarResponse(response): void {
      const { calendars } = response
      self.calendars.clear()
      calendars.forEach((calendar) => {
        self.calendars.set(calendar.id, calendar)
      })
    },
    updateFreeTimeText() {
      const selectedCalendars = {}

      if (self.rootStore.authStore.validationState === "invalid") {
        self.freeTimeText = "Sign in to see your free time"
        return
      }

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
        time: self.rootStore.timeRange.timeRangeInfo,
      })
      self.freeTimeText = formatFreeTimeText(freeTimes)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async handleGetFreeBusyResponse(response: GetFreeBusyResult) {
      if (response.kind !== "ok") return
      const { calendars } = response.data

      if (!calendars) return
      Object.entries(calendars).forEach(([id, { busy }]) => {
        let calendar = self.calendars.get(id)
        if (!calendar) {
          self.calendars[id] = CalendarModel.create({
            id,
          })
          calendar = self.calendars.get(id)
        }
        calendar.setBusy(busy)
      })
      self.updateFreeTimeText()
    },
  }))
  .actions((self) => ({
    async getCalendars(): Promise<void> {
      if (self.rootStore.authStore.validationState === "init") {
        await self.rootStore.authStore.validateToken()
      }
      if (self.rootStore.authStore.validationState === "invalid") {
        self.clear()
        return
      }
      const response = await self.environment.api.getCalendars()
      self.handleGetCalendarResponse(response)
    },
    async getFreeBusy(): Promise<void> {
      const response: GetFreeBusyResult = await self.environment.api.getFreeBusy({
        timeMin: self.startDate,
        timeMax: addDays(self.startDate, self.daysForward),
        calendars: self.selectedIds.map((id) => ({ id })),
      })
      self.handleGetFreeBusyResponse(response)
    },
  }))
  .actions((self) => ({
    setDaysForward(daysForward: number) {
      self.daysForward = daysForward
      if (self.environment.api.authorized) {
        self.getFreeBusy()
      }
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
