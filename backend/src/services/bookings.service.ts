import axios from 'axios';
import config from '../config';
import dayjs from 'dayjs';
import Logger from '@dotfionn/logger';

const logger = new Logger('vACDM:services:booking');

let lastPull: Date | null = null;
let relevantBookings: any[] | null = null;

export async function getAllBookings() {
  const duration = dayjs().diff(dayjs(lastPull), 'minute');

  try {
    if (
      relevantBookings === null ||
      lastPull === null ||
      duration > config().eventPullInterval
    ) {
      logger.debug('Get latest Bookings');
      const events = await axios.get(config().eventUrl);
      lastPull = new Date();
      const relevantEvents = events.data.data.filter(
        (e) =>
          dayjs(new Date()) >= dayjs(e.startEvent) &&
          dayjs(new Date()) <= dayjs(e.endEvent)
      );

      relevantBookings = [];

      for (let event of relevantEvents) {
        const bookings = await axios.get(event.links.bookings);

        for (let booking of bookings.data.data) {
          relevantBookings.push(booking);
        }
      }
    }

    return relevantBookings;
  } catch (error) {
    throw error;
  }
}

export async function pilotHasBooking(cid: number): Promise<boolean> {
  try {
    const bookings = await getAllBookings();

    return bookings.findIndex((b) => b.user === cid) != -1;
  } catch (error) {
    throw error;
  }
}

export default {
  getAllBookings,
  pilotHasBooking,
};
