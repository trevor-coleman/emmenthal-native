import {ApisauceInstance, create} from "apisauce"
import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config"
import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios"
import {calendar_v3} from "googleapis"

import {store} from "../../models";


export interface IAuthContext {
  authUrl?: string
  authenticated: boolean
  user: any
}


interface ApiResponse {
  result: "success" | "fail"
}

interface IValidateTokenSuccess extends ApiResponse {
  result: "success",
  contents: GoogleApiOAuth2TokenObject
}

interface IValidateTokenFailure extends ApiResponse {
  result: "fail"
}

export type ValidateTokenResponse = IValidateTokenSuccess | IValidateTokenFailure

export interface GetFreeBusySuccess extends ApiResponse {
  result: "success",
  data: calendar_v3.Schema$FreeBusyResponse
}

interface GetFreeBusyFailure extends ApiResponse {
  result: "fail"
}

export type GetFreeBusyResponse = GetFreeBusySuccess | GetFreeBusyFailure;

export interface GetCalendarsSuccess extends ApiResponse {
  result: "success",
  data: calendar_v3.Schema$CalendarList
}

interface GetCalendarsFailure extends ApiResponse {
  result: "fail"
}

export type GetCalendarsResponse = GetCalendarsSuccess | GetCalendarsFailure;

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  axios: AxiosInstance

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


  setup() {

  }

  async getCalendars(): Promise<GetCalendarsResponse> {
    try {
      const res = await axios.get("calendar/v3/users/me/calendarList", {
        baseURL:"https://www.googleapis.com",
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
      return {
        result: "success",
        data: res.data
      }
    } catch (e) {
      console.error(e)
      return {
        result: 'fail'
      }
    }
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = ""
  }

  async validateToken(token): Promise<ValidateTokenResponse> {
    try {
      const response = await axios.get<GoogleApiOAuth2TokenObject>(`/oauth2/v3/tokeninfo`, {
        baseURL:"https://www.googleapis.com",
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })

      if (response.status === 200) {
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
  }): Promise<GetFreeBusyResponse> {
    try {
      const response = await axios.post<calendar_v3.Schema$FreeBusyRequest,
          AxiosResponse<calendar_v3.Schema$FreeBusyResponse>>(
          "/calendar/v3/freeBusy",
          {timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), items: calendars},
          {
            baseURL:"https://www.googleapis.com",
            headers: {
              Authorization: "Bearer " + this.token,
            },
          },
      )

      return {
        result: "success",
        data: response.data
      }
    } catch (e) {
      console.error(e)
      return {result: "fail"}
    }
  }
}

export const api = new Api();
