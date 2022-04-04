import { Text } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { color, typography } from '../../theme';
import { DateRange } from '../date-range/date-range';
import { DaysOfTheWeek } from '../days-of-the-week/days-of-the-week';
import { TimeRange } from '../time-range/time-range';

const CONTAINER: ViewStyle = {
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: 300,
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

const OPTIONS_SECTION: ViewStyle = {
  marginBottom: 20,
}

/**
 * Describe your component here
 */
export const Options = observer(function Options(props: OptionsProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <View style={OPTIONS_SECTION}>
        <DateRange />
      </View>
      <View style={OPTIONS_SECTION}>
        <Text category={"h2"}>Time Range</Text>
        <TimeRange />
      </View>
      <View style={OPTIONS_SECTION}>
        <Text category={"h2"}>Days of the Week</Text>
        <DaysOfTheWeek />
      </View>
    </View>
  )
})
