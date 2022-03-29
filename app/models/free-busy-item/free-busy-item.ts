import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const FreeBusyItemModel = types
  .model("FreeBusyItem")
  .props({
    start: types.Date,
    end: types.Date,
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type FreeBusyItemType = Instance<typeof FreeBusyItemModel>
export interface FreeBusyItem extends FreeBusyItemType {}
type FreeBusyItemSnapshotType = SnapshotOut<typeof FreeBusyItemModel>
export interface FreeBusyItemSnapshot extends FreeBusyItemSnapshotType {}
export const createFreeBusyItemDefaultModel = () => types.optional(FreeBusyItemModel, {})
