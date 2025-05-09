import { FC, useMemo, useState } from "react";
import { EventType } from "@Types/index";
import { generateTimeSlots } from "./utils";
import Button from "@Components/Button";
import "./DayDetail.css";
import Modal, { Overlay } from "@Components/Modal";

type DayDetailProps = {
  events?: EventType[];
};

const DayDetail: FC<DayDetailProps> = ({ events = [] }) => {
  const timeSlots = useMemo(() => {
    const slots = generateTimeSlots();
    events.forEach((event) => {
      if (event.time) {
        slots[event.time].push(event);
      }
    });
    return slots;
  }, [events]);

  const renderTimeSlots = (timeSlots: Record<string, any[]> = {}) => {
    return Object.keys(timeSlots).map((timeSlot) => (
      <>
        <h4>{timeSlot}</h4>
        <ul>{renderEvents(timeSlots[timeSlot])}</ul>
      </>
    ));
  };

  const renderEvents = (timeSlot: EventType[]) => {
    return timeSlot.map((event) => {
      return <Event event={event} />;
    });
  };

  return (
    <>
      <h3>Events for day</h3>
      <hr />
      <ul className="DayDetail__event-list">{renderTimeSlots(timeSlots)}</ul>
    </>
  );
};

export default DayDetail;

const Event: FC<{ event: EventType }> = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button onClick={() => setShowModal(true)} size="small">
        Open Modal
      </Button>
      <Modal visible={showModal} onClose={() => setShowModal(false)} size="large" showCloseButton={true} >
        <div className="DayDetail__modal-content">
          <h2>{event.name}</h2>
          <p>{event.description}</p>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </div>
      </Modal>
    </>
  );
};
