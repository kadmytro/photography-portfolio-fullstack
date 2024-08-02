import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import { Contact } from "../../../shared/types/Contact";
import LoadingWheel from "../components/LoadingWheel";

const ContactsForm: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [changedContacts, setChangedContacts] = useState<Contact[]>([]);
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

    try {
      await api.put("/api/admin/contacts/put", changedContacts, {
        withCredentials: true,
      });
      alert("Contacts updated successfully!");
      setChangedContacts([]);
    } catch (error) {
      console.error("Failed to update contacts:", error);
      alert("Failed to update contacts");
    }
  };

  if (loading) {
    return <LoadingWheel />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white text-black rounded shadow min-w-fit max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8">
        {contacts.map((contact, index) => (
          <div
            key={contact.type}
            className="mb-6 min-w-400px max-w-xl w-full mx-auto"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-600 border-b-2">
              {contact.label}
            </h3>
            <div className="mb-4">
              <label
                htmlFor={`label-${contact.type}`}
                className="block text-gray-700 font-bold mb-1"
              >
                Label:
              </label>
              <input
                type="text"
                id={`label-${contact.type}`}
                value={
                  changedContacts.find((c) => c.type === contact.type)?.label
                }
                onChange={(e) => handleChange(index, "label", e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline ${
                  changedContacts.some(
                    (changed) =>
                      changed.type === contact.type &&
                      changed.label != contact.label
                  )
                    ? "border-yellow-500 bg-yellow-100"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor={`value-${contact.type}`}
                className="block text-gray-700 font-bold mb-1"
              >
                Value:
              </label>
              <input
                type="text"
                id={`value-${contact.type}`}
                value={
                  changedContacts.find((c) => c.type === contact.type)?.value
                }
                onChange={(e) => handleChange(index, "value", e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline ${
                  changedContacts.some(
                    (changed) =>
                      changed.type === contact.type &&
                      changed.value != contact.value
                  )
                    ? "border-yellow-500 bg-yellow-100"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor={`displayValue-${contact.type}`}
                className="block text-gray-700 font-bold mb-1"
              >
                Display Value:
              </label>
              <input
                type="text"
                id={`displayValue-${contact.type}`}
                value={
                  changedContacts.find((c) => c.type === contact.type)
                    ?.displayValue
                }
                onChange={(e) =>
                  handleChange(index, "displayValue", e.target.value)
                }
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline ${
                  changedContacts.some(
                    (changed) =>
                      changed.type === contact.type &&
                      changed.displayValue != contact.displayValue
                  )
                    ? "border-yellow-500 bg-yellow-100"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full items-center text-center">
        <button
          type="submit"
          disabled={!user}
          className={`min-w-300px max-w-400px py-2 px-4 font-bold text-white rounded ${
            user
              ? "bg-blue-500 hover:bg-blue-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Update Contacts
        </button>
      </div>
    </form>
  );
};

export default ContactsForm;
