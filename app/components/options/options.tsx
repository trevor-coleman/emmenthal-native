import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"

import { Button, Text } from "@ui-kitten/components"
import { DateRange } from "../date-range/date-range"
import { TimeRange } from "../time-range/time-range"
import { DaysOfTheWeek } from "../days-of-the-week/days-of-the-week"

const CONTAINER: ViewStyle = {
  justifyContent: "flex-start",
  alignItems: "flex-start",
  minWidth: 300,
  maxWidth: 500,
  marginHorizontal: 20,
  borderRightWidth: 1,
  borderRightColor: "#eee",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface OptionsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Options = observer(function Options(props: OptionsProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <Text category={"h2"}>Options</Text>
      <DateRange />
      <Text category={"h4"}>Time Range</Text>
      <TimeRange />
      <Text category={"h4"}>Days of the Week</Text>
      <DaysOfTheWeek />
    </View>
  )
})
