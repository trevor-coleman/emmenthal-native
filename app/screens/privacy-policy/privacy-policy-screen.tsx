import { StackScreenProps } from '@react-navigation/stack';
import { Button, Layout, Text } from '@ui-kitten/components';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Linking, ViewStyle } from 'react-native';

import { Screen } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const PrivacyPolicyScreen: FC<
  StackScreenProps<NavigatorParamList, "privacyPolicy">
> = observer(function PrivacyPolicyScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const url = "https://emmenthal-native.vercel.app/"

  function handlePress() {
    Linking.canOpenURL(url).then((supported) => {
      return Linking.openURL(url)
    })
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">
      <Layout>
        <Text category={"h1"}>Emmenthal Privacy Policy"</Text>
        <Button onPress={handlePress}>Back to The App</Button>
        <Text>
          This Privacy Policy describes how your personal information is used when you visit{" "}
          <Text onPress={handlePress}>https://emmenthal-native.vercel.app/</Text> (the “Site”).
        </Text>
        <Text category={"h2"}>PERSONAL INFORMATION WE COLLECT</Text>
        <Text>
          The Site uses Google Authentication to verify your identity and to access a limited
          portion of your Google Calendar data.
        </Text>
        <Text>
          The app runs entirely in your browser, and none of the data accessed through your google
          account is transferred to our servers. We do not store or collect any information about
          you or your calendars.
        </Text>
        <Text>When you authenticate with google, the app will have access to: </Text>
        <Text>
          1. your basic personal profile information (name, email, profile picture, etc.){" "}
        </Text>
        <Text>2. The names of the calendars you have access to in Google Calendar.</Text>
        <Text>
          3. Free/busy information for the calendars you have access to in Google Calendar.
        </Text>
        <Text>
          The app WILL NOT have access to information about individual calendar events (such as
          event titles, descriptions, invitees etc.)
        </Text>
        <Text>
          The app WILL NOT have access to any other data associated with your google account.
        </Text>
        <Text category={"h2"}>HOW DO WE USE YOUR PERSONAL INFORMATION?</Text>
        <Text>
          The information about you (email, name, profile picture) are only used to show the
          identity of the user signed into the application.
        </Text>
        <Text>
          The information about your calendars is used by the app to calculate your free time and to
          display those times in the app's UI.
        </Text>
        <Text category={"h2"}>THIRD PARTY ACCESS TO INFORMATION</Text>
        <Text>
          By signing in with your google ID, you will be giving Google permission to use your
          personal information according to their privacy policy which you can find here:
          https://www.google.com/intl/en/policies/privacy/. We do not have access to any of the
          information collected by Google, aside from what it explained above.{" "}
        </Text>
        <Text category={"h2"}>CHANGES</Text>
        <Text>
          We may update this privacy policy from time to time in order to reflect, for example,
          changes to our practices or for other operational, legal or regulatory reasons.
        </Text>
        <Text category={"c2"}>CONTACT US</Text>
        <Text>
          For more information about our privacy practices, if you have questions, or if you would
          like to make a complaint, please contact us by e-mail at trevor@getdunbar.com
        </Text>
      </Layout>
    </Screen>
  )
})
