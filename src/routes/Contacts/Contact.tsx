import { FC } from "react";
import {
  Form,
  useLoaderData,
  useFetcher,
  LoaderFunction,
  ActionFunction,
} from "react-router-dom";
import { getContact, updateContact } from "./utils/contacts";
import Button from "@Components/Button";

type ContactType = {
  id: string;
  first: string;
  last: string;
  avatar: string;
  twitter: string;
  notes: string;
  favorite: boolean;
};

type ContactLoaderData = {
  contact: ContactType;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<ContactLoaderData> => {
  const contact = await getContact(params.contactId);
  return { contact };
};

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<ContactType> => {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export const Contact: FC = () => {
  const { contact } = useLoaderData() as ContactLoaderData;

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <Button type="submit" corners="rounded-square" size="small">
              Edit
            </Button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <Button type="submit" size="small">
              Delete
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

function Favorite({ contact }: { contact: ContactType }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
