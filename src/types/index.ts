export type EventType = {
  id: string;
  name: string;
  date: string;
  time?: string;
  length?: number; // Length in minutes, should be a multiple of 30
  allDay?: boolean;
  description?: string;
};
