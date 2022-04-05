import { Button, useTheme } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Image, ImageStyle, Pressable, StyleProp, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { useGoogleSignIn } from '../../services/firebase';
import { spacing } from '../../theme';
import { UserInfo } from '../user-info/user-info';

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
  const styles = useStyles()

  const handleSignIn = async () => {
    await promptAsync()
  }

  const disabled = !request

  return authStore.validationState !== "valid" ? (
    <View style={styles.container}>
      <View style={styles.userInfoSize} />
      <Pressable onPress={handleSignIn} disabled={disabled}>
        {({ pressed }) =>
          pressed ? (
            <Image
              style={styles.googleButtonImage}
              source={require("./btn_google_signin_light_pressed_web@2x.png")}
            />
          ) : (
            <Image
              style={styles.googleButtonImage}
              source={require("./btn_google_signin_light_normal_web@2x.png")}
            />
          )
        }
      </Pressable>
    </View>
  ) : (
    <View style={styles.container}>
      <UserInfo style={styles.userInfo} />
      <Button
        style={styles.signOutButton}
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

function useStyles() {
  const theme = useTheme()

  const buttonImage = {
    width: 191,
    height: 46,
  } as ImageStyle

  const userInfoSize: ViewStyle = {
    height: 46,
    width: 250,
  }

  return {
    container: {
      marginLeft: spacing[6],
      height: 46,
      display: "flex",
      flexDirection: "row",
      width: 450,
    } as ViewStyle,
    googleButtonImage: buttonImage,
    signOutButton: {
      ...buttonImage,
    } as ViewStyle,
    userInfoSize,
    userInfo: {
      ...userInfoSize,
      backgroundColor: "#fff",
      padding: spacing[2],
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowRadius: 6,
      shadowOpacity: 0.25,
      shadowColor: "#000",
      borderRadius: 5,
    } as ViewStyle,
  }
}
