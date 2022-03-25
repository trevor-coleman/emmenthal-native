
import { OAuth2Client, Credentials } from 'google-auth-library';
import { getAuth } from './google-auth';

export default async function withAuthentication(
  req: any,
  res: any,
  fn: (
    req: any,
    res: any,
    next: (result: unknown) => any,
    auth: OAuth2Client
  ) => Promise<any>
) {
  const auth = getAuth();

  return new Promise(async (resolve, reject) => {
    if (!auth) return reject('auth is required');
    if (!req.cookies.token) {
      return reject('No auth cookie');
    }
    let tokenString: string = req.cookies.token;
    if (!tokenString.startsWith('token')) {
      return reject('Invalid token in cookie');
    }

    const token: Credentials = JSON.parse(tokenString.slice(8));
    auth.setCredentials(token);

    await fn(
      req,
      res,
      (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      },
      auth
    );
  });
}
