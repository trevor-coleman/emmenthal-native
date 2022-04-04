import { CheckBox, ListItem } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { color, typography } from '../../theme';

const CHECKBOX: ViewStyle = {
  justifyContent: "center",
  overflow: "hidden",
  maxWidth: "100%",
}
const LIST_ITEM: ViewStyle = {
  maxWidth: "90%",
  overflow: "hidden",
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
  const { calendarStore } = useStores()

  const checked = calendarStore.selectedIds.includes(id)

  return (
    <ListItem style={LIST_ITEM}>
      <CheckBox
        style={CHECKBOX}
        checked={checked}
        onChange={(nextChecked) => calendarStore.setCalendarSelected(id, nextChecked)}
      >
        {label}
      </CheckBox>
    </ListItem>
  )
})
