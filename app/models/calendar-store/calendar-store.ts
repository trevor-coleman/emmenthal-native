import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CalendarModel } from "../calendar/calendar"
import { api } from "../../services/api"
import type { FreeBusyItem } from "../free-busy-item/free-busy-item"
import { AxiosResponse } from "axios"
import { calendar_v3 } from "googleapis"
import { findFreeTime, formatFreeTimeText } from "../../services/free-busy/free-busy"
import { set, subDays } from "date-fns"

/**
 * Model description here for TypeScript hints.
 */
export const CalendarStoreModel = types
  .model("CalendarStore")
  .props({
    calendars: types.optional(types.map(CalendarModel), {}),
    selectedIds: types.optional(types.array(types.string), []),
    freeTimeText: types.optional(types.string, ""),
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
  }))
  .actions((self) => ({
    handleGetCalendarResponse(response): void {
      const calendars = response?.data?.items
      if (!calendars) return
      calendars.forEach((calendar) => {
        self.calendars.set(calendar.id, calendar)
      })
    },
    handleGetFreeBusyResponse(response: AxiosResponse<calendar_v3.Schema$FreeBusyResponse>): void {
      console.log("handling freeBusy Response", response)
      const {
        data: { calendars },
      } = response
      if (!calendars) return
      Object.entries(calendars).forEach(([id, { busy }]) => {
        const calendar = self.calendars.get(id)
        calendar.setBusy(busy)
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
          customDate: undefined,
          range: 3,
          days: [false, true, true, true, true, true, false],
        },
        time: {
          start: set(new Date(), { hours: 10, minutes: 0 }),
          end: set(new Date(), { hours: 20, minutes: 0 }),
          duration: { hours: 1, minutes: 0 },
        },
      })

      self.freeTimeText = formatFreeTimeText(freeTimes)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async getCalendars(): Promise<void> {
      const response = await api.getCalendars()
      self.handleGetCalendarResponse(response)
    },
    async getFreeBusy({ timeMin, timeMax }): Promise<void> {
      const response: AxiosResponse<calendar_v3.Schema$FreeBusyResponse> = await api.getFreeBusy({
        timeMin,
        timeMax,
        calendars: self.calendarIds,
      })
      self.handleGetFreeBusyResponse(response)
    },

    calendarList() {
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
    setCalendarSelected(target: string, selected: boolean) {
      self.selectedIds.replace(self.selectedIds.filter((id) => id !== target))
      if (selected) {
        self.selectedIds.push(target)
      }
      self.updateFreeTimeText()
    },
  }))

type CalendarStoreType = Instance<typeof CalendarStoreModel>

export interface CalendarStore extends CalendarStoreType {}

type CalendarStoreSnapshotType = SnapshotOut<typeof CalendarStoreModel>

export interface CalendarStoreSnapshot extends CalendarStoreSnapshotType {}

export const createCalendarStoreDefaultModel = () => types.optional(CalendarStoreModel, {})
