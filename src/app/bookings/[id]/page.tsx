import Link from "next/link";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Booking = {
  id: string;
  desk: string;
  floor: string;
  date: string;
  time: string;
  status: "Confirmed" | "Inactive";
};

const bookings: Record<string, Booking> = {
  "1": {
    id: "1",
    desk: "A-12",
    floor: "2",
    date: "October 5, 2026",
    time: "9:00 AM – 5:00 PM",
    status: "Confirmed",
  },
  "2": {
    id: "2",
    desk: "B-04",
    floor: "4",
    date: "October 6, 2026",
    time: "9:00 AM – 5:00 PM",
    status: "Inactive",
  },
  "3": {
    id: "3",
    desk: "C-18",
    floor: "1",
    date: "October 7, 2026",
    time: "9:00 AM – 5:00 PM",
    status: "Confirmed",
  },
};

export default async function BookingDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const booking = bookings[id];

  if (!booking) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <article className={styles.card}>
            <h1 className={styles.title}>Booking not found</h1>
            <p className={styles.message}>
              This desk booking does not exist or has been removed.
            </p>
            <Link className={styles.backLink} href="/">
              <span aria-hidden="true">←</span> Back to home
            </Link>
          </article>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.backLink} href="/">
          <span aria-hidden="true">←</span> Back to bookings
        </Link>

        <article className={styles.card} aria-labelledby="booking-title">
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Booking #{booking.id}</p>
              <h1 className={styles.title} id="booking-title">
                Desk {booking.desk}
              </h1>
            </div>
            <span
              className={`${styles.status} ${
                booking.status === "Confirmed"
                  ? styles.confirmed
                  : styles.inactive
              }`}
            >
              {booking.status}
            </span>
          </header>

          <dl className={styles.details}>
            <div className={styles.detail}>
              <dt>Desk</dt>
              <dd>{booking.desk}</dd>
            </div>
            <div className={styles.detail}>
              <dt>Floor</dt>
              <dd>{booking.floor}</dd>
            </div>
            <div className={styles.detail}>
              <dt>Date</dt>
              <dd>{booking.date}</dd>
            </div>
            <div className={styles.detail}>
              <dt>Time</dt>
              <dd>{booking.time}</dd>
            </div>
          </dl>
        </article>
      </div>
    </main>
  );
}
