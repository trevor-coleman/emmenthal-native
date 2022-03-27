import * as functions from "firebase-functions";
import {authenticate} from "./api-calls/authenticate";
import {google, oauth2_v2} from "googleapis";
import {getAuthUrl} from "./api-calls/google-auth";
import Cookies from "cookies";
import {getFreeBusy} from "./api-calls/free-busy";

const allowedOrigins = "http://localhost:19006";

export const auth = functions.https.onRequest(async (request, response) => {
  console.log("auth");
  const {auth, authenticated, token} = await authenticate(request, response);
  console.log("authentication complete");

  if (request.method === "OPTIONS") {
    console.log("options method");
    // Send response to OPTIONS requests
    response.set("Access-Control-Allow-Origin", allowedOrigins); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Max-Age", "3600");
    response.status(204).send("");
    return;
  }

  response.set("Access-Control-Allow-Origin", allowedOrigins);


  let user: oauth2_v2.Schema$Userinfo | undefined;
  if (!authenticated) {
    response.set("Access-Control-Allow-Origin", allowedOrigins);
    response.status(401).send({authUrl: getAuthUrl()});
    return;
  }

  if (token) {
    const cookies = new Cookies(request, response);
    cookies.set("token", JSON.stringify(token), {
      expires: new Date(token.expiry_date ?? new Date(0)),
      httpOnly: true,
    });

    google.options({auth});

    try {
      const userRes = await google.oauth2("v2").userinfo.get({});
      user = userRes?.data;
    } catch (e) {
      console.log("error");
    }
  }
  response.set("Access-Control-Allow-Origin", allowedOrigins);
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(200).send({user, authUrl: getAuthUrl()});
});

// eslint-disable-next-line max-len
export const calendars = functions.https.onRequest(
    async (request, response) => {
      const {auth, authenticated, token} = await authenticate(
          request,
          response
      );

      response.set("Access-Control-Allow-Origin", allowedOrigins);

      if (request.method === "OPTIONS") {
        // Send response to OPTIONS requests
        response.set("Access-Control-Allow-Methods", "GET");
        response.set("Access-Control-Max-Age", "3600");
        response.status(204).send("");
        return;
      }

      if (!authenticated) {
        response
            .status(401)
            .send("You do not have permission to access this resource.");
        return;
      }
      const calendar = await google.calendar({version: "v3", auth});

      const list = await calendar.calendarList.list();

      const primaryRes = await calendar.calendars.get(
          {calendarId: "primary"}
      );

      const {data: primary} = primaryRes;

      const {
        data: {items},
      } = list;

      if (token) {
        const cookies = new Cookies(request, response);
        cookies.set("token", JSON.stringify(token), {
          expires: new Date(token.expiry_date ?? 0),
          httpOnly: true,
        });
      }

      response.status(200).send({
        primary,
        calendars: items,
      });
    });

export const freeBusy = functions.https.onRequest(async (request, response) => {
  const {auth, authenticated, token} = await authenticate(request, response);
  response.set("Access-Control-Allow-Origin", "http://localhost:19006"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"

  if (request.method === "OPTIONS") {
    // Send response to OPTIONS requests
    response.set("Access-Control-Allow-Origin", "http://localhost:19006"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
    response.set("Access-Control-Allow-Methods", "GET");
    response.status(204).send("");
    return;
  }

  if (!authenticated) {
    response.status(401).end();
    return;
  }

  if (token) {
    const cookies = new Cookies(request, response);
    cookies.set("token", JSON.stringify(token), {
      expires: new Date(token.expiry_date ?? 0),
      httpOnly: true,
    });
  }

  const result = await getFreeBusy(request, response, auth);

  response.status(200).send(result);
});
