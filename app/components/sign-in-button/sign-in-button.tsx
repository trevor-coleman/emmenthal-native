import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button } from "@ui-kitten/components"
import { useGoogleSignIn } from "../../services/firebase"
import { useStores } from "../../models"

export interface SignInButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SignInButton = observer(function SignInButton(props: SignInButtonProps) {
  const { authStore } = useStores()
  const { request, promptAsync } = useGoogleSignIn()

  return (
    <View>
      {authStore.validationState !== "valid" ? (
        <Button
          disabled={!request}
          onPress={async () => {
            await promptAsync()
          }}
        >
          Sign In
        </Button>
      ) : (
        <Button
          disabled={!request}
          onPress={async () => {
            authStore.unauthorize(true)
          }}
        >
          Sign Out
        </Button>
      )}
    </View>
  )
})
