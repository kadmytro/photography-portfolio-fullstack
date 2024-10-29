import React, { useState } from "react";
import api from "../services/api";
import { ContactRequest } from "@shared/types/ContactRequest";
import Input from "../base_components/Input";
import TextArea from "../base_components/TextArea";
import Button from "../base_components/Button";
import LoadingWheel from "./LoadingWheel";

interface ContactUsFormProps {
  onFormSubmitted?: () => void;
  defaultSubject?: string;
}

const ContactUsForm: React.FC<ContactUsFormProps> = ({
  onFormSubmitted,
  defaultSubject,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [contactRequest, setContactRequest] = useState<ContactRequest>({
    subject: defaultSubject,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (contactRequest) {
      setContactRequest({ ...contactRequest, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    setError(null);

    try {
      await api.post("/api/contactUs/send", contactRequest);
      setContactRequest({});
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
      if (onFormSubmitted) {
        onFormSubmitted();
      }
      alert("Message sent!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto min-w-500px p-4 text-cardText relative"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {saving && (
        <div className="absolute z-20 inset-0 backdrop-blur-sm flex items-center justify-center">
          <LoadingWheel />
        </div>
      )}
      <Input
        name="name"
        label="Name"
        required={true}
        placeholder="Enter your name"
        value={contactRequest.name}
        onChange={handleChange}
      />
      <Input
        name="email"
        label="Email"
        type="email"
        required={true}
        placeholder="Enter your email"
        value={contactRequest.email}
        onChange={handleChange}
      />
      <Input
        name="subject"
        label="Subject"
        required={true}
        placeholder="Enter the subject"
        value={contactRequest.subject}
        onChange={handleChange}
      />
      <TextArea
        name="message"
        label="Message"
        required={true}
        placeholder="Enter your message"
        value={contactRequest.message}
        onChange={handleChange}
        className="min-h-200px"
      />
      <div className="items-center text-center w-full justify-end flex space-x-2">
        <Button type="submit" text="Send" />
      </div>
    </form>
  );
};

export default ContactUsForm;
