import React, {FC, useEffect} from "react"
import {observer} from "mobx-react-lite"
import {TextStyle, View, ViewStyle} from "react-native"
import {StackScreenProps} from "@react-navigation/stack"
import {NavigatorParamList} from "../../navigators"
import {Button, Text, Layout, Divider} from "@ui-kitten/components"
import {color, spacing} from "../../theme"
import * as WebBrowser from "expo-web-browser"
import {addDays} from "date-fns"
import {useGoogleSignIn} from "../../services/firebase"
import {useStores} from "../../models"
import {CalendarList, CopyToClipboardButton, FreeTimes, Header, Options} from "../../components"
import {api} from "../../services/api";

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const BUTTON: ViewStyle = {
  width: 200,
  marginVertical: 5,
}

const BUTTON_TEXT: TextStyle = {
  fontSize: 24,
}

WebBrowser.maybeCompleteAuthSession()

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
    function HomeScreen() {
      const {authStore, calendarStore} = useStores()

      const handleInit = () => {
        if (authStore.token) {
          authStore.validateToken()
        }
      }

      const handleInvalid = () => {
        console.log("handleInvalid")
        authStore.signOut();
        calendarStore.signOut();
      }

      switch (authStore.validationState) {
        case "init":
          handleInit();
          break;
        case "invalid":
          handleInvalid();
          break;
      }



      return (
          <Layout
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
          >
            <Header style={{
              display:"flex",
              width:"100%",
              borderBottomColor:"black",
              borderBottomWidth:2,
              marginBottom: spacing[2],
            }}/>
            <View style={{
              display:"flex",
              flexDirection:"row"
            }}>
              <CalendarList/>
              <Options/>
              <FreeTimes/>
            </View>
          </Layout>
      )
    },
)
