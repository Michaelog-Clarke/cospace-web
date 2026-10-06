"use client";

import { useState } from "react";
import BookingCard, { type BookingCardProps } from "./BookingCard";
import styles from "./DeskBookings.module.css";
import RegistrationForm from "./RegistrationForm";
import style from "./RegistrationForm.module.css";
import BookingCardOpened from "./BookingCardOpened";

const initialBookings: BookingCardProps[] = [
  {
    desk: "A-12",
    floor: "2",
    date: "October 5, 2026",
    active: true,
  },
  {
    desk: "B-04",
    floor: "4",
    date: "October 6, 2026",
    active: false,
  },
  {
    desk: "C-18",
    floor: "1",
    date: "October 7, 2026",
    active: true,
  },
];

export default function DeskBookings() {
  const [bookings, setBookings] = useState<BookingCardProps[]>(initialBookings);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const [selectedBooking, setSelectedBooking] =
    useState<BookingCardProps | null>(null);

  function addBooking(booking: BookingCardProps) {
    setBookings((currentBookings) => [booking, ...currentBookings]);
    setSearch("");
  }

  function saveBooking(updatedBooking: BookingCardProps) {
    if (!selectedBooking) {
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking === selectedBooking ? updatedBooking : booking,
      ),
    );
    setSelectedBooking(updatedBooking);
  }

  const visibleBookings = bookings.filter((booking) =>
    [
      booking.desk,
      booking.floor,
      booking.date,
      booking.active ? "active" : "inactive",
    ].some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
  const [showForm, setShowForm] = useState(true);

  return (
    <section className={styles.container} aria-label="Desk bookings">
      {selectedBooking && (
        <BookingCardOpened
          key={`${selectedBooking.desk}-${selectedBooking.date}`}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSave={saveBooking}
        />
      )}
      <button className={style.submitButton} onClick={() => setShowForm((shown) => !shown)}>
        {showForm ? "Close booking" : "Book Desk"}
      </button>

      {showForm && <RegistrationForm onAddBooking={addBooking} />}
      <label className={styles.searchLabel} htmlFor="booking-search">
        Search bookings
      </label>
      <input
        className={styles.searchInput}
        id="booking-search"
        type="search"
        placeholder="Search by desk, floor, date, or status"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {visibleBookings.length > 0 ? (
        <div className={styles.bookingLayout}>
          <div className={styles.bookingGrid}>
            {visibleBookings.map((booking) => (
              <BookingCard
                key={`${booking.desk}-${booking.date}`}
                {...booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.emptyMessage} role="status">
          No bookings match “{search}”.
        </p>
      )}
    </section>
  );
}
