import { set } from "date-fns"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthStoreModel } from "../auth-store/auth-store"
import { CalendarStoreModel } from "../calendar-store/calendar-store"
import { TimeRangeModel } from "../time-range/time-range"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  authStore: types.optional(AuthStoreModel, {}),
  calendarStore: types.optional(CalendarStoreModel, {}),
  timeRange: types.optional(TimeRangeModel, {
    start: set(new Date(), { hours: 10, minutes: 0 }),
    end: set(new Date(), { hours: 18, minutes: 0 }),
  }),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
