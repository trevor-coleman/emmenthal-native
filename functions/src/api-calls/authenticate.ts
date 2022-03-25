import {getAuth} from "./google-auth";
import {Credentials, OAuth2Client} from "google-auth-library";
import cookie from "cookie";


export function authenticate(
    req:any, res:any
): Promise<{
  auth: OAuth2Client;
  authenticated: boolean;
  token?: Credentials | null;
}> {
  const auth = getAuth();
  console.log("authenticating");

  return new Promise((resolve) => {
    console.log("starting authenticate Promise");
    let tokenString: string;
    if (!req || !res) return resolve({auth, authenticated: false});
    if ("cookies" in req) {
      tokenString = req?.cookies?.token ?? null;
    } else {
      const cookieString = req.headers.cookie;
      const cookies = cookieString ? cookie.parse(cookieString) : {};
      tokenString = cookies.token ?? null;
    }

    if (tokenString?.startsWith("token")) tokenString = tokenString.slice(8);

    const token: Credentials = JSON.parse(tokenString);
    if (token === null) {
      return resolve({auth, authenticated: false});
    }

    try {
      console.log("setting authenticate credentials");
      auth.setCredentials(token);
      return resolve({auth, authenticated: true, token});
    } catch (e) {
      console.log(e);
      return resolve({auth, authenticated: false});
    }
  });
}
