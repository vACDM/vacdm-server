import axios from 'axios';
import config from '../config';
import dayjs from 'dayjs';

export async function getAllBookings() {
  try {
    const events = await axios.get(
      config().eventUrl
    );

    const relevantEvents = events.data.data.filter((e) =>
      dayjs(new Date()) >= dayjs(e.startEvent) &&
      dayjs(new Date()) <= dayjs(e.endEvent)
    );

    const relevantBookings: any[] = [];

    for (let event of relevantEvents) {
      const bookings = await axios.get(event.links.bookings);

      for (let booking of bookings.data.data) {
        relevantBookings.push(booking);
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
  pilotHasBooking
};
