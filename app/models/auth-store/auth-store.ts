import {Instance, SnapshotOut, types, flow} from "mobx-state-tree"
import {UserModel} from "../user/user"
import {api} from "../../services/api"
import {addSeconds} from "date-fns";

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
    .model("AuthStore")
    .props({
      authenticated: false,
      lastLoginAttempt: types.maybe(types.string),
      user: types.maybe(UserModel),
      token: types.optional(types.string, ""),
      tokenExpires: types.maybe(types.Date),
      validationState: types.optional(types.enumeration("ValidationState", ["pending", "valid", "invalid", "init"]), "init")
    })

    .actions((self) => ({
      signOut() {
        self.token = "";
        self.validationState = "init";
        api.setToken("");
        self.user = undefined;
      },
      setUser(user) {



        const {
          uid,
          email,
          emailVerified,
          displayName,
          isAnonymous,
          photoURL,
        } = user;


        self.user = {
          uid,
          email,
          emailVerified,
          displayName,
          isAnonymous,
          photoURL,
        };
      }
    }))
    .actions((self) => ({
      validateToken: flow(function* validateToken() {
        self.validationState = "pending"
        const response = yield api.validateToken(self.token)
        if (response.result === "success") {
          const {contents} = response;
          self.tokenExpires = addSeconds(new Date(), parseInt(contents.expires_in));
          api.token = self.token;
          self.validationState = "valid"
        } else {
          api.token = "";
          self.signOut();
          self.validationState = "invalid"
        }
      })
    }))
    .actions((self) => ({
      handleSignInResponse(response) {

        if (response.type === "success") {
          const {authentication} = response
          self.token = authentication.accessToken
          api.setToken(authentication.accessToken)
        } else {
          self.signOut();
        }
      },
    }))


type AuthStoreType = Instance<typeof AuthStoreModel>

export interface AuthStore extends AuthStoreType {
}

type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>

export interface AuthStoreSnapshot extends AuthStoreSnapshotType {
}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})


