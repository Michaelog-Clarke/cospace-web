"use client";

import { useRef, useState } from "react";
import type { BookingCardProps } from "./BookingCard";
import styles from "./BookingsTable.module.css";
import DashboardModalButton from "./DashboardModalButton";

type BookingStatus = "Confirmed" | "Inactive";

type Booking = {
  id: string;
  desk: string;
  floor: string;
  date: string;
  status: BookingStatus;
};

const mockBookings: Booking[] = [
  {
    id: "1",
    desk: "A-12",
    floor: "2",
    date: "October 5, 2026",
    status: "Confirmed",
  },
  {
    id: "2",
    desk: "B-04",
    floor: "4",
    date: "October 6, 2026",
    status: "Inactive",
  },
  {
    id: "3",
    desk: "C-18",
    floor: "1",
    date: "October 7, 2026",
    status: "Confirmed",
  },
];

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const nextBookingId = useRef(mockBookings.length + 1);

  function addBooking(booking: BookingCardProps) {
    setBookings((currentBookings) => [
      ...currentBookings,
      {
        id: String(nextBookingId.current++),
        desk: booking.desk,
        floor: booking.floor,
        date: booking.date,
        status: booking.active ? "Confirmed" : "Inactive",
      },
    ]);
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.toolbar}>
        <p className={styles.toolbarMessage}>Your current reservations</p>
        <DashboardModalButton onAddBooking={addBooking} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.caption}>Desk bookings</caption>
          <thead>
            <tr>
              <th scope="col">Desk</th>
              <th scope="col">Floor</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.desk}</td>
                <td>{booking.floor}</td>
                <td>{booking.date}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
