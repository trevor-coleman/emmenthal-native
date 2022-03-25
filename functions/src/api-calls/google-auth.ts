import {google} from "googleapis";

const client_id = process.env.EMMENTHAL_CLIENT_ID;
const client_secret = process.env.EMMENTHAL_CLIENT_SECRET;
const redirect_uri = process.env.EMMENTHAL_REDIRECT_URI;

let googleAuth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

export function getAuth() {
  googleAuth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  return googleAuth;
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function getAuthUrl() {
  return googleAuth.generateAuthUrl({
    scope: SCOPES,
    access_type: "offline",
  });
}
