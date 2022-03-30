import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { CheckBox, ListItem } from "@ui-kitten/components"
import { useStores } from "../../models"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  maxWidth:"100%",
  overflow:"hidden",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface CalendarCheckboxProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  id: string
  label: string
}

/**
 * Describe your component here
 */
export const CalendarCheckbox = observer(function CalendarCheckbox(props: CalendarCheckboxProps) {
  const { style, id, label } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { calendarStore } = useStores()

  const checked = calendarStore.selectedIds.includes(id)

  return (
    <ListItem>
      <CheckBox
          style={styles}
        checked={checked}
        onChange={(nextChecked) => calendarStore.setCalendarSelected(id, nextChecked)}
      >
        {label}
      </CheckBox>
    </ListItem>
  )
})
