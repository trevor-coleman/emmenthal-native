// Import the functions you need from the SDKs you need
import env from "../../config/env"
import React from "react"
import * as Google from "expo-auth-session/providers/google"
import { useStores } from "../../models"

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
]

export function useGoogleSignIn() {
  const { authStore, calendarStore } = useStores()

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: env.GOOGLE_CLIENT_ID,
    scopes: SCOPES,
  })

  React.useEffect(() => {
    console.log("useGoogleSignIn.useEffect")
    if (response?.type === "success") {
      authStore.handleSignInResponse(response)
      authStore.getUserInfo()
      calendarStore.getCalendars()
      calendarStore.getFreeBusy()
    }
  }, [response])

  return { request, response, promptAsync }
}
