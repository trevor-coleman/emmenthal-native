import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import {Button} from "@ui-kitten/components";
import { Clipboard } from 'react-native';
import {useStores} from "../../models";
import {useEffect, useState} from "react";

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  marginVertical:10,
}



export interface CopyToClipboardButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const CopyToClipboardButton = observer(function CopyToClipboardButton(props: CopyToClipboardButtonProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  const {calendarStore} = useStores();

  const [busy, setBusy] = useState(false);
  const [copied, setCopied]= useState(false);


  const freeTimeText = calendarStore.freeTimeText;

  function copyToClipboard () {
    Clipboard.setString(freeTimeText);
    setBusy(true);
    setTimeout(()=>{
      setBusy(false)
    }, 400)
    setCopied(true)
  }

  useEffect(()=>{

    setCopied(false)
  }, [freeTimeText])

  return (
    <View style={styles}>
      <Button disabled={busy} onPress={()=>copyToClipboard()}>Copy To Clipboard</Button>
      {copied && <Text style={{color:"black"}}>COPIED</Text>}
    </View>
  )
})
