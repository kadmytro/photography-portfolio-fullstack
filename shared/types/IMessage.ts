import { ContactRequest } from "./ContactRequest";

export interface IMessage extends ContactRequest {
  id: number;
  date: Date;
  isRead: boolean;
  isDeleted: boolean;
  isArchived: boolean;
}
