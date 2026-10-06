import styles from "./BookingCard.module.css";

export type BookingCardProps = {
  desk: string;
  floor: string;
  date: string;
  active: boolean;
};

type BookingCardComponentProps = BookingCardProps & {
  onClick: () => void;
};

export default function BookingCard({
  desk,
  floor,
  date,
  active,
  onClick,
}: BookingCardComponentProps) {
  return (
    <article
      className={styles.card}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
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
    </article>
  );
}
