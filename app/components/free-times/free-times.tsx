import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "@ui-kitten/components"
import {CopyToClipboardButton} from "../copy-to-clipboard-button/copy-to-clipboard-button";
import {useStores} from "../../models";

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface FreeTimesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const FreeTimes = observer(function FreeTimes(props: FreeTimesProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  const {calendarStore} = useStores()

  const freeTimes = calendarStore.freeTimeText

  return (<View>
      <View style={{marginBottom: 20}}>
        <Text category={"h2"}>Free Time</Text>
      </View>
  <View>
    <Text>{freeTimes}</Text>
  </View>
  <CopyToClipboardButton/>
      </View>
  )
})
