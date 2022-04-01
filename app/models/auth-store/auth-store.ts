import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from "../user/user"
import { addSeconds } from "date-fns"
import { withEnvironment } from "../extensions/with-environment"
import { withRootStore } from "../extensions/with-root-store"

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
    setUser(user) {
      if (!user) {
        console.log("No User")
        self.user = {
          uid: "",
          email: "",
          displayName: "",
          photoURL: "",
          emailVerified: false,
          isAnonymous: false,
        }
        return
      }
      const { uid, email, emailVerified, displayName, isAnonymous, photoURL } = user

      self.user = {
        uid,
        email,
        emailVerified,
        displayName,
        isAnonymous,
        photoURL,
      }
    },
  }))
  .actions((self) => ({
    authorize(token: string, expiresIn: number) {
      self.tokenExpires = addSeconds(new Date(), expiresIn)
      self.environment.api.authorize(token)
      self.validationState = "valid"
      self.rootStore.calendarStore.getCalendars()
      self.rootStore.calendarStore.getFreeBusy()
      self.signedOut = false
    },
    unauthorize(signedOut?: boolean) {
      self.token = ""
      self.user = undefined
      self.environment.api.unauthorize()
      self.validationState = "ivalid"
      self.rootStore.calendarStore.clear()
      self.signedOut = signedOut ?? false
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
      console.log("validateToken()")
      const response = await self.environment.api.validateToken(self.token)

      if (response.kind === "ok") {
        console.log("tokenValid")
        const {
          contents: { access_token: accessToken, expires_in: expiresIn },
        } = response
        self.authorize(accessToken, parseInt(expiresIn))
        return
      }
      console.log("tokenInvalid")
      self.unauthorize()
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>

export interface AuthStore extends AuthStoreType {}

type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>

export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
