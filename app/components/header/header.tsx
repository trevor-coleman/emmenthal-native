import * as React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text, ThemeType, useTheme, withStyles } from "@ui-kitten/components"
import { SignInButton } from "../sign-in-button/sign-in-button"
import { UserInfo } from "../user-info/user-info"
import { spacing } from "../../theme"

const CONTAINER: ViewStyle = {
  justifyContent: "flex-start",
  display: "flex",
  flexDirection: "row",
  padding: spacing[2],
}

const HEADER_VIEW: ViewStyle = {}

export interface HeaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Describe your component here
 */
export const Header = observer(function Header(props: HeaderProps) {
  const styles = useStyles()

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text category={"h1"}>{"Emmenthal - Find Holes in Your Schedule"}</Text>
      </View>
      <UserInfo />
      <View>
        <SignInButton />
      </View>
    </View>
  )
})

function useStyles(): {
  container: ViewStyle
  headerView: ViewStyle
} {
  const theme = useTheme()
  return {
    container: {
      justifyContent: "flex-start",
      display: "flex",
      flexDirection: "row",
      padding: spacing[2],
      backgroundColor: theme["color-primary-200"],
    },
    headerView: {
      flexGrow: 1,
    },
  }
}

interface StyleTypes extends Record<string, ViewStyle> {
  container: ViewStyle
  headerView: ViewStyle
}
