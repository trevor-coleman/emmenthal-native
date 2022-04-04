import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { TimeRangeSlider } from "../time-range-slider/time-range-slider"
import { TimePicker } from "../time-picker/time-picker"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  height: 60,
}

export interface TimeRangeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const TimeRange = observer(function TimeRange(props: TimeRangeProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <TimeRangeSlider />
    </View>
  )
})
