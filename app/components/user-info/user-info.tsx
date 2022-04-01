import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "@ui-kitten/components"
import { useStores } from "../../models"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  display: "flex",
  flexDirection: "row",
  height: "100%",
  width: 300,
  marginRight: spacing[2],
}

const TEXT_CONTAINER: ViewStyle = {
  flexGrow: 1,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  paddingRight: spacing[2],
}
const USER_NAME: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 18,
  color: color.palette.black,
  width: "100%",
  textAlign: "right",
}

const USER_EMAIL: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.palette.lightGrey,
  width: "100%",
  textAlign: "right",
}

const USER_PICTURE: ImageStyle = { height: "100%", aspectRatio: 1, borderRadius: 50 }

export interface UserInfoProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const UserInfo = observer(function UserInfo(props: UserInfoProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)

  const { authStore } = useStores()

  return (
    <View style={styles}>
      <View style={TEXT_CONTAINER}>
        <Text style={USER_NAME}>{authStore.user.name}</Text>
        <Text style={USER_EMAIL}>{authStore.user.email}</Text>
      </View>
      <Image source={{ uri: authStore.user.picture }} style={USER_PICTURE} />
    </View>
  )
})
