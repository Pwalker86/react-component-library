import localforage from "localforage";
import { EventType } from "@Types/index";

let events: EventType[] = [];

let desc =
  "Lorem ipsum odor amet, consectetuer adipiscing elit. Conubia orci est convallis eget luctus posuere nisi; vehicula dignissim. Dis ridiculus molestie fermentum magnis vivamus cursus hac. Pellentesque lectus magnis sollicitudin lorem montes dignissim. Donec accumsan diam nisi mattis bibendum. Venenatis volutpat sagittis litora viverra molestie arcu. Fusce at amet suscipit ipsum commodo vitae. Libero faucibus lacinia ante urna pharetra cras aliquam. Habitant sociosqu commodo penatibus praesent augue. Molestie neque lectus facilisis scelerisque sem interdum maecenas. Finibus nulla ligula ultricies nisi ante magna placerat netus congue. Sed ut phasellus penatibus vulputate curabitur, himenaeos lorem. Enim habitasse eget mollis sodales habitant class augue. Convallis varius elementum mauris eget eget. Integer curae conubia ornare fringilla parturient; rutrum facilisi id. Taciti magnis non semper; fermentum fermentum molestie. Euismod eleifend justo lorem ligula inceptos dui dignissim?";

export const seedEvents = (events: EventType[]): void => {
  for (let i = 0; i < 10; i++) {
    for (let m = 0; m < 12; m++) {
      let id = Math.random().toString(36).substring(2, 9);
      const randomDay = Math.floor(Math.random() * (29 - 0) + 0);
      const eventDate: string = new Date(
        `2025/${m + 1}/${randomDay}`,
      ).toLocaleString();
      const dateDelimiter = ",";
      // Generate a random length that's a multiple of 30 minutes (between 30 and 180 minutes)
      const lengthOptions = [30, 60, 90, 120, 150, 180];
      const randomLengthIndex = Math.floor(Math.random() * lengthOptions.length);
      const eventLength = lengthOptions[randomLengthIndex];
      
      const event: EventType = {
        id: id,
        name: "test Event " + m,
        time:
          Math.floor(Math.random() * (24 - 1) + 1)
            .toString()
            .padStart(2, "0") + ":00",
        date: eventDate.slice(0, eventDate.indexOf(dateDelimiter)),
        description: desc,
        length: eventLength, // Adding the length property
      };
      events.push(event);
    }
  }

  localforage.setItem("events", events);
};

export const checkOrSeedEvents = (): void => {
  localforage.getItem("events").then((value) => {
    if (Array.isArray(value)) {
      console.log("events already seeded");
    } else {
      seedEvents(events);
    }
  });
};
