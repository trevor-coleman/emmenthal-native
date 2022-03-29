import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Text, Layout, Divider } from "@ui-kitten/components"
import { color } from "../../theme"
import * as WebBrowser from "expo-web-browser"
import { addDays, subDays } from "date-fns"

import { auth, useGoogleSignIn } from "../../services/firebase"
import { api } from "../../services/api"
import { useStores } from "../../models"
import { formatFreeTimeText } from "../../services/free-busy/free-busy"
import { CalendarList } from "../../components"

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

    const calendarId = calendarStore.calendarIds[8].id

    const freeTimes = calendarStore.freeTimeText

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
          <Text category={"h2"}>{`${auth.currentUser?.displayName ?? "Signed Out"}`}</Text>
          <Button
            style={BUTTON}
            disabled={!request}
            onPress={async () => {
              await promptAsync()
            }}
          >
            Sign In
          </Button>

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
              await calendarStore.getFreeBusy({
                timeMax: addDays(new Date(), 7),
                timeMin: new Date(),
              })
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
