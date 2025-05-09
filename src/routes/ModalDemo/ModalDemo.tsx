import { FC, useState } from "react";
import Button from "@Components/Button";
import Modal from "@Components/Modal";
import Accordian from "@Components/Accordian";
import "./ModalDemo.css";

export const ModalDemo: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
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
    </div>
  );
};

export default ModalDemo;
