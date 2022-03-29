import React, {FC, useEffect} from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Text, Layout, Divider } from "@ui-kitten/components"
import { color } from "../../theme"
import * as WebBrowser from "expo-web-browser"
import { addDays} from "date-fns"
import { useGoogleSignIn } from "../../services/firebase"
import { useStores } from "../../models"
import { CalendarList } from "../../components"
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
    const [calendars, setCalendars] = React.useState([])
    const { request, promptAsync } = useGoogleSignIn()
    const { authStore, calendarStore } = useStores()

    console.log(authStore.validationState);

    switch(authStore.validationState) {
      case "init":
        handleInit();
        break;
      case "invalid":
        handleInvalid();
        break;
    }

    function handleInit () {
      if(authStore.token) {
        authStore.validateToken()
      }
    }

    function handleInvalid() {
      authStore.signOut();
      calendarStore.signOut();
    }

    const freeTimes = calendarStore.freeTimeText

    console.log(authStore?.user?.displayName);

    useEffect(()=>{
      if(authStore.validationState === "valid") {
        api.setToken(authStore.token)
      } else {
        api.clearToken()
      }
    }, [authStore.token])

    return (
      <Layout
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <View>
          <Text category={"h2"}>{`${authStore?.user?.displayName ?? "Signed Out"}`}</Text>
          {authStore.validationState !== "valid" ? <Button
            style={BUTTON}
            disabled={!request}
            onPress={async () => {
              await promptAsync()
            }}
          >
            Sign In
          </Button> : <Button
              style={BUTTON}
              disabled={!request}
              onPress={async () => {
                authStore.signOut();
                calendarStore.signOut();
              }}
          >
            Sign Out
          </Button>}

          <Button
            style={BUTTON}
            disabled={authStore.token === ""}
            onPress={async () => {
              await calendarStore.getCalendars()
            }}
          >
            Get Calendars
          </Button>

          <Button
            style={BUTTON}
            disabled={authStore.token === ""}
            onPress={async () => {
              await calendarStore.getFreeBusy()
            }}
          >
            Get Free Busy
          </Button>

          <Text category={"h2"}>Calendar List</Text>
          <Divider />
          <CalendarList />
          <Divider />
        </View>
        <View>
          <View style={{ marginBottom: 20 }}>
            <Text category={"h2"}>FREE TIMES</Text>
          </View>
          <Text>{freeTimes}</Text>
        </View>
      </Layout>
    )
  },
)
