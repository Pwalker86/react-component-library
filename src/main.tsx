import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "material-icons/iconfont/material-icons.css";
import { checkOrSeedEvents } from "@Src/seeds/seed_events";
import ContactRoot, {
  loader as rootLoader,
  action as rootAction,
} from "@Routes/Contacts/ContactRoot";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "@Routes/Contacts/Contact";
import EditContact, {
  loader as editContactLoader,
  action as editAction,
} from "@Routes/Contacts/EditContact";
import { action as destroyAction } from "@Routes/Contacts/DestroyContact";
import AccordianDemo, {
  loader as AccordianDemoLoader,
} from "@Routes/Accordian/AccordianDemo";
import ButtonDemo from "@Routes/Button";
import { Home, HomeDetail } from "@Routes/Home";
import DayDetailDemo, {
  loader as DayDetailDemoLoader,
} from "@Routes/DayDetailDemo/DayDetailDemo";
import CalendarDemo, {
  loader as CalendarDemoLoader,
} from "@Routes/Calendar/CalendarDemo";
import { ModalDemo } from "@Routes/ModalDemo";
import ErrorPage from "./error-page";
import "./index.css";

// ****************** Router ******************
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/", element: <HomeDetail /> },
      {
        path: "accordian",
        element: <AccordianDemo />,
        loader: AccordianDemoLoader,
      },
      { path: "button", element: <ButtonDemo /> },
      {
        path: "calendar",
        element: <CalendarDemo />,
        loader: CalendarDemoLoader,
      },
      {
        path: "day/:dayId",
        element: <DayDetailDemo />,
        loader: DayDetailDemoLoader,
      },
      { path: "modal", element: <ModalDemo /> },
    ],
  },
  {
    path: "/contacts",
    element: <ContactRoot />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: ":contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      {
        path: ":contactId/edit",
        element: <EditContact />,
        loader: editContactLoader,
        action: editAction,
      },
      {
        path: ":contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! there was an error.</div>,
      },
    ],
  },
]);

// ****************** Seed Data ******************
checkOrSeedEvents();

// ****************** Render App ******************
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
} else {
  console.error("Root element not found");
}
