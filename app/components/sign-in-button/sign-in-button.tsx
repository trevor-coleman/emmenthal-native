import { Button } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Image, ImageStyle, Pressable, StyleProp, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { useGoogleSignIn } from '../../services/firebase';
import { spacing } from '../../theme';
import { UserInfo } from '../user-info/user-info';

const CONTAINER: ViewStyle = {
  marginLeft: spacing[6],
  height: 46,
  display: "flex",
  flexDirection: "row",
  width: 450,
}
const GOOGLE_BUTTON_IMAGE: ImageStyle = {
  width: 191,
  height: 46,
}

const SIGN_OUT_BUTTON: ViewStyle = {
  ...GOOGLE_BUTTON_IMAGE,
}

const USER_INFO: ViewStyle = { height: 46, width: 250 }
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

  const handleSignIn = async () => {
    await promptAsync()
  }

  const disabled = !request

  return authStore.validationState !== "valid" ? (
    <View style={CONTAINER}>
      <View style={USER_INFO} />
      <Pressable onPress={handleSignIn} disabled={disabled}>
        {({ pressed }) =>
          pressed ? (
            <Image
              style={GOOGLE_BUTTON_IMAGE}
              source={require("./btn_google_signin_light_pressed_web@2x.png")}
            />
          ) : (
            <Image
              style={GOOGLE_BUTTON_IMAGE}
              source={require("./btn_google_signin_light_normal_web@2x.png")}
            />
          )
        }
      </Pressable>
    </View>
  ) : (
    <View style={CONTAINER}>
      <UserInfo style={USER_INFO} />
      <Button
        style={SIGN_OUT_BUTTON}
        disabled={!request}
        onPress={async () => {
          authStore.unauthorize(true)
        }}
      >
        Sign Out
      </Button>
    </View>
  )
})
