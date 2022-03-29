import {Instance, SnapshotOut, types} from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
    .model("User")
    .props({
      uid: types.optional(types.string, ""),
      email: types.optional(types.string, ""),
      emailVerified: false,
      displayName: types.optional(types.string, ""),
      isAnonymous: false,
      photoURL: types.optional(types.string, ""),
    })
    .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
    .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type UserType = Instance<typeof UserModel>

export interface User extends UserType {
}

type UserSnapshotType = SnapshotOut<typeof UserModel>

export interface UserSnapshot extends UserSnapshotType {
}

export const createUserDefaultModel = () => types.optional(UserModel, {})
