import Link from "next/link";
import BookingsTable from "./components/BookingsTable";
import DeskBookings from "./components/DeskBookings";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar} aria-label="Dashboard sidebar">
        <p className={styles.sidebarHeading}>Workspace</p>
        <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
          <Link className={styles.sidebarLink} href="/">
            <span aria-hidden="true">▦</span>
            Dashboard
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Workspace overview</p>
              <h1 className={styles.title}>Desk bookings</h1>
              <p className={styles.description}>
                Review your upcoming desk reservations.
              </p>
            </div>
          </header>

          <section className={styles.tableSection} aria-label="Booking summary">
            <BookingsTable />
          </section>

          <section className={styles.bookingSection}>
            <h2 className={styles.sectionTitle}>Manage bookings</h2>
            <DeskBookings />
          </section>
        </div>
      </main>
    </div>
  );
}
