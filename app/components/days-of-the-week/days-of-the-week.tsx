import * as React from "react"
import {StyleProp, TextStyle, View, ViewStyle} from "react-native"
import {observer} from "mobx-react-lite"
import {color, spacing, typography} from "../../theme"
import {Button, CheckBox, Icon, Text} from "@ui-kitten/components"
import {useStores} from "../../models";

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface DaysOfTheWeekProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

const CHECKBOX_LIST: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
}

const CHECKBOX: ViewStyle = {
  marginVertical: spacing[1],
  paddingLeft: spacing[2]
}

const BUTTON = {
  ...CHECKBOX,
  width: "100%"
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEKDAYS = [false, true, true, true, true, true, false]
const EVERYDAY = [true, true, true, true, true, true, true]

/**
 * Describe your component here
 */
export const DaysOfTheWeek = observer(function DaysOfTheWeek(props: DaysOfTheWeekProps) {
  const {style} = props
  const styles = Object.assign({}, CONTAINER, style)
  const {calendarStore} = useStores();

  const isAllWeekdays = calendarStore.daysOfTheWeek.every((value, index) => value === WEEKDAYS[index]);
  const isEveryDay = calendarStore.daysOfTheWeek.every((value) => value);

  const StarIcon = (props) => (
      <Icon {...props} name='star'/>
  );


  return (
      <View style={styles}>
        <View style={CHECKBOX_LIST}>
          {calendarStore.daysOfTheWeek.map((checked, index) => (<CheckBox
              key={`${index}-${DAY_LABELS[index]}`}
              style={CHECKBOX}
              checked={checked}
              onChange={(nextChecked) => {
                calendarStore.setDay(index, nextChecked)
              }}
          >
            {DAY_LABELS[index]}
          </CheckBox>))}
        </View>
        <View>
          <Button
              appearance={"outline"}
              disabled={isAllWeekdays}
              style={BUTTON}
              onPress={
                () => calendarStore.setAllDays(WEEKDAYS)
              }>Weekdays</Button>
          <Button
              appearance={"outline"}
              disabled={isEveryDay}
              style={BUTTON}
              onPress={
                () => calendarStore.setAllDays(EVERYDAY)
              }>Every day</Button>
        </View>
      </View>
  )
})
