import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import {Linking} from "react-native";
import {api} from '../../services/api';

const {signIn} = api;


export interface IAuthContext {
  authUrl?: string;
  authenticated: boolean;
  user: any;
}

export interface IAuthContextWithMethods extends IAuthContext {
  signIn: () => void;
}

const AuthContext = createContext<IAuthContextWithMethods | undefined>(
    undefined
);

export function AuthProvider({
                               children,
                             }: PropsWithChildren<IAuthContext>): JSX.Element {
  const [authenticated, setAuthenticated] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | undefined>();
  const [user, setUser] = useState<any>();
  const [lastLoginAttempt, setLastLoginAttempt] = useState(nanoid());

  function attemptSignIn() {
    console.log(authUrl);
    if (authUrl) {
      Linking.canOpenURL(authUrl).then(supported => {
        if (supported) {
          Linking.openURL(authUrl);
        } else {
          console.log("Don't know how to open URI: " + authUrl);
        }
      })
    }
    setLastLoginAttempt(nanoid());
  }

  function handleSignIn({ authenticated, authUrl, user }: IAuthContext) {
    setAuthenticated(authenticated);
    setAuthUrl(authUrl);
    setUser(user);
  }

  useEffect(() => {
    signIn(handleSignIn);
  }, [lastLoginAttempt]);

  return (
      <AuthContext.Provider
          value={{ authenticated, authUrl, user, signIn: attemptSignIn }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (typeof authContext === 'undefined') {
    throw new Error('use Auth must be used within an AuthProvider');
  }
  return authContext;
}


