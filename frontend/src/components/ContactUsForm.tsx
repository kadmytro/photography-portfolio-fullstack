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
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const ContactUsForm: React.FC<ContactUsFormProps> = ({
  onFormSubmitted,
  defaultSubject,
  openPopupCallback,
  closePopupCallback,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const getPopupContent = (message: string): React.ReactNode => {
    return (
      <div className="px-4 pb-4 pt-12 min-h-200px min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <div className="svg-mask success-icon h-20 w-20 bg-green-500 bg-opacity-70 mx-auto absolute top-3 left-1/2 -translate-x-1/2"></div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    setError(null);

    try {
      await api.post("/api/contactUs/send", contactRequest);
      setContactRequest({});
      if (onFormSubmitted) {
        onFormSubmitted();
      }
      if (openPopupCallback) {
        openPopupCallback(getPopupContent("Message sent!"), "Success!");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send the message");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-4 text-cardText relative"
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
