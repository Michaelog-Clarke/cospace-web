import DeskBookings from "./components/DeskBookings";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h2>Here are your desk bookings.</h2>
        </div>
        <DeskBookings />
        
      </main>
    </div>
  );
}
