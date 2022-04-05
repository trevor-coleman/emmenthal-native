import { RangeSlider } from '@sharcoux/slider';
import { useTheme } from '@ui-kitten/components';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { sliderToDate } from '../../services/free-busy/time';
import { color, spacing, typography } from '../../theme';

type SliderRange = [number, number]

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  height: 60,
  minWidth: 280,
  maxWidth: "100%",
}

const SLIDER_CONTAINER: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  flexGrow: 1,
}
const TIME_DISPLAY: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const TIME: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  flex: 1,
}

const TIME_LEFT: ViewStyle = {
  ...TIME,
  marginLeft: spacing[4],
  justifyContent: "flex-start",
}
const TIME_RIGHT: ViewStyle = {
  ...TIME,
  marginRight: spacing[4],
  justifyContent: "flex-end",
}

const TIME_TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 20,
  color: color.palette.black,
  textAlignVertical: "center",
  height: "100%",
  flexGrow: 0,
}

export interface TimeRangeSliderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const TimeRangeSlider = observer(function TimeRangeSlider(props: TimeRangeSliderProps) {
  const { style } = props

  const theme = useTheme()

  const { timeRange, calendarStore } = useStores()
  const rangeRef = React.useRef<SliderRange>(timeRange.sliderRange)
  const [range, setRange] = React.useState<SliderRange>(timeRange.sliderRange)

  return (
    <View style={CONTAINER}>
      <View style={SLIDER_CONTAINER}>
        <RangeSlider
          range={rangeRef.current}
          minimumValue={0}
          maximumValue={48}
          step={1}
          minimumRange={2}
          crossingAllowed={false}
          onValueChange={(range) => {
            setRange(range)
          }}
          onSlidingComplete={(range) => {
            timeRange.setFromSliderRange(range)
            calendarStore.updateFreeTimeText()
          }}
          slideOnTap={false}
          thumbTintColor={theme["color-primary-default"]}
          inboundColor={theme["color-primary-focus"]}
        />
      </View>
      <View style={TIME_DISPLAY}>
        <View style={TIME_LEFT}>
          <Text style={TIME_TEXT}>{`${Math.floor(range[0] / 2) < 10 ? " " : ""}${format(
            sliderToDate(range[0]),
            "h",
          )}`}</Text>
          <Text style={TIME_TEXT}>{format(sliderToDate(range[0]), ":mmaaa")}</Text>
        </View>
        <View style={TIME_RIGHT}>
          <Text style={TIME_TEXT}>{format(sliderToDate(range[1]), "h")}</Text>
          <Text style={TIME_TEXT}>{format(sliderToDate(range[1]), ":mmaaa")}</Text>
        </View>
      </View>
    </View>
  )
})
