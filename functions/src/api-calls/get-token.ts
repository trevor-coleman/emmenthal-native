import { Credentials, OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const getToken = (
  auth: OAuth2Client,
  code: string
): Promise<Credentials | null> => {
  return new Promise((resolve, reject) => {
    auth.getToken(code, (err: any, token: Credentials | null | undefined) => {
      if (err || !token) {
        const authUrl = auth.generateAuthUrl({
          scope: SCOPES,
          access_type: 'offline',
        });

        console.log('Error:', err);
        console.log('Token:', token);

        return reject(
          `Missing or invalid code. Please visit this URL to sign in: ${authUrl}`
        );
      }
      return resolve(token ?? null);
    });
  });
};
