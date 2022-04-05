import { Radio, RadioGroup, Text } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffect } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { color, typography } from '../../theme';

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface DateRangeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const DateRange = observer(function DateRange(props: DateRangeProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const { calendarStore } = useStores()

  useEffect(() => {
    if (selectedIndex === 0) {
      calendarStore.setDaysForward(7)
    }
    if (selectedIndex === 1) {
      calendarStore.setDaysForward(14)
    }
  }, [selectedIndex])

  return (
    <View style={styles}>
      <Text category={"h3"}>Date Range</Text>
      <RadioGroup selectedIndex={selectedIndex} onChange={(index) => setSelectedIndex(index)}>
        <Radio>One Week</Radio>
        <Radio>Two Weeks</Radio>
      </RadioGroup>
    </View>
  )
})
