"use client";

import { useState, type FormEvent } from "react";
import type { BookingCardProps } from "./BookingCard";
import styles from "./RegistrationForm.module.css";

type BookingField = "desk" | "floor" | "date";
type BookingErrors = Partial<Record<BookingField, string>>;

type RegistrationFormProps = {
  onAddBooking: (booking: BookingCardProps) => void;
};

export default function RegistrationForm({
  onAddBooking,
}: RegistrationFormProps) {
  const [errors, setErrors] = useState<BookingErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const desk = formData.get("desk");
    const floor = formData.get("floor");
    const date = formData.get("date");
    const nextErrors: BookingErrors = {};

    if (typeof desk !== "string" || !desk.trim()) {
      nextErrors.desk = "Enter a desk name, such as A-12.";
    }
    if (typeof floor !== "string" || !floor.trim()) {
      nextErrors.floor = "Enter the floor number.";
    }
    if (typeof date !== "string" || !date) {
      nextErrors.date = "Choose a booking date.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = (["desk", "floor", "date"] as const).find(
        (field) => nextErrors[field],
      );
      if (firstInvalidField) {
        document.getElementById(`booking-${firstInvalidField}`)?.focus();
      }
      return;
    }

    if (
      typeof desk !== "string" ||
      typeof floor !== "string" ||
      typeof date !== "string"
    ) {
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric", year: "numeric" },
    );

    onAddBooking({
      desk: desk.trim(),
      floor: floor.trim(),
      date: formattedDate,
      active: true,
    });
    event.currentTarget.reset();
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add a desk booking</h2>
      {Object.keys(errors).length > 0 && (
        <p className={styles.errorSummary} role="alert">
          Please correct the highlighted fields before adding the booking.
        </p>
      )}
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="booking-desk">Desk</label>
          <input
            id="booking-desk"
            name="desk"
            type="text"
            placeholder="e.g. A-12"
            aria-required="true"
            aria-invalid={Boolean(errors.desk)}
            aria-describedby={errors.desk ? "booking-desk-error" : undefined}
            onChange={() =>
              setErrors((current) => ({ ...current, desk: undefined }))
            }
          />
          {errors.desk && (
            <span className={styles.fieldError} id="booking-desk-error">
              {errors.desk}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-floor">Floor</label>
          <input
            id="booking-floor"
            name="floor"
            type="text"
            placeholder="e.g. 2"
            aria-required="true"
            aria-invalid={Boolean(errors.floor)}
            aria-describedby={errors.floor ? "booking-floor-error" : undefined}
            onChange={() =>
              setErrors((current) => ({ ...current, floor: undefined }))
            }
          />
          {errors.floor && (
            <span className={styles.fieldError} id="booking-floor-error">
              {errors.floor}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-date">Date</label>
          <input
            id="booking-date"
            name="date"
            type="date"
            aria-required="true"
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "booking-date-error" : undefined}
            onChange={() =>
              setErrors((current) => ({ ...current, date: undefined }))
            }
          />
          {errors.date && (
            <span className={styles.fieldError} id="booking-date-error">
              {errors.date}
            </span>
          )}
        </div>
        <button className={styles.submitButton} type="submit">
          Add booking
        </button>
      </div>
    </form>
  );
}
