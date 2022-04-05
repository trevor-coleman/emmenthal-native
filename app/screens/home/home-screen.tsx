import { StackScreenProps } from '@react-navigation/stack';
import { Layout } from '@ui-kitten/components';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';

import { CalendarList, FreeTimes, Header, Options, Summary } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { useGoogleSignIn } from '../../services/firebase';
import { spacing } from '../../theme';

const TOP: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "scroll",
}

const MAIN_PANEL: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}

const HEADER: ViewStyle = {
  display: "flex",
  width: "100%",
  borderBottomColor: "black",
  borderBottomWidth: 2,
  marginBottom: spacing[2],
}

const SUMMARY_PANEL: ViewStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const LAYOUT: ViewStyle = {
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  paddingTop: spacing[6],
  flexGrow: 1,
}

const COLUMN: ViewStyle = {
  width: 300,
  marginHorizontal: spacing[4],
  padding: spacing[2],
  shadowColor: "#000",
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowRadius: 6,
  shadowOpacity: 0.25,
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
      <View style={TOP}>
        <Header style={HEADER} />
        <Layout style={LAYOUT}>
          <Summary />
          <View style={MAIN_PANEL}>
            <View style={COLUMN}>
              <CalendarList />
            </View>
            <View style={COLUMN}>
              <Options />
            </View>
            <View style={COLUMN}>
              <FreeTimes />
            </View>
          </View>
        </Layout>
      </View>
    )
  },
)
