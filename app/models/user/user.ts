import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ApiUserType } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    verified_email: false,
    picture: types.optional(types.string, ""),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    clear() {
      self.id = ""
      self.name = ""
      self.email = ""
      self.verified_email = false
      self.picture = ""
    },
    set(user: ApiUserType) {
      self.id = user.id
      self.name = user.name
      self.email = user.email
      self.verified_email = user.verified_email
      self.picture = user.picture
    },
  }))

type UserType = Instance<typeof UserModel>

export interface User extends UserType {}

type UserSnapshotType = SnapshotOut<typeof UserModel>

export interface UserSnapshot extends UserSnapshotType {}

export const createUserDefaultModel = () => types.optional(UserModel, {})
