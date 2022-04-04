import { getHours, getMinutes, set } from 'date-fns';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { sliderToDate } from '../../services/free-busy/time';
import { withEnvironment } from '../extensions/with-environment';
import { withRootStore } from '../extensions/with-root-store';

let timer: NodeJS.Timeout

/**
 * Model description here for TypeScript hints.
 */
export const TimeRangeModel = types
  .model("TimeRange")
  .props({
    start: types.optional(types.Date, set(new Date(), { hours: 10, minutes: 0 })),
    end: types.optional(types.Date, set(new Date(), { hours: 18, minutes: 0 })),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .views((self) => ({
    toObject() {
      const start = {
        hours: getHours(self.start),
        minutes: getMinutes(self.start),
      }
      const end = {
        hours: getHours(self.end),
        minutes: getMinutes(self.end),
      }
      return {
        start,
        end,
      }
    },
    get sliderRange(): [number, number] {
      const start = (getHours(self.start) + getMinutes(self.start) / 60) * 2
      const end = (getHours(self.end) + getMinutes(self.end) / 60) * 2
      console.log("sliderRange", [start, end])

      return [start, end]
    },
    get timeRangeInfo() {
      return {
        start: self.start,
        end: self.end,
        duration: { hours: 1, minutes: 0 },
      }
    },
  }))
  .actions((self) => ({
    setValue(value: number, field: TimeRangeField) {
      self[field] = value
      self.rootStore.calendarStore.getFreeBusy()
    },
    setMeridiem(value: TimeRangeMeridiem, field: TimeRangeMeridiemField) {
      self[field] = value
      self.rootStore.calendarStore.getFreeBusy()
    },
    setTimeRange({ start, end }: { start: Date; end: Date }) {
      self.start = start
      self.end = end
      self.rootStore.calendarStore.getFreeBusy()
    },
  }))
  .actions((self) => ({
    setFromSliderRange(range: [number, number], updateFreeBusy?: boolean) {
      const start = sliderToDate(range[0])
      const end = sliderToDate(range[1])

      self.start = start
      self.end = end
      if (updateFreeBusy) {
        self.rootStore.calendarStore.getFreeBusy()
      }
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
