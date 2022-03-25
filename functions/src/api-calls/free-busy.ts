
import {OAuth2Client} from "google-auth-library";
import {google, calendar_v3} from "googleapis";

type FreebusyQuery = calendar_v3.Params$Resource$Freebusy$Query;
type FreebusyResponse = calendar_v3.Schema$FreeBusyResponse;
type TimePeriod = calendar_v3.Schema$TimePeriod;

export type FreeBusyResponse = Array<{ id: string; times?: TimePeriod[] }>;
export async function getFreeBusy(
    req: any,
    res: any,
    auth: OAuth2Client
) {
  const calendar = google.calendar({version: "v3", auth});

  if (req.body.calendars === undefined) {
    throw new Error("Missing Calendars");
  }

  if (req.body.interval === undefined) {
    throw new Error("Missing Calendars");
  }

  const requestCalendars = req.body.calendars;
  const interval = req.body.interval;

  if (requestCalendars.length === 0) {
    return [];
  }

  try {
    const query: FreebusyQuery = {
      requestBody: {
        items: requestCalendars,
        timeMin: interval.start,
        timeMax: interval.end,
      },
    };

    const freebusyResponse = await calendar.freebusy.query(query);

    const {calendars}: FreebusyResponse = freebusyResponse.data;

    if (!calendars) {
      return [];
    }

    const freebusy: FreeBusyResponse = [];

    Object.keys(calendars).forEach((calendarId) => {
      const {busy} = calendars[calendarId];
      freebusy.push({
        id: calendarId,
        times: busy,
      });
    });

    return freebusy;
  } catch (error: unknown) {
    console.log("Caught:", (error as Error)?.message);
    throw error;
  }
}
