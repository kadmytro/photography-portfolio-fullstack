import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Contact } from "../../../shared/types/Contact";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import Button from "../base_components/Button";
import useResizeObserver from "../base_components/useResizeObserver";

interface ContactsFormProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const emptyContacts: Contact[] = [
  {
    type: "phone",
    label: "Phone",
    value: "",
    displayValue: "",
  },
  {
    type: "location",
    label: "Location",
    value: "",
    displayValue: "",
  },
  {
    type: "email",
    label: "Email",
    value: "",
    displayValue: "",
  },
];

const ContactsForm: React.FC<ContactsFormProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [contacts, setContacts] = useState<Contact[]>(emptyContacts);
  const [changedContacts, setChangedContacts] =
    useState<Contact[]>(emptyContacts);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [containerRef, size] = useResizeObserver();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/api/settings/contacts/");
        setContacts(response.data);
        setChangedContacts(response.data);
      } catch (error) {
        setContacts(emptyContacts);
        setChangedContacts(emptyContacts);
        setError(`Failed to fetch contacts. ${error}`);

        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch contacts:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    setError(null);
  }, [isEditing]);

  const getPopupContent = (
    message: string,
    icon: string,
    iconColor: string
  ): React.ReactNode => {
    return (
      <div className="px-4 pb-4 pt-12 min-h-200px min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <div
          className={
            "svg-mask h-20 w-20 bg-opacity-70 mx-auto absolute top-3 left-1/2 -translate-x-1/2 " +
            ` ${icon}-icon bg-${iconColor}-500`
          }
        ></div>
        <p className="max-w-md">{message}</p>
        <div className="w-80 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
          <Button
            buttonType="default"
            text="Ok"
            className="w-1/2 left-1/2 -translate-x-/2"
            onClick={closePopupCallback}
          />
        </div>
      </div>
    );
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );

    const changedContactIndex = changedContacts.findIndex(
      (contact) => contact.type === updatedContacts[index].type
    );
    if (changedContactIndex !== -1) {
      setChangedContacts(
        changedContacts.map((contact, i) =>
          i === changedContactIndex ? { ...contact, [field]: value } : contact
        )
      );
    } else {
      setChangedContacts([
        ...changedContacts,
        { ...updatedContacts[index], [field]: value },
      ]);
    }

    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    try {
      await api.put("/api/admin/contacts/put", changedContacts, {
        withCredentials: true,
      });
      setContacts(changedContacts);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to update contacts:", error);
      }
      setError("Failed to update contacts");
      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Failed to update contacts!", "error", "red"),
          "Something went wrong"
        );
      }
    } finally {
      setIsEditing(false);
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setChangedContacts(contacts);
    setIsEditing(false);
  };

  if (loading) {
    return <LoadingWheel className="flex-1" />;
  }

  const capitalize = <T extends string>(s: T) =>
    (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

  return (
    <div className="w-full min-h-full flex min-w-200px" ref={containerRef}>
      <form
        onSubmit={handleSubmit}
        className={`flex-1 px-4 py-6 bg-card text-cardText relative rounded shadow mx-auto ${
          size.width < 1080 ? "max-w-500px" : "max-w-1000px"
        }`}
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {saving && (
          <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <LoadingWheel />
          </div>
        )}
        <div className="absolute right-4 top-4 flex gap-2 z-10">
          <div data-tooltip="Edit the contacts" onClick={handleEdit}>
            <div className="cursor-pointer svg-mask edit-icon w-7 h-7 bg-cardText right-0 hover:scale-125 transition-all" />
          </div>
        </div>
        <div
          className={`grid gap-x-8 w-full ${
            size.width > 1080 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {contacts.map((contact, index) => (
            <div key={contact.type} className="mb-6 w-full mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-cardText text-opacity-60 border-cardText border-opacity-20 border-b-2">
                {capitalize(contact.type)}
              </h3>
              <Input
                label={`${capitalize(contact.type)} label`}
                id={`label-${contact.type}`}
                value={
                  changedContacts.find((c) => c.type === contact.type)?.label
                }
                onChange={(e) => handleChange(index, "label", e.target.value)}
                required={true}
                readOnly={!isEditing}
                placeholder={`e.g.: ${capitalize(contact.type)}`}
                inputClassName="mobile:w-full"
              />
              <Input
                label={`${capitalize(contact.type)} value`}
                id={`value-${contact.type}`}
                value={
                  changedContacts.find((c) => c.type === contact.type)?.value
                }
                onChange={(e) => handleChange(index, "value", e.target.value)}
                required={true}
                readOnly={!isEditing}
                placeholder={`(no ${contact.type} value)`}
                inputClassName="mobile:w-full"
              />
              <Input
                label={`${capitalize(contact.type)} display value`}
                id={`displayValue-${contact.type}`}
                value={
                  changedContacts.find((c) => c.type === contact.type)
                    ?.displayValue
                }
                onChange={(e) =>
                  handleChange(index, "displayValue", e.target.value)
                }
                required={true}
                readOnly={!isEditing}
                placeholder={`(no ${contact.type} display value)`}
                inputClassName="mobile:w-full"
              />
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="items-center text-center w-full justify-end flex space-x-2">
            <Button
              buttonType="normal"
              type="button"
              onClick={handleCancel}
              text="Cancel"
            />
            <Button type="submit" disabled={!user} text="Save" />
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactsForm;
