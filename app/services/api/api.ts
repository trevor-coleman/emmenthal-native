import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import {
  GetCalendarsResult,
  GetFreeBusyParams,
  GetFreeBusyResult,
  ValidateTokenResult,
} from "./api.types"
import { calendar_v3 as GoogleCalendarApi } from "googleapis"

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

  authorized: boolean

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

  authorize(token: string) {
    console.log("authorizing with token", token)
    this.apisauce.setHeader("Authorization", `Bearer ${token}`)
    this.authorized = true
  }

  unauthorize() {
    console.log("unauthorizing")
    this.apisauce.setHeader("Authorization", "")
    this.authorized = false
  }

  /**
   *  Gets the list of calendars.
   */
  async getCalendars(): Promise<GetCalendarsResult> {
    const response: ApiResponse<GoogleCalendarApi.Schema$CalendarList> = await this.apisauce.get(
      "calendar/v3/users/me/calendarList",
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return { kind: "ok", calendars: response.data.items }
  }

  async validateToken(token: string): Promise<ValidateTokenResult> {
    const response = await this.apisauce.get<GoogleApiOAuth2TokenObject>(`/oauth2/v3/tokeninfo`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok", contents: response.data }
  }

  async getFreeBusy({
    timeMin,
    timeMax,
    calendars,
  }: GetFreeBusyParams): Promise<GetFreeBusyResult> {
    const response = await this.apisauce.post<GoogleCalendarApi.Schema$FreeBusyResponse>(
      "/calendar/v3/freeBusy",
      {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: calendars,
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok", data: response.data }
  }
}
