import { Instance, SnapshotOut, types, hasParent, getParent } from "mobx-state-tree"
import { CalendarStore } from "../calendar-store/calendar-store"

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
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    updateParentFreeTimeText() {
      if (hasParent(self)) {
        const parent = getParent(self, 1) as CalendarStore
        parent.updateFreeTimeText()
      }
    },
  }))
  .actions((self) => ({
    setValue(value: number, field: TimeRangeField) {
      self[field] = value
      self.updateParentFreeTimeText()
    },
    setMeridiem(value: TimeRangeMeridiem, field: TimeRangeMeridiemField) {
      self[field] = value
      self.updateParentFreeTimeText()
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
