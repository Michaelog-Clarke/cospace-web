import { useState, type FormEvent } from "react";
import type { BookingCardProps } from "./BookingCard";
import styles from "./BookingCardOpened.module.css";

type BookingField = "desk" | "floor" | "date";
type BookingErrors = Partial<Record<BookingField, string>>;

type BookingCardOpenedProps = {
  booking: BookingCardProps;
  onClose: () => void;
  onSave: (booking: BookingCardProps) => void;
};

function toDateInputValue(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDisplayDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingCardOpened({
  booking,
  onClose,
  onSave,
}: BookingCardOpenedProps) {
  const [desk, setDesk] = useState(booking.desk);
  const [floor, setFloor] = useState(booking.floor);
  const [date, setDate] = useState(toDateInputValue(booking.date));
  const [active, setActive] = useState(booking.active);
  const [errors, setErrors] = useState<BookingErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: BookingErrors = {};
    if (!desk.trim()) {
      nextErrors.desk = "Enter a desk name, such as A-12.";
    }
    if (!floor.trim()) {
      nextErrors.floor = "Enter the floor number.";
    }
    if (!date) {
      nextErrors.date = "Choose a booking date.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = (["desk", "floor", "date"] as const).find(
        (field) => nextErrors[field],
      );
      if (firstInvalidField) {
        document.getElementById(`edit-booking-${firstInvalidField}`)?.focus();
      }
      return;
    }

    onSave({
      ...booking,
      desk: desk.trim(),
      floor: floor.trim(),
      date: toDisplayDate(date),
      active,
    });
  }

  return (
    <div className={styles.drawerLayer}>
      <button
        className={styles.backdrop}
        type="button"
        aria-label="Close booking editor"
        onClick={onClose}
      />
      <aside
        className={styles.sidePanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-editor-title"
      >
        <div className={styles.panelHeader}>
          <h2 id="booking-editor-title">Edit booking</h2>
          <button className={styles.closeButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <p className={styles.errorSummary} role="alert">
              Please correct the highlighted fields before saving.
            </p>
          )}
          <label className={styles.field}>
            Desk
            <input
              id="edit-booking-desk"
              type="text"
              value={desk}
              aria-required="true"
              aria-invalid={Boolean(errors.desk)}
              aria-describedby={
                errors.desk ? "edit-booking-desk-error" : undefined
              }
              onChange={(event) => {
                setDesk(event.target.value);
                setErrors((current) => ({ ...current, desk: undefined }));
              }}
            />
            {errors.desk && (
              <span className={styles.fieldError} id="edit-booking-desk-error">
                {errors.desk}
              </span>
            )}
          </label>
          <label className={styles.field}>
            Floor
            <input
              id="edit-booking-floor"
              type="text"
              value={floor}
              aria-required="true"
              aria-invalid={Boolean(errors.floor)}
              aria-describedby={
                errors.floor ? "edit-booking-floor-error" : undefined
              }
              onChange={(event) => {
                setFloor(event.target.value);
                setErrors((current) => ({ ...current, floor: undefined }));
              }}
            />
            {errors.floor && (
              <span className={styles.fieldError} id="edit-booking-floor-error">
                {errors.floor}
              </span>
            )}
          </label>
          <label className={styles.field}>
            Date
            <input
              id="edit-booking-date"
              type="date"
              value={date}
              aria-required="true"
              aria-invalid={Boolean(errors.date)}
              aria-describedby={
                errors.date ? "edit-booking-date-error" : undefined
              }
              onChange={(event) => {
                setDate(event.target.value);
                setErrors((current) => ({ ...current, date: undefined }));
              }}
            />
            {errors.date && (
              <span className={styles.fieldError} id="edit-booking-date-error">
                {errors.date}
              </span>
            )}
          </label>
          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
            Active booking
          </label>
          <button className={styles.saveButton} type="submit">
            Save edits
          </button>
        </form>
      </aside>
    </div>
  );
}