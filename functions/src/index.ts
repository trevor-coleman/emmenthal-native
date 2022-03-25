import * as functions from "firebase-functions";
import {authenticate} from './api-calls/authenticate'
import {google, oauth2_v2} from "googleapis";
import {getAuthUrl} from "./api-calls/google-auth";
import Cookies from 'cookies';
import {getFreeBusy} from "./api-calls/free-busy";


export const auth = functions.https.onRequest(async (request, response) => {
  console.log('auth');
    const { auth, authenticated, token } = await authenticate(request, response);

    let user: oauth2_v2.Schema$Userinfo | undefined;
    if (!authenticated) {
        response.status(401).json({ authUrl: getAuthUrl() });
        return;
    }

    if (token) {
        const cookies = new Cookies(request!, response!);
        cookies.set('token', JSON.stringify(token), {
            expires: new Date(token.expiry_date!),
            httpOnly: true,
        });

        google.options({ auth });

        try {
            const userRes = await google.oauth2('v2').userinfo.get({});
            console.log(userRes.data);
            user = userRes?.data;
        } catch (e) {
            console.log('error');
        }
    }

    response.status(200).json({ user, authUrl: getAuthUrl() });
});

export const calendars = functions.https.onRequest(async (request, response) => {
    const { auth, authenticated, token } = await authenticate(request, response);

    if (!authenticated) {
        response
            .status(401)
            .send('You do not have permission to access this resource.');
        return;
    }
    const calendar = await google.calendar({ version: 'v3', auth });

    const list = await calendar.calendarList.list();

    const primaryRes = await calendar.calendars.get({ calendarId: 'primary' });

    const { data: primary } = primaryRes;

    const {
        data: { items },
    } = list;

    if (token) {
        const cookies = new Cookies(request!, response!);
        cookies.set('token', JSON.stringify(token), {
            expires: new Date(token.expiry_date!),
            httpOnly: true,
        });
    }

    response.status(200).json({
        primary,
        calendars: items,
    });
})

export const freeBusy = functions.https.onRequest(async (request, response)=>{
    const { auth, authenticated, token } = await authenticate(request, response);

    if (!authenticated) {
        response.status(401).end();
        return;
    }

    if (token) {
        const cookies = new Cookies(request!, response!);
        cookies.set('token', JSON.stringify(token), {
            expires: new Date(token.expiry_date!),
            httpOnly: true,
        });
    }

    const result = await getFreeBusy(request, response, auth);

    response.status(200).json(result);
})