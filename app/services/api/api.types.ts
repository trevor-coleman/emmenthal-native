import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"
import { calendar_v3 as GoogleCalendar, oauth2_v2 as GoogleOAuth } from "googleapis"

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetCalendarsResult =
  | {
      kind: "ok"
      calendars: GoogleCalendar.Schema$CalendarListEntry[]
    }
  | GeneralApiProblem

export type ValidateTokenResult =
  | {
      kind: "ok"
      contents: GoogleApiOAuth2TokenObject
    }
  | GeneralApiProblem

export interface GetFreeBusySuccess {
  kind: "ok"
  data: GoogleCalendar.Schema$FreeBusyResponse
}

export type GetFreeBusyResult = GetFreeBusySuccess | GeneralApiProblem

export interface GetFreeBusyParams {
  timeMin: Date
  timeMax: Date
  calendars: { id: string }[]
}

export type ApiUserType = GoogleOAuth.Schema$Userinfo

export type GetUserInfoResult =
  | {
      kind: "ok"
      userInfo: ApiUserType
    }
  | GeneralApiProblem
