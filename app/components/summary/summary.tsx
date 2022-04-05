import { Button, Text, useTheme } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Animated, Easing, StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { spacing } from '../../theme';

export interface SummaryProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Summary = observer(function Summary(props: SummaryProps) {
  const { style } = props
  const styles = useStyles()
  const containerStyle = Object.assign({}, styles.container, style)
  const { authStore, appOptions } = useStores()

  const [show, setShow] = React.useState(
    appOptions.dismissHelp || authStore.validationState === "init",
  )

  const expandedHeight = 100

  const fadeAnim = React.useRef(new Animated.Value(1)).current
  const fadeHeight = React.useRef(new Animated.Value(expandedHeight)).current
  const fadeMargin = React.useRef(new Animated.Value(10)).current

  const speed = 50

  const hideSummary = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: speed,
      useNativeDriver: false,
    }).start()
    const shrink = {
      toValue: 0,
      duration: speed * 4,
      delay: speed + (3 * speed) / 2,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }
    Animated.timing(fadeHeight, shrink).start()
    Animated.timing(fadeMargin, shrink).start()
  }

  React.useEffect(() => {
    if (!show) {
      hideSummary()
    }
  }, [show])

  return (
    <Animated.View style={[{}, { opacity: fadeAnim, height: fadeHeight, margin: fadeMargin }]}>
      <View style={containerStyle}>
        <Text style={styles.summaryText}>
          Emmenthal lets you easily copy and paste free time from your Google calendars.
        </Text>
        <Button
          style={styles.button}
          onPress={() => {
            setShow(!show)
          }}
        >
          Got it
        </Button>
      </View>
    </Animated.View>
  )
})

function useStyles() {
  const theme = useTheme()

  return {
    container: {
      maxWidth: 900,
      backgroundColor: theme["color-emmenthal-200"],
      borderColor: theme["color-emmenthal-500"],
      borderWidth: 2,
      borderRadius: 10,
      padding: spacing[4],
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing[4],
      justifyContent: "center",
      shadowOffset: { width: 6, height: 6 },
      shadowColor: "#000000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      overflow: "hidden",
    } as ViewStyle,
    summaryText: {
      fontFamily: theme["font-regular"],
      fontSize: 18,
      color: theme["color-text-default"],
      textAlignVertical: "center",
      paddingRight: spacing[4],
    } as TextStyle,
    button: {
      width: 100,
    },
  }
}
