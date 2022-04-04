import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from "../user/user"
import { addSeconds } from "date-fns"
import { withEnvironment } from "../extensions/with-environment"
import { withRootStore } from "../extensions/with-root-store"
import { ApiUserType } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    signedOut: false,
    lastLoginAttempt: types.maybe(types.string),
    user: types.maybe(UserModel),
    token: types.optional(types.string, ""),
    tokenExpires: types.maybe(types.Date),
  })
  .volatile(() => ({
    validationState: "init",
  }))
  .extend(withEnvironment)
  .extend(withRootStore)
  .views((self) => ({
    get shouldSignIn() {
      if (self.signedOut || self.validationState === "pending") {
        return false
      }
      return true
    },
  }))
  .actions((self) => ({
    setUser(user: ApiUserType) {
      self.user = UserModel.create(user)
    },
  }))
  .actions((self) => ({
    async authorize(token: string, expiresIn: number) {
      self.tokenExpires = addSeconds(new Date(), expiresIn)
      self.environment.api.authorize(token)
      self.validationState = "valid"
      self.signedOut = false
      self.token = token
      await self.rootStore.calendarStore.getCalendars()
      await self.rootStore.calendarStore.getFreeBusy()
      self.rootStore.calendarStore.updateFreeTimeText()
    },
    unauthorize(signedOut?: boolean) {
      self.token = ""
      self.user = undefined
      self.environment.api.unauthorize()
      self.validationState = "invalid"
      self.rootStore.calendarStore.clear()
      self.signedOut = signedOut ?? false
      self.rootStore.calendarStore.updateFreeTimeText()
    },
    async getUserInfo() {
      const result = await self.environment.api.getUserInfo()
      if (result.kind === "ok") {
        self.setUser(result.userInfo)
      }
    },
  }))
  .actions((self) => ({
    handleSignInResponse(response) {
      if (response.type === "success") {
        const {
          authentication: { accessToken, expiresIn },
        } = response
        self.authorize(accessToken, parseInt(expiresIn))
      } else {
        self.unauthorize()
      }
    },
    async validateToken() {
      self.validationState = "pending"

      const response = await self.environment.api.validateToken(self.token)

      if (response.kind === "ok") {
        const {
          contents: { expires_in: expiresIn },
        } = response
        self.authorize(self.token, parseInt(expiresIn))
        return
      }
      self.unauthorize()
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>

export interface AuthStore extends AuthStoreType {}

type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>

export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
