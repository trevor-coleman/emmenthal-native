import { Instance, SnapshotOut, types } from 'mobx-state-tree';

/**
 * Model description here for TypeScript hints.
 */
export const AppOptionsModel = types
  .model("AppOptions")
  .props({
    dismissHelp: false,
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setDismissHelp(dismissHelp: boolean) {
      self.dismissHelp = dismissHelp
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type AppOptionsType = Instance<typeof AppOptionsModel>
export interface AppOptions extends AppOptionsType {}
type AppOptionsSnapshotType = SnapshotOut<typeof AppOptionsModel>
export interface AppOptionsSnapshot extends AppOptionsSnapshotType {}
export const createAppOptionsDefaultModel = () => types.optional(AppOptionsModel, {})
