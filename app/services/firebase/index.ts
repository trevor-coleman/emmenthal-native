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

const CLIENT_ID = "642341234083-66v5bmvrq9ubn0f34prhl42c3v3o0qrk.apps.googleusercontent.com"

export function useGoogleSignIn() {
  const { authStore } = useStores()

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: CLIENT_ID,
    scopes: SCOPES,
  })

  React.useEffect(() => {
    if (response?.type === "success") {
      authStore.handleSignInResponse(response)
    }
  }, [response])

  return { request, response, promptAsync }
}

export function useFirebaseSignIn() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: CLIENT_ID,
  })
  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params
      const credential = GoogleAuthProvider.credential(id_token)
      signInWithCredential(auth, credential)
    }
  }, [response])

  return { request, promptAsync }
}

export async function useAltSignIn() {
  const provider = new GoogleAuthProvider()
  SCOPES.forEach((scope) => provider.addScope(scope))
  try {
    const result = await signInWithPopup(auth, provider)
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential.accessToken
    // The signed-in user info.
    const user = result.user
    return { result, token, user }
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code
    const errorMessage = error.message
    // The email of the user's account used.
    const email = error.email
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error)
    console.log("Error: ", errorCode, errorMessage, email, credential)
    return null
  }
}
