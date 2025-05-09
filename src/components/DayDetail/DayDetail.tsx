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
  // Process events and calculate overlaps
  const processedEvents = useMemo(() => {
    const eventMap: Record<string, ExtendedEventType[]> = {};
    
    // First, organize events by their start time
    events.forEach((event) => {
      if (event.time) {
        const startTime = event.time;
        if (!eventMap[startTime]) {
          eventMap[startTime] = [];
        }
        
        const colorIndex = (parseInt(event.id.charAt(0), 36) % 6) + 1; // Generate consistent color for each event
        
        eventMap[startTime].push({
          ...event,
          colorIndex,
          overlapLevel: 0 // will be updated later
        });
      }
    });
    
    // Calculate which events overlap and assign overlap levels
    for (const timeSlot in eventMap) {
      if (eventMap[timeSlot].length > 0) {
        // Sort events by length (longer events first to give them priority)
        eventMap[timeSlot].sort((a, b) => (b.length || 30) - (a.length || 30));
        
        // Check overlaps with other events and assign overlap levels
        eventMap[timeSlot].forEach((event, index) => {
          // Check if this event overlaps with any previous events
          if (index > 0) {
            const [eventHours, eventMinutes] = event.time!.split(':').map(Number);
            const eventStartMins = eventHours * 60 + eventMinutes;
            const eventEndMins = eventStartMins + (event.length || 30);
            
            // Find highest overlap level from previous events this one overlaps with
            let maxOverlapLevel = 0;
            for (let i = 0; i < index; i++) {
              const prevEvent = eventMap[timeSlot][i];
              const [prevHours, prevMinutes] = prevEvent.time!.split(':').map(Number);
              const prevStartMins = prevHours * 60 + prevMinutes;
              const prevEndMins = prevStartMins + (prevEvent.length || 30);
              
              // If events overlap
              if (eventStartMins < prevEndMins && prevStartMins < eventEndMins) {
                maxOverlapLevel = Math.max(maxOverlapLevel, prevEvent.overlapLevel || 0);
              }
            }
            
            // Assign this event an overlap level one higher than the max among overlapping events
            event.overlapLevel = (maxOverlapLevel + 1) % 4; // Keep overlap levels between 0-3
          }
        });
      }
    }
    
    // Flatten the event map into a list
    return Object.values(eventMap).flat();
  }, [events]);

  // Generate all time slots for the day
  const timeSlots = useMemo(() => {
    return generateTimeSlots();
  }, []);

  // Render time slots with hour separators
  const renderTimeSlots = () => {
    return Object.keys(timeSlots).map((timeSlot) => {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const isOnTheHour = minutes === 0;
      const topPosition = (hours * 60 + minutes) * (60 / 30); // 60px per 30min
      
      return (
        <div 
          key={`time-slot-${timeSlot}`} 
          className="DayDetail__time-slot"
          style={{ top: `${topPosition}px` }}
        >
          <div className="DayDetail__time-marker">
            {timeSlot}
          </div>
          {isOnTheHour && <div className="DayDetail__hour-separator" />}
        </div>
      );
    });
  };

  // Render events positioned according to their start time and duration
  const renderEvents = () => {
    return processedEvents.map((event) => (
      <Event 
        key={event.id} 
        event={event} 
      />
    ));
  };

  return (
    <div className="DayDetail">
      <h3 className="DayDetail__header">Events for day</h3>
      <div className="DayDetail__timeline">
        {renderTimeSlots()}
        <div className="DayDetail__events-container">
          {renderEvents()}
        </div>
      </div>
    </div>
  );
};

export default DayDetail;

interface ExtendedEventType extends EventType {
  isContinuation?: boolean;
  colorIndex?: number;
  overlapLevel?: number;
}

const Event: FC<{ event: ExtendedEventType }> = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Format the duration display
  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}min` 
      : `${hours}h`;
  };
  
  // Calculate event position and height based on time and duration
  const getEventStyle = () => {
    if (!event.time) return {};
    
    const [hours, minutes] = event.time.split(':').map(Number);
    const topPosition = (hours * 60 + minutes) * (60 / 30); // 60px per 30min
    
    // Calculate height based on duration (default 30min)
    const duration = event.length || 30;
    const height = duration * (60 / 30); // 60px per 30min
    
    return {
      top: `${topPosition}px`,
      height: `${height}px`,
      width: 'calc(100% - 30px)',
    };
  };
  
  // Determine event classes based on overlap level and color
  const getEventClasses = () => {
    const colorClass = `DayDetail__event-color-${event.colorIndex || 1}`;
    const overlapClass = event.overlapLevel ? `DayDetail__event-item--overlap-${event.overlapLevel}` : '';
    
    return `DayDetail__event-item ${colorClass} ${overlapClass}`;
  };
  
  return (
    <div 
      className={getEventClasses()}
      style={getEventStyle()}
      onClick={() => setShowModal(true)}
    >
      <div className="DayDetail__event-content">
        <div className="DayDetail__event-info">
          <h5 className="DayDetail__event-name">
            {event.name}
            {event.length && (
              <span className="DayDetail__event-duration">({formatDuration(event.length)})</span>
            )}
          </h5>
          {event.description && (
            <p className="DayDetail__event-description">
              {event.description.length > 60 
                ? `${event.description.substring(0, 60)}...` 
                : event.description}
            </p>
          )}
        </div>
      </div>
      <Modal visible={showModal} onClose={() => setShowModal(false)} size="large" showCloseButton={true}>
        <div className="DayDetail__modal-content">
          <h2>{event.name}</h2>
          <p className="DayDetail__modal-time">
            At {event.time} 
            {event.length && (
              <span> • Duration: {formatDuration(event.length)}</span>
            )}
          </p>
          <p>{event.description}</p>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};
