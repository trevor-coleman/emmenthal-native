import { Text, useTheme } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ImageStyle, View, ViewStyle } from 'react-native';

import { spacing } from '../../theme';
import { AutoImage } from '../auto-image/auto-image';
import { SignInButton } from '../sign-in-button/sign-in-button';

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
      <View>
        <AutoImage style={styles.logo} source={require("./emmenthal-logo.png")} />
      </View>
      <View style={styles.headerView}>
        <Text category={"h1"}>{"Emmenthal - Find Holes in Your Schedule"}</Text>
      </View>
      <View>
        <SignInButton />
      </View>
    </View>
  )
})

function useStyles() {
  const theme = useTheme()
  return {
    container: {
      justifyContent: "flex-start",
      display: "flex",
      flexDirection: "row",
      padding: spacing[2],
      backgroundColor: theme["color-emmenthal-500"],
    } as ViewStyle,
    headerView: {
      flexGrow: 1,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      marginLeft: spacing[4],
    } as ViewStyle,
    logo: {
      height: 50,
      width: 50,
      aspectRatio: 1,
    } as ImageStyle,
  }
}
