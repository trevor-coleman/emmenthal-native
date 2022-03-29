import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    family_name: types.optional(types.string, ""),
    gender: types.optional(types.string, ""),
    given_name: types.optional(types.string, ""),
    hd: types.optional(types.string, ""),
    link: types.optional(types.string, ""),
    locale: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    picture: types.optional(types.string, ""),
    verified_email: false,
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type UserType = Instance<typeof UserModel>

export interface User extends UserType {}

type UserSnapshotType = SnapshotOut<typeof UserModel>

export interface UserSnapshot extends UserSnapshotType {}

export const createUserDefaultModel = () => types.optional(UserModel, {})
