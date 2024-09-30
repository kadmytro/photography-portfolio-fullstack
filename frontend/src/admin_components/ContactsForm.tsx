import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Contact } from "../../../shared/types/Contact";
import LoadingWheel from "../components/LoadingWheel";
import Input from "../base_components/Input";
import Button from "../base_components/Button";

const ContactsForm: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [changedContacts, setChangedContacts] = useState<Contact[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/api/details/contacts/");
        setContacts(response.data);
        setChangedContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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
      console.error("Failed to update contacts:", error);
      alert("Failed to update contacts");
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
    return <LoadingWheel />;
  }

  const capitalize = <T extends string>(s: T) =>
    (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-card text-cardText relative rounded shadow min-w-fit max-w-7xl mx-auto"
    >
      {saving && (
        <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <LoadingWheel />
        </div>
      )}
      <div className="absolute right-4 top-4 flex gap-2 z-10">
        <div
          className="cursor-pointer svg-mask edit-icon w-7 h-7 bg-cardText right-0 hover:scale-125 transition-all"
          onClick={handleEdit}
        ></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8">
        {contacts.map((contact, index) => (
          <div
            key={contact.type}
            className="mb-6 min-w-400px max-w-xl w-full mx-auto"
          >
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
  );
};

export default ContactsForm;
