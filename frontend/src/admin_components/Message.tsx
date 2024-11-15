import React from "react";
import { IMessage as IMessage } from "@shared/types/IMessage";

interface MessageProps {
  isSelected: boolean;
  messageObject: IMessage;
  onToggleSelect: React.MouseEventHandler<HTMLDivElement> | undefined;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  onChange: (
    fieldName: "isRead" | "isDeleted" | "isArchived" | "isForeverDeleted",
    fieldValue: boolean,
    messageIds: number[]
  ) => void;
  containerDimensions?: { width: number; height: number };
}

export const Message: React.FC<MessageProps> = ({
  messageObject,
  isSelected,
  onToggleSelect,
  onClick,
  onChange,
  containerDimensions,
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
  const maxMobileWidth = 600;
  const displayMobile = containerDimensions && containerDimensions.width < maxMobileWidth;

  return (
    <div
      className={`w-full relative mb-1 pl-14 pr-4 rounded-lg shadow hover:bg-blue-500 hover:bg-opacity-40 cursor-pointer ${
        isSelected
          ? " bg-blue-500 bg-opacity-20"
          : isRead
          ? " bg-card text-cardText"
          : " bg-gray-400 bg-opacity-30"
      } ${
        displayMobile
          ? "py-2"
          : "flex flex-inline parent_display_on_parent_hover py-4"
      }`}
      onClick={onClick}
    >
      <div className="absolute h-full top-0 left-4 content-center">
        <div data-tooltip="Select" onClick={onToggleSelect}>
          <div
            className={
              "cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all" +
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
      <div
        className="flex-1 h-6 min-w-200px overflow-hidden text-ellipsis select-text"
        style={displayMobile ? {} : { maxWidth: "calc(100% - 270px)" }}
      >
        <span className={isRead ? "" : " font-bold"}>{subject}</span> -{" "}
        <span className="opacity-70">{message}</span>
      </div>
      <div className="w-24 text-center hide_on_parent_hover">
        {new Date(date).toLocaleDateString()}
      </div>
      {!displayMobile && (
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
                "cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all " +
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
                  "cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all unarchive-icon"
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
                  "cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all archive-icon"
                }
              />
            </div>
          )}
          {isDeleted ? (
            <>
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
                    "cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all restore-icon"
                  }
                />
              </div>
              <div
                data-tooltip="Delete forever"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("isForeverDeleted", true, [id]);
                }}
                className="h-fit self-center"
              >
                <div
                  className={
                    "cursor-pointer svg-mask w-6 h-6 bg-red-600 transition-all delete-icon"
                  }
                />
              </div>
            </>
          ) : (
            <div
              data-tooltip="Move to trash"
              onClick={(e) => {
                e.stopPropagation();
                onChange("isDeleted", true, [id]);
              }}
              className="h-fit self-center"
            >
              <div
                className={
                  "cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all delete-icon"
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
