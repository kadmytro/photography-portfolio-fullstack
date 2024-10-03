import React, { useState } from "react";
import { IMessage as IMessage } from "@shared/types/IMessage";
import { IMessageChanges } from "@shared/types/IMessageChanges";

interface MessageProps {
  isSelected: boolean;
  messageObject: IMessage;
  onToggleSelect: React.MouseEventHandler<HTMLDivElement> | undefined;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  onChange: (
    fieldName: "isRead" | "isDeleted" | "isArchived",
    fieldValue: boolean,
    messageIds: number[]
  ) => void;
}

export const Message: React.FC<MessageProps> = ({
  messageObject,
  isSelected,
  onToggleSelect,
  onClick,
  onChange,
}) => {
  const {
    id,
    name,
    subject,
    email,
    message,
    date,
    isRead,
    isArchived,
    isDeleted,
  } = messageObject;
  return (
    <div
      className={
        "w-full relative mb-1 flex gap-2 flex-inline py-4 pl-14 pr-4 hover:pr-32 rounded-lg shadow hover:bg-blue-500 hover:bg-opacity-40 cursor-pointer parent_display_on_parent_hover " +
        (isSelected
          ? " bg-blue-500 bg-opacity-20"
          : isRead
          ? " bg-card text-cardText"
          : " bg-gray-400 bg-opacity-30")
      }
      onClick={onClick}
    >
      <div className="absolute h-full top-0 left-4 content-center">
        <div data-tooltip="Select" onClick={onToggleSelect}>
          <div
            className={
              "cursor-pointer svg-mask w-5 h-5 bg-cardText transition-all" +
              (isSelected ? " checkbox-checked-icon" : " checkbox-empty-icon")
            }
          />
        </div>
      </div>
      <div
        className={
          "w-40 h-6 overflow-hidden text-ellipsis select-text " +
          (isRead ? "" : " font-bold")
        }
      >
        {name}
      </div>
      <div className="flex-1 h-6 min-w-200px overflow-hidden text-ellipsis select-text">
        <span className={isRead ? "" : " font-bold"}>{subject}</span> -{" "}
        <span className="opacity-70">{message}</span>
      </div>
      <div className="w-24 hide_on_parent_hover">
        {new Date(date).toLocaleDateString()}
      </div>
      <div className="absolute flex h-full top-0 right-4 gap-4 content-center display_on_parent_hover">
        <div
          data-tooltip={isRead ? "Mark as unread" : "Mark as read"}
          onClick={(e) => {
            e.stopPropagation();
            onChange("isRead", !isRead, [id]);
          }}
          className="h-fit self-center"
        >
          <div
            className={
              "cursor-pointer svg-mask w-5 h-5 bg-cardText transition-all " +
              (isRead ? " message-unread-icon" : " message-read-icon")
            }
          />
        </div>
        {isDeleted ? null : isArchived ? (
          <div
            data-tooltip="Restore from Archive"
            onClick={(e) => {
              e.stopPropagation();
              onChange("isArchived", false, [id]);
            }}
            className="h-fit self-center"
          >
            <div
              className={
                "cursor-pointer svg-mask w-5 h-5 bg-cardText transition-all dearchive-icon"
              }
            />
          </div>
        ) : (
          <div
            data-tooltip="Archive"
            onClick={(e) => {
              e.stopPropagation();
              onChange("isArchived", true, [id]);
            }}
            className="h-fit self-center"
          >
            <div
              className={
                "cursor-pointer svg-mask w-5 h-5 bg-cardText transition-all archive-icon"
              }
            />
          </div>
        )}
        {isDeleted ? (
          <div
            data-tooltip="Restore"
            onClick={(e) => {
              e.stopPropagation();
              onChange("isDeleted", false, [id]);
            }}
            className="h-fit self-center"
          >
            <div
              className={
                "cursor-pointer svg-mask w-5 h-5 bg-cardText transition-all restore-icon"
              }
            />
          </div>
        ) : (
          <div
            data-tooltip="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onChange("isDeleted", true, [id]);
            }}
            className="h-fit self-center"
          >
            <div
              className={
                "cursor-pointer svg-mask w-5 h-5 bg-cardText transition-all delete-icon"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
