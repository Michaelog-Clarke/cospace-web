"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { BookingCardProps } from "./BookingCard";
import CreateBookingForm from "./CreateBookingForm";
import styles from "./BaseModal.module.css";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  onAddBooking?: (booking: BookingCardProps) => void;
  ariaLabel?: string;
};

export default function BaseModal({
  isOpen,
  onClose,
  children,
  onAddBooking,
  ariaLabel = "Modal dialog",
}: BaseModalProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const backgroundElements: Array<{
      element: HTMLElement;
      wasInert: boolean;
    }> = [];
    let currentElement: HTMLElement | null = layerRef.current;

    while (currentElement?.parentElement) {
      const parent = currentElement.parentElement;

      for (const sibling of Array.from(parent.children)) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== currentElement &&
          !backgroundElements.some(({ element }) => element === sibling)
        ) {
          backgroundElements.push({
            element: sibling,
            wasInert: sibling.inert,
          });
        }
      }

      if (parent === document.body) {
        break;
      }
      currentElement = parent;
    }

    for (const { element } of backgroundElements) {
      element.inert = true;
    }
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !layerRef.current) {
        return;
      }

      const focusableElements = Array.from(
        layerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.tabIndex >= 0 && element.getClientRects().length > 0,
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (!firstFocusable || !lastFocusable) {
        event.preventDefault();
        return;
      }

      if (
        event.shiftKey &&
        (document.activeElement === firstFocusable ||
          !layerRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastFocusable ||
          !layerRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      for (const { element, wasInert } of backgroundElements) {
        element.inert = wasInert;
      }
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.layer} ref={layerRef}>
      <button
        className={styles.backdrop}
        type="button"
        tabIndex={-1}
        aria-label="Close modal"
        onClick={() => onCloseRef.current()}
      />
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          className={styles.closeButton}
          type="button"
          onClick={() => onCloseRef.current()}
        >
          Close
        </button>
        <div className={styles.content}>
          {onAddBooking ? (
            <CreateBookingForm
              onAddBooking={onAddBooking}
            />
          ) : (
            children
          )}
        </div>
      </section>
    </div>
  );
}
