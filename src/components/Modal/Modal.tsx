import React, { FC, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

export type ModalSize = "small" | "medium" | "large" | "full";

export interface ModalProps {
  children?: React.ReactNode;
  visible: boolean;
  title?: string;
  onClose?: () => void;
  size?: ModalSize;
  showCloseButton?: boolean;
  className?: string;
  withOverlay?: boolean;
  portalTarget?: HTMLElement;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

// Modal component with improved accessibility, animations, and flexibility
const Modal: FC<ModalProps> = ({
  children,
  visible,
  title,
  onClose,
  size = "medium",
  showCloseButton = true,
  className = "",
  withOverlay = true,
  portalTarget,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = ariaLabelledBy || "modal-title";
  const descId = ariaDescribedBy || "modal-description";
  
  // Handle ESC key press to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible && onClose) {
        onClose();
      }
    };

    // Handle focusing
    if (visible) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
      
      // Focus trap
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusable && focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Restore scrolling when modal closes
    };
  }, [visible, onClose]);

  // Create the modal content
  const renderModal = () => (
    <>
      {withOverlay && <Overlay visible={visible} clickHandler={onClose} />}
      <div
        className={`Modal__container Modal__size-${size} ${visible ? "Modal__visible" : "Modal__hidden"} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        ref={modalRef}
      >
        <div className="Modal__content">
          {(title || showCloseButton) && (
            <div className="Modal__header">
              {title && <h2 id={titleId} className="Modal__title">{title}</h2>}
              {showCloseButton && onClose && (
                <button 
                  className="Modal__close-button" 
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>
          )}
          <div id={descId} className="Modal__body">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // Use portal if target is provided, otherwise render inline
  if (portalTarget && typeof window !== 'undefined') {
    return ReactDOM.createPortal(
      visible ? renderModal() : null,
      portalTarget || document.body
    );
  }

  // Fallback to regular rendering if no portal target
  return visible ? renderModal() : null;
};

export interface OverlayProps {
  visible: boolean;
  clickHandler?: () => void;
  className?: string;
}

export const Overlay: FC<OverlayProps> = ({
  visible,
  clickHandler,
  className = "",
}) => {
  return (
    <div
      className={`Modal__overlay ${visible ? "Modal__visible" : "Modal__hidden"} ${className}`}
      onClick={clickHandler}
      aria-hidden="true"
    />
  );
};

export default Modal;
