"use client";

import { useState } from "react";
import type { BookingCardProps } from "./BookingCard";
import BaseModal from "./BaseModal";
import styles from "./DashboardModalButton.module.css";

type DashboardModalButtonProps = {
  onAddBooking: (booking: BookingCardProps) => void;
};

export default function DashboardModalButton({
  onAddBooking,
}: DashboardModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.button}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Create booking
      </button>
      <BaseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddBooking={onAddBooking}
        ariaLabel="Create desk booking"
      />
    </>
  );
}
