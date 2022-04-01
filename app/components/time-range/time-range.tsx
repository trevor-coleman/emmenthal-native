import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../text/text"
import { Input, Radio, RadioGroup } from "@ui-kitten/components"
import { TimeRangeField, TimeRangeMeridiem, TimeRangeMeridiemField, useStores } from "../../models"
import { isBefore } from "date-fns"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 22,
  color: color.palette.black,
  paddingHorizontal: spacing[1],
}

const TIME_PICKER: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  maxWidth: "100%",
  justifyContent: "center",
  alignItems: "center",
}

const TIME_INPUT: ViewStyle = {
  flex: 1,
  width: 50,
}

const ERROR_CONTAINER: ViewStyle = {
  height: 20,
}

const MERIDIEM_RADIO_GROUP: ViewStyle = {
  display: "flex",
  flexDirection: "row",
}
export interface TimeRangeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

const ERROR: TextStyle = {
  color: color.error,
}

/**
 * Describe your component here
 */
export const TimeRange = observer(function TimeRange(props: TimeRangeProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)

  const { calendarStore } = useStores()
  const { timeRange } = calendarStore
  const [startHour, setStartHour] = React.useState(timeRange.startHour.toString())
  const [startMinute, setStartMinute] = React.useState(timeRange.startMinute.toString())
  const [endHour, setEndHour] = React.useState(timeRange.endHour.toString())
  const [endMinute, setEndMinute] = React.useState(timeRange.endMinute.toString())

  const updateTimeValue = (nextValue: number, field: TimeRangeField) => {
    timeRange.setValue(nextValue, field)
  }

  const updateMeridiem = (nextValue: TimeRangeMeridiem, field: TimeRangeMeridiemField) => {
    timeRange.setMeridiem(nextValue, field)
  }

  const timeRangeInfo = calendarStore.timeRangeInfo

  const isError = isBefore(timeRangeInfo.end, timeRangeInfo.start)

  const handleChange = (nextValue: string, field: TimeRangeField) => {
    let set: (value: string) => void
    let maxValue: number

    if (["startHour", "endHour"].includes(field)) {
      maxValue = 11
    } else {
      maxValue = 60
    }

    switch (field) {
      case "startHour":
        set = setStartHour
        break
      case "startMinute":
        set = setStartMinute
        break
      case "endHour":
        set = setEndHour
        break
      case "endMinute":
        set = setEndMinute
        break
    }

    if (nextValue.length === 0) {
      set("")
      return
    }
    const numericValue = parseInt(nextValue)
    if (isNaN(numericValue) || numericValue > maxValue || numericValue < 0) {
      set(timeRange[field].toString())
      return
    }
    set(nextValue)
  }

  return (
    <View style={styles}>
      <View style={TIME_PICKER}>
        <Input
          style={TIME_INPUT}
          placeholder="Start Hour"
          keyboardType="numeric"
          value={startHour}
          status={isError ? "danger" : undefined}
          onChangeText={(nextValue) => handleChange(nextValue, "startHour")}
          onBlur={() => {
            if (startHour === "") {
              setStartHour(timeRange.startHour.toString())
            } else {
              updateTimeValue(parseInt(startHour), "startHour")
            }
          }}
        />
        <Text style={TEXT}>{":"}</Text>
        <Input
          style={TIME_INPUT}
          placeholder="Start Minute"
          keyboardType="numeric"
          value={startMinute.toString()}
          status={isError ? "danger" : undefined}
          onChangeText={(nextValue) => setStartMinute(nextValue)}
          onBlur={() => {
            if (startMinute === "") {
              setStartMinute(timeRange.startMinute.toString())
            } else {
              updateTimeValue(parseInt(startMinute), "startMinute")
            }
          }}
        />
        <RadioGroup
          style={MERIDIEM_RADIO_GROUP}
          selectedIndex={timeRange.startMeridiem === "AM" ? 0 : 1}
          onChange={(index) => {
            updateMeridiem(index === 0 ? "AM" : "PM", "startMeridiem")
          }}
        >
          <Radio>AM</Radio>
          <Radio>PM</Radio>
        </RadioGroup>
      </View>
      <View style={TIME_PICKER}>
        <Input
          style={TIME_INPUT}
          placeholder="End Hour"
          keyboardType="numeric"
          value={endHour.toString()}
          status={isError ? "danger" : undefined}
          onChangeText={(nextValue) => handleChange(nextValue, "endHour")}
          onBlur={() => {
            if (endHour === "") {
              setEndHour(timeRange.endMinute.toString())
            } else {
              updateTimeValue(parseInt(endHour), "endHour")
            }
          }}
        />
        <Text style={TEXT}>{":"}</Text>
        <Input
          style={TIME_INPUT}
          placeholder="Place your Text"
          keyboardType="numeric"
          value={endMinute.toString()}
          status={isError ? "danger" : undefined}
          onChangeText={(nextValue) => handleChange(nextValue, "endMinute")}
          onBlur={() => {
            if (endMinute === "") {
              setEndMinute(timeRange.endMinute.toString())
            }
          }}
        />
        <RadioGroup
          style={MERIDIEM_RADIO_GROUP}
          selectedIndex={timeRange.endMeridiem === "AM" ? 0 : 1}
          onChange={(index) => {
            console.log("index", index)
            updateMeridiem(index === 0 ? "AM" : "PM", "endMeridiem")
          }}
        >
          <Radio>AM</Radio>
          <Radio>PM</Radio>
        </RadioGroup>
      </View>
      <View style={ERROR_CONTAINER}>
        {isError ? <Text style={ERROR}>Invalid Time Range</Text> : <Text />}
      </View>
    </View>
  )
})
