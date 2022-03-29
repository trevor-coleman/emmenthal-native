import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { FreeBusyItemModel } from "../free-busy-item/free-busy-item"
import { calendar_v3 } from "googleapis"

/**
 * Model description here for TypeScript hints.
 */
export const CalendarModel = types
  .model("Calendar")
  .props({
    id: types.identifier,
    colorId: types.maybe(types.string),
    foregroundColor: types.maybe(types.string),
    accessRole: types.maybe(types.string),
    backgroundColor: types.maybe(types.string),
    summary: types.maybe(types.string),
    summaryOverride: types.maybe(types.string),
    calendarName: types.maybe(types.string),
    busy: types.optional(types.array(FreeBusyItemModel), []),
    timeZone: types.maybe(types.string),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setBusy(busy: calendar_v3.Schema$TimePeriod[]) {
      self.busy.replace(
        busy.map(({ start, end }) => ({
          start: new Date(start),
          end: new Date(end),
        })),
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type CalendarType = Instance<typeof CalendarModel>
export interface Calendar extends CalendarType {}
type CalendarSnapshotType = SnapshotOut<typeof CalendarModel>
export interface CalendarSnapshot extends CalendarSnapshotType {}
export const createCalendarDefaultModel = () => types.optional(CalendarModel, {})
