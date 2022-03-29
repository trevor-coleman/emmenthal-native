// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import env from "../../config/env"
import "firebase/auth"
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth"
import React from "react"
import * as Google from "expo-auth-session/providers/google"
import { api } from "../api"
import { useStores } from "../../models"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
]

export const fb = initializeApp(firebaseConfig)
export const auth = getAuth(fb)

export function initialize() {
  return fb
}


export function useGoogleSignIn() {
  const { authStore, calendarStore } = useStores()

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: env.GOOGLE_CLIENT_ID,
    scopes: SCOPES,
  })


  React.useEffect(() => {
    if (response?.type === "success") {
      authStore.handleSignInResponse(response)

      const user = auth.currentUser;
      authStore.setUser(user);

      calendarStore.getCalendars();
      calendarStore.getFreeBusy()

    }


  }, [response])

  return { request, response, promptAsync }
}



