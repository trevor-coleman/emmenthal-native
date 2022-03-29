import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from "../user/user"
import { api, IAuthContext } from "../../services/api"
import { nanoid } from "nanoid"

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    authenticated: false,
    lastLoginAttempt: types.maybe(types.string),
    authUrl: types.maybe(types.string),
    user: types.optional(UserModel, {}),
    token: types.optional(types.string, ""),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    handleSignIn(result: IAuthContext) {
      console.table("signIn Result", result)
      const { authUrl, authenticated, user } = result

      self.authUrl = authUrl
      self.authenticated = authenticated
      self.user = user
    },
    setLastLoginAttempt(id: string) {
      self.lastLoginAttempt = id
    },
  }))
  .actions((self) => ({
    handleSignInResponse(response) {
      const { authentication } = response
      self.token = authentication.accessToken
      api.setToken(authentication.accessToken)
    },
  }))
  .actions((self) => ({
    attemptSignIn(router) {
      if (self.authUrl) {
        void router.push(self.authUrl)
      }
      self.setLastLoginAttempt(nanoid())
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>

export interface AuthStore extends AuthStoreType {}

type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>

export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
