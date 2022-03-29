import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import { useStores } from "../../models"
import { CalendarCheckbox } from "../calendar-checkbox/calendar-checkbox"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface CalendarListProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const CalendarList = observer(function CalendarList(props: CalendarListProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { calendarStore } = useStores()

  return (
    <View style={styles}>
      {calendarStore.calendarList().map(({ id, label }) => (
        <CalendarCheckbox key={id} id={id} label={label} />
      ))}
    </View>
  )
})
