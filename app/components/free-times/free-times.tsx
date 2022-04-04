import { Text } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { CopyToClipboardButton } from '../copy-to-clipboard-button/copy-to-clipboard-button';

const HEADER: ViewStyle = { marginBottom: 20 }
const CONTAINER: ViewStyle = { width: 300 }
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
    <View style={CONTAINER}>
      <View style={HEADER}>
        <Text category={"h2"}>Free Time</Text>
      </View>
      <View>
        <Text>{freeTimes}</Text>
      </View>
      <CopyToClipboardButton />
    </View>
  )
})
