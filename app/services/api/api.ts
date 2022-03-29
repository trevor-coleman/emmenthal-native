import { ApisauceInstance, create } from "apisauce"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import axios, { AxiosError, AxiosResponse } from "axios"
import { calendar_v3 } from "googleapis"


export interface IAuthContext {
  authUrl?: string
  authenticated: boolean
  user: any
}


interface  ValidateTokenResponseType {result: "success" | "fail"}
interface IValidateTokenSuccess extends ValidateTokenResponseType { result: "success", contents: GoogleApiOAuth2TokenObject }
interface IValidateTokenFailure extends ValidateTokenResponseType { result: "fail"}
export type ValidateTokenResponse = IValidateTokenSuccess | IValidateTokenFailure

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig
  token: string

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getCalendars() {
    const res = await axios.get("/users/me/calendarList", {
      baseURL: "https://www.googleapis.com/calendar/v3",
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
    return res
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = ""
  }

  async validateToken(token): Promise<ValidateTokenResponse> {
    try {
      const response = await axios.get<GoogleApiOAuth2TokenObject>(`/oauth2/v3/tokeninfo?access_token=${token}`, {
        baseURL: "https://www.googleapis.com"
      })

      if(response.status === 200) {
        return {
          result: "success",
          contents: response.data
        }
      } else {
        return {
          result: "fail"
        }
      }

    } catch (e) {
      console.error(e);
      return {result: "fail"};
    }

  }

  async getFreeBusy({
    timeMin,
    timeMax,
    calendars,
  }: {
    timeMin: Date
    timeMax: Date
    calendars: { id: string }[]
  }) {
    return await axios.post<
      calendar_v3.Schema$FreeBusyRequest,
      AxiosResponse<calendar_v3.Schema$FreeBusyResponse>
    >(
      "/calendar/v3/freeBusy",
      { timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), items: calendars },
      {
        baseURL: "https://www.googleapis.com",
        headers: {
          Authorization: "Bearer " + this.token,
        },
      },
    )
  }
}

export const api = new Api()
