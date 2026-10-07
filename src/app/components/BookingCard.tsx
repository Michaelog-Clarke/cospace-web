import Link from "next/link";
import styles from "./BookingCard.module.css";

export type BookingCardProps = {
  id?: string;
  desk: string;
  floor: string;
  date: string;
  active: boolean;
};

type BookingCardComponentProps = BookingCardProps & {
  onEdit: () => void;
};

export default function BookingCard({
  id,
  desk,
  floor,
  date,
  active,
  onEdit,
}: BookingCardComponentProps) {
  return (
    <article className={styles.card}>
      {id ? (
        <Link className={styles.cardLink} href={`/bookings/${id}`}>
          <BookingCardDetails
            desk={desk}
            floor={floor}
            date={date}
            active={active}
          />
        </Link>
      ) : (
        <BookingCardDetails
          desk={desk}
          floor={floor}
          date={date}
          active={active}
        />
      )}
      <button className={styles.editButton} type="button" onClick={onEdit}>
        Edit booking
      </button>
    </article>
  );
}

function BookingCardDetails({
  desk,
  floor,
  date,
  active,
}: Omit<BookingCardProps, "id">) {
  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.desk}>Desk {desk}</h2>
        <span
          className={`${styles.status} ${active ? styles.active : styles.inactive}`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </div>
      <dl className={styles.details}>
        <div>
          <dt>Floor</dt>
          <dd>{floor}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{date}</dd>
        </div>
      </dl>
    </>
  );
}
