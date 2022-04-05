import { Button } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Clipboard, StyleProp, View, ViewStyle } from 'react-native';

import { useStores } from '../../models';
import { Text } from '../text/text';

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  width: 200,
  marginVertical: 10,
}

export interface CopyToClipboardButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

const SUCCESS_MESSAGE = { color: "black" }

/**
 * Describe your component here
 */
export const CopyToClipboardButton = observer(function CopyToClipboardButton(
  props: CopyToClipboardButtonProps,
) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { calendarStore } = useStores()

  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const freeTimeText = calendarStore.freeTimeText

  function copyToClipboard() {
    Clipboard.setString(freeTimeText)
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
    }, 400)
    setCopied(true)
  }

  useEffect(() => {
    setCopied(false)
  }, [freeTimeText])

  return (
    <View style={styles}>
      <Button disabled={busy} onPress={() => copyToClipboard()}>
        Copy To Clipboard
      </Button>
      {copied && <Text style={SUCCESS_MESSAGE}>COPIED</Text>}
    </View>
  )
})
