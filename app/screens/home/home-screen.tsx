import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Layout } from "@ui-kitten/components"
import { spacing } from "../../theme"
import * as WebBrowser from "expo-web-browser"
import { useStores } from "../../models"
import { CalendarList, FreeTimes, Header, Options } from "../../components"
import { useGoogleSignIn } from "../../services/firebase"

const MAIN_PANEL: ViewStyle = {
  display: "flex",
  flexDirection: "row",
}

const HEADER: ViewStyle = {
  display: "flex",
  width: "100%",
  borderBottomColor: "black",
  borderBottomWidth: 2,
  marginBottom: spacing[2],
}

const LAYOUT: ViewStyle = {
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "flex-start",
  flexDirection: "column",
}

WebBrowser.maybeCompleteAuthSession()

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  function HomeScreen() {
    const { authStore } = useStores()

    const { request, promptAsync } = useGoogleSignIn()

    const handleInit = () => {
      if (authStore.token) {
        authStore.validateToken()
      } else {
        authStore.unauthorize()
      }
    }
    useEffect(() => {
      if (request && authStore.shouldSignIn) {
        promptAsync()
      }
    }, [request])

    const handleInvalid = () => {
      authStore.unauthorize()
    }

    useEffect(() => {
      switch (authStore.validationState) {
        case "valid":
          break
        case "invalid":
          handleInvalid()
          break
        case "pending":
          break
        default:
          handleInit()
          break
      }
    }, [authStore.validationState, request])

    return (
      <Layout style={LAYOUT}>
        <Header style={HEADER} />
        <View style={MAIN_PANEL}>
          <CalendarList />
          <Options />
          <FreeTimes />
        </View>
      </Layout>
    )
  },
)
