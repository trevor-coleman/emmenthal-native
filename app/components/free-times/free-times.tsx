import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "@ui-kitten/components"
import { CopyToClipboardButton } from "../copy-to-clipboard-button/copy-to-clipboard-button"
import { useStores } from "../../models"

const CONTAINER = { marginBottom: 20 }
export interface FreeTimesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const FreeTimes = observer(function FreeTimes() {
  const { calendarStore } = useStores()

  const freeTimes = calendarStore.freeTimeText

  return (
    <View>
      <View style={CONTAINER}>
        <Text category={"h2"}>Free Time</Text>
      </View>
      <View>
        <Text>{freeTimes}</Text>
      </View>
      <CopyToClipboardButton />
    </View>
  )
})
