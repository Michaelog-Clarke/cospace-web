"use client";

import { useEffect, useRef, useState } from "react";
import api from "../../lib/api";
import BookingCard, { type BookingCardProps } from "./BookingCard";
import styles from "./DeskBookings.module.css";
import RegistrationForm from "./RegistrationForm";
import style from "./RegistrationForm.module.css";
import BookingCardOpened from "./BookingCardOpened";

type BookingResponse = {
  id: string | number;
  desk: string;
  floor: string | number;
  date: string;
  active: boolean;
};

function isBookingResponse(value: unknown): value is BookingResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    "desk" in value &&
    typeof value.desk === "string" &&
    "floor" in value &&
    (typeof value.floor === "string" || typeof value.floor === "number") &&
    "date" in value &&
    typeof value.date === "string" &&
    "active" in value &&
    typeof value.active === "boolean"
  );
}

export default function DeskBookings() {
  const [bookings, setBookings] = useState<BookingCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const [selectedBooking, setSelectedBooking] =
    useState<BookingCardProps | null>(null);
  const [showForm, setShowForm] = useState(true);
  const nextPendingId = useRef(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      try {
        const response = await fetch("http://localhost:5000/bookings", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load bookings (${response.status}).`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isBookingResponse)) {
          throw new Error("The bookings response has an invalid format.");
        }

        setBookings(
          data.map((booking) => ({
            ...booking,
            id: String(booking.id),
            floor: String(booking.floor),
          })),
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading bookings.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadBookings();

    return () => controller.abort();
  }, []);

  async function addBooking(booking: BookingCardProps) {
    const pendingId = `pending-${++nextPendingId.current}`;
    const pendingBooking = { ...booking, id: pendingId };

    setBookings((currentBookings) => [pendingBooking, ...currentBookings]);
    setSearch("");

    try {
      const response = await api.post<unknown>("/bookings", booking);

      if (!isBookingResponse(response.data)) {
        throw new Error("The saved booking response has an invalid format.");
      }

      const savedBooking = {
        ...response.data,
        id: String(response.data.id),
        floor: String(response.data.floor),
      };
      setBookings((currentBookings) =>
        currentBookings.map((currentBooking) =>
          currentBooking.id === pendingId ? savedBooking : currentBooking,
        ),
      );
    } catch (error) {
      setBookings((currentBookings) =>
        currentBookings.filter(
          (currentBooking) => currentBooking.id !== pendingId,
        ),
      );
      throw error;
    }
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
      <button
        className={style.submitButton}
        onClick={() => setShowForm((shown) => !shown)}
      >
        {showForm ? "Close booking" : "Book Desk"}
      </button>

      {showForm && <RegistrationForm onAddBooking={addBooking} />}

      {isLoading ? (
        <p className={styles.emptyMessage} role="status">
          Loading...
        </p>
      ) : loadError ? (
        <p className={styles.errorMessage} role="alert">
          {loadError}
        </p>
      ) : (
        <>
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
                    key={booking.id ?? `${booking.desk}-${booking.date}`}
                    {...booking}
                    onEdit={() => setSelectedBooking(booking)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.emptyMessage} role="status">
              No bookings match “{search}”.
            </p>
          )}
        </>
      )}
    </section>
  );
}
