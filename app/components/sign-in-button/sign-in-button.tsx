import * as React from "react"
import {StyleProp, TextStyle, View, ViewStyle} from "react-native"
import {observer} from "mobx-react-lite"
import {color, typography} from "../../theme"
import {Text} from "../text/text"
import {Button} from "@ui-kitten/components";
import {useGoogleSignIn} from "../../services/firebase";
import {useStores} from "../../models";

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface SignInButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const SignInButton = observer(function SignInButton(props: SignInButtonProps) {
  const {style} = props
  const styles = Object.assign({}, CONTAINER, style)
  const {authStore, calendarStore} = useStores();
  const {request, promptAsync} = useGoogleSignIn()

  return (
      <View>
        {authStore.validationState !== "valid"
            ? <Button
                disabled={!request}
                onPress={async () => {
                  await promptAsync()
                }}
            >
              Sign In
            </Button>
            : <Button
                disabled={!request}
                onPress={async () => {
                  authStore.signOut();
                  calendarStore.signOut();
                }}
            >
              Sign Out
            </Button>}
      </View>

  )
})
