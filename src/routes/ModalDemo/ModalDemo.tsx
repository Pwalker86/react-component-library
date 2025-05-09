import { FC, useState, useEffect, useRef } from "react";
import Button from "@Components/Button";
import Modal from "@Components/Modal";
import Accordian from "@Components/Accordian";
import "./ModalDemo.css";

export const ModalDemo: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  
  // Create a ref for a div to be used as the portal target
  const portalContainerRef = useRef<HTMLDivElement>(null);
  
  // Set up the portal target when component mounts
  useEffect(() => {
    if (portalContainerRef.current) {
      setPortalTarget(portalContainerRef.current);
    }
  }, []);
  
  return (
    <div className="ModalDemo__container">
      <h1>Modal Component</h1>
      
      <div className="ModalDemo__section">
        <h2>Default Modal (with built-in overlay and close button)</h2>
        <Button onClick={() => setShowModal(true)}>Open Default Modal</Button>
        <Modal 
          visible={showModal}
          title="Events"
          onClose={() => setShowModal(false)}
        >
          <div className="ModalDemo__content">
            <p>This modal uses the built-in overlay and close functionality</p>
            <Accordian headerText="Some Content">
              <Button
                className="ModalDemo__accordianButton"
                onClick={() => alert("Good job!")}
              >
                Click Me!
              </Button>
            </Accordian>
            <Button
              className="ModalDemo__closeButton"
              onClick={() => setShowModal(false)}
            >
              Close Modal
            </Button>
          </div>
        </Modal>
      </div>
      
      <div className="ModalDemo__section">
        <h2>Custom Modal (different size and styling)</h2>
        <Button onClick={() => setShowCustomModal(true)}>Open Custom Modal</Button>
        <Modal 
          visible={showCustomModal}
          title="Custom Modal"
          onClose={() => setShowCustomModal(false)}
          size="large"
          className="ModalDemo__customModal"
          showCloseButton={true}
        >
          <div className="ModalDemo__content">
            <h3>This is a larger modal with custom styling</h3>
            <p>It demonstrates size customization and additional features of the enhanced Modal component.</p>
            <div className="ModalDemo__grid">
              <div className="ModalDemo__gridItem">Feature 1</div>
              <div className="ModalDemo__gridItem">Feature 2</div>
              <div className="ModalDemo__gridItem">Feature 3</div>
              <div className="ModalDemo__gridItem">Feature 4</div>
            </div>
            <Button
              onClick={() => setShowCustomModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
      
      <div className="ModalDemo__section">
        <h2>Portal Modal (rendered outside normal DOM hierarchy)</h2>
        <p>
          This modal is rendered into a specific DOM element using React's portal functionality.
          Notice how it's rendered into the highlighted container below, but appears visually
          just like the other modals.
        </p>
        <Button onClick={() => setShowPortalModal(true)}>Open Portal Modal</Button>
        
        {/* Portal container with a distinct styling to make it visible */}
        <div className="ModalDemo__portalContainer" ref={portalContainerRef}>
          <p className="ModalDemo__portalLabel">
            This is a dedicated container for the portal modal.
            The modal will render here in the DOM, but appear visually centered on screen.
          </p>
        </div>
        
        {portalTarget && (
          <Modal 
            visible={showPortalModal}
            title="Portal Modal"
            onClose={() => setShowPortalModal(false)}
            size="medium"
            portalTarget={portalTarget}
          >
            <div className="ModalDemo__content">
              <h3>Modal Rendered Using Portal</h3>
              <p>
                This modal is rendered into a specific DOM element using React's portal functionality.
                Even though it's rendered into a different part of the DOM tree, it still appears
                centered on your screen with proper overlay.
              </p>
              <p>
                Portals are useful for:
              </p>
              <ul>
                <li>Avoiding z-index issues</li>
                <li>Breaking out of containers with overflow or positioning constraints</li>
                <li>Rendering modals at the root level for better accessibility</li>
              </ul>
              <Button onClick={() => setShowPortalModal(false)}>
                Close Portal Modal
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ModalDemo;
