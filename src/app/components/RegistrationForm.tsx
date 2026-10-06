"use client";

import type { FormEvent } from "react";
import type { BookingCardProps } from "./BookingCard";
import styles from "./RegistrationForm.module.css";

type RegistrationFormProps = {
  onAddBooking: (booking: BookingCardProps) => void;
};

export default function RegistrationForm({
  onAddBooking,
}: RegistrationFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const desk = formData.get("desk");
    const floor = formData.get("floor");
    const date = formData.get("date");

    if (
      typeof desk !== "string" ||
      typeof floor !== "string" ||
      typeof date !== "string"
    ) {
      return;
    }

    const trimmedDesk = desk.trim();
    const trimmedFloor = floor.trim();
    if (!trimmedDesk || !trimmedFloor || !date) {
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric", year: "numeric" },
    );

    onAddBooking({
      desk: trimmedDesk,
      floor: trimmedFloor,
      date: formattedDate,
      active: true,
    });
    event.currentTarget.reset();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add a desk booking</h2>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="booking-desk">Desk</label>
          <input
            id="booking-desk"
            name="desk"
            type="text"
            placeholder="e.g. A-12"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-floor">Floor</label>
          <input
            id="booking-floor"
            name="floor"
            type="text"
            placeholder="e.g. 2"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-date">Date</label>
          <input id="booking-date" name="date" type="date" required />
        </div>
        <button className={styles.submitButton} type="submit">
          Add booking
        </button>
      </div>
    </form>
  );
}
