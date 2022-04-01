import { Instance, SnapshotOut, types, hasParent, getParent } from "mobx-state-tree"
import { CalendarStore } from "../calendar-store/calendar-store"
import { withEnvironment } from "../extensions/with-environment"
import { withRootStore } from "../extensions/with-root-store"

/**
 * Model description here for TypeScript hints.
 */
export const TimeRangeModel = types
  .model("TimeRange")
  .props({
    startHour: types.optional(types.number, 10),
    startMinute: types.optional(types.number, 30),
    endHour: types.optional(types.number, 6),
    endMinute: types.optional(types.number, 0),
    startMeridiem: types.optional(types.enumeration(["AM", "PM"]), "AM"),
    endMeridiem: types.optional(types.enumeration(["AM", "PM"]), "PM"),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setValue(value: number, field: TimeRangeField) {
      self[field] = value
      self.rootStore.calendarStore.getFreeBusy()
    },
    setMeridiem(value: TimeRangeMeridiem, field: TimeRangeMeridiemField) {
      self[field] = value
      self.rootStore.calendarStore.getFreeBusy()
    },
  }))

type TimeRangeType = Instance<typeof TimeRangeModel>
export interface TimeRange extends TimeRangeType {}
type TimeRangeSnapshotType = SnapshotOut<typeof TimeRangeModel>
export interface TimeRangeSnapshot extends TimeRangeSnapshotType {}
export const createTimeRangeDefaultModel = () => types.optional(TimeRangeModel, {})
export type TimeRangeField = "startHour" | "startMinute" | "endHour" | "endMinute"

export type TimeRangeMeridiem = "AM" | "PM"
export type TimeRangeMeridiemField = "startMeridiem" | "endMeridiem"
