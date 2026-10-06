import { useState, type FormEvent } from "react";
import type { BookingCardProps } from "./BookingCard";
import styles from "./BookingCardOpened.module.css";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Desk
            <input
              type="text"
              value={desk}
              onChange={(event) => setDesk(event.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            Floor
            <input
              type="text"
              value={floor}
              onChange={(event) => setFloor(event.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
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