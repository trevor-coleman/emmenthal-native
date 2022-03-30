import * as React from "react"
import {StyleProp, TextStyle, View, ViewStyle} from "react-native"
import {observer} from "mobx-react-lite"
import {color, spacing, typography} from "../../theme"
import {Text} from "@ui-kitten/components"
import {useStores} from "../../models";
import {SignInButton} from "../sign-in-button/sign-in-button";

const CONTAINER: ViewStyle = {
  justifyContent: "flex-start",
  display:"flex",
  flexDirection:"row",
  padding: spacing[2]
}

const HEADER_VIEW: ViewStyle = {
  flexGrow:1,
}

export interface HeaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Header = observer(function Header(props: HeaderProps) {
  const {style} = props
  const styles = Object.assign({}, CONTAINER, style)
  const {authStore} = useStores();

  return (
      <View style={styles}>
        <View style={HEADER_VIEW}>
          <Text category={"h1"}>{`Emmenthal - ${authStore?.user?.displayName ?? "Signed Out"}`}</Text>
        </View>
        <View><SignInButton/></View>
      </View>
  )
})
