"use client";

import axios from "axios";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { BookingCardProps } from "./BookingCard";
import styles from "./RegistrationForm.module.css";

type BookingField = "desk" | "floor" | "date";
type BookingErrors = Partial<Record<BookingField, string>>;

type CreateBookingFormProps = {
  onAddBooking: (booking: BookingCardProps) => void | Promise<void>;
};

function validateBooking(desk: string, floor: string, date: string): BookingErrors {
  const errors: BookingErrors = {};

  if (desk.trim().length < 3) {
    errors.desk = "Desk name must be at least 3 characters long.";
  }
  if (floor.trim().length < 5) {
    errors.floor = "Floor must be at least 5 characters long.";
  }

  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!dateParts) {
    errors.date = "Enter a valid date that is today or later.";
    return errors;
  }

  const year = Number(dateParts[1]);
  const month = Number(dateParts[2]);
  const day = Number(dateParts[3]);
  const isLeapYear =
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];

  if (
    year < 1 ||
    !daysInMonth ||
    day < 1 ||
    day > daysInMonth
  ) {
    errors.date = "Enter a valid date that is today or later.";
    return errors;
  }

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (date < todayString) {
    errors.date = "Date cannot be in the past.";
  }

  return errors;
}

export default function CreateBookingForm({
  onAddBooking,
}: CreateBookingFormProps) {
  const [desk, setDesk] = useState("");
  const [floor, setFloor] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const submissionInProgress = useRef(false);
  const shouldFocusFirstError = useRef(false);
  const successMessageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!shouldFocusFirstError.current) {
      return;
    }

    const firstInvalidField = (["desk", "floor", "date"] as const).find(
      (field) => errors[field],
    );
    if (firstInvalidField) {
      document.getElementById(`booking-${firstInvalidField}`)?.focus();
    }
    shouldFocusFirstError.current = false;
  }, [errors]);

  useEffect(() => {
    if (successMessage) {
      successMessageRef.current?.focus();
    }
  }, [successMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    const nextErrors = validateBooking(desk, floor, date);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      shouldFocusFirstError.current = true;
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric", year: "numeric" },
    );

    submissionInProgress.current = true;
    setSuccessMessage("");
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await onAddBooking({
        desk: desk.trim(),
        floor: floor.trim(),
        date: formattedDate,
        active: true,
      });
      setDesk("");
      setFloor("");
      setDate("");
      setErrors({});
      setSuccessMessage("Booking created successfully.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setSubmitError(
            "We couldn't reach the bookings service. It may be offline. Check your connection and try again.",
          );
        } else if (error.response.status >= 500) {
          setSubmitError(
            "The bookings service is temporarily unavailable. Please try again shortly.",
          );
        } else {
          setSubmitError(
            "The bookings service couldn't accept this booking. Check your details and try again.",
          );
        }
      } else {
        setSubmitError("We couldn't save your booking. Please try again.");
      }
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add a desk booking</h2>
      {Object.keys(errors).length > 0 && (
        <p
          className={styles.errorSummary}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          Please correct these errors:{" "}
          {Object.values(errors)
            .filter((message): message is string => Boolean(message))
            .join(" ")}
        </p>
      )}
      {successMessage && (
        <p
          ref={successMessageRef}
          className={styles.successMessage}
          role="status"
          tabIndex={-1}
        >
          {successMessage}
        </p>
      )}
      {submitError && (
        <p className={styles.requestError} role="alert" aria-live="assertive">
          {submitError}
        </p>
      )}
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="booking-desk">Desk</label>
          <input
            className={`${styles.input} ${errors.desk ? styles.inputError : ""}`}
            id="booking-desk"
            name="desk"
            type="text"
            placeholder="e.g. A-12"
            value={desk}
            aria-required="true"
            aria-invalid={Boolean(errors.desk)}
            aria-describedby={errors.desk ? "booking-desk-error" : undefined}
            onChange={(event) => {
              setDesk(event.target.value);
              setSuccessMessage("");
              setErrors((current) => ({ ...current, desk: undefined }));
            }}
          />
          {errors.desk && (
            <span
              className={styles.fieldError}
              id="booking-desk-error"
              aria-live="polite"
            >
              {errors.desk}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-floor">Floor</label>
          <input
            className={`${styles.input} ${errors.floor ? styles.inputError : ""}`}
            id="booking-floor"
            name="floor"
            type="text"
            placeholder="e.g. 2"
            value={floor}
            aria-required="true"
            aria-invalid={Boolean(errors.floor)}
            aria-describedby={errors.floor ? "booking-floor-error" : undefined}
            onChange={(event) => {
              setFloor(event.target.value);
              setSuccessMessage("");
              setErrors((current) => ({ ...current, floor: undefined }));
            }}
          />
          {errors.floor && (
            <span
              className={styles.fieldError}
              id="booking-floor-error"
              aria-live="polite"
            >
              {errors.floor}
            </span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="booking-date">Date</label>
          <input
            className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
            id="booking-date"
            name="date"
            type="date"
            value={date}
            aria-required="true"
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "booking-date-error" : undefined}
            onChange={(event) => {
              setDate(event.target.value);
              setSuccessMessage("");
              setErrors((current) => ({ ...current, date: undefined }));
            }}
          />
          {errors.date && (
            <span
              className={styles.fieldError}
              id="booking-date-error"
              aria-live="polite"
            >
              {errors.date}
            </span>
          )}
        </div>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding booking..." : "Add booking"}
        </button>
      </div>
    </form>
  );
}
