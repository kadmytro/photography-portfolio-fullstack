import React, { useCallback, useEffect, useState } from "react";
import { IMessage } from "@shared/types/IMessage";
import { IMessageChanges } from "@shared/types/IMessageChanges";
import { Message } from "./Message";
import LoadingWheel from "../components/LoadingWheel";
import api from "../services/api";
import Pager from "../components/Pager";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

interface MessagesProps {
  messagesType: "regular" | "archived" | "deleted";
  onTabChangeCallback?: () => void;
}

export const Messages: React.FC<MessagesProps> = ({ messagesType }) => {
  const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([]);
  const [initialMessages, setInitialMessages] = useState<IMessage[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [changes, setChanges] = useState<IMessageChanges[]>([]);

  const [detailedMessage, setDetailedMessage] = useState<IMessage | null>(null);
  const [hasUnreadSelectedMessages, setHasUnreadSelectedMessages] =
    useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    updateHasUnreadSelectedMessages();
  }, [selectedMessageIds]);

  useEffect(() => {
    const messagesCopy = initialMessages.map((object) => ({ ...object }));
    setMessages(messagesCopy);
  }, [initialMessages]);

  useEffect(() => {
    if (selectedMessageIds.length) {
      setSelectedMessageIds((prevIds) => {
        const currentMessageIds = messages.map((m) => m.id);
        return prevIds.filter((i) => currentMessageIds.includes(i));
      });
    }
  }, [messages]);

  useEffect(() => {
    debouncedSyncMessageUpdates(changes, messages);
  }, [changes]);

  useEffect(() => {
    setLoading(true);
    syncMessageUpdates(changes, messages).then(fetchMessages);
  }, [messagesType]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`api/contactUs/${messagesType}`);
      setInitialMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncMessageUpdates = async (
    changes: IMessageChanges[],
    messages: IMessage[]
  ) => {
    if (changes.length === 0) {
      return;
    }

    try {
      await api.put(`/api/contactUs/putMany`, changes);
      setInitialMessages(messages);
      setChanges([]);
    } catch (error) {
      console.error("Failed to update the messages:", error);
      alert("Failed to update the messages");
    }
  };

  const debouncedSyncMessageUpdates = useCallback(
    debounce(syncMessageUpdates, 2000),
    []
  );

  const markAs = (
    fieldName: "isRead" | "isDeleted" | "isArchived",
    fieldValue: boolean,
    messageIds: number[]
  ) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((m) => {
        if (!messageIds.includes(m.id)) {
          return m;
        }

        switch (fieldName) {
          case "isRead":
            m.isRead = fieldValue;
            break;
          case "isArchived":
            m.isArchived = fieldValue;
            break;
          case "isDeleted":
            m.isDeleted = fieldValue;
            break;
        }
        updateMessageChanges(m);
        return m;
      });

      switch (messagesType) {
        case "regular":
          return updatedMessages.filter((m) => !m.isArchived && !m.isDeleted);
        case "archived":
          return updatedMessages.filter((m) => !m.isDeleted && m.isArchived);
        case "deleted":
          return updatedMessages.filter((m) => m.isDeleted);
      }
    });
  };

  const updateMessageChanges = (message: IMessage) => {
    const originalMessage = initialMessages?.find((m) => m.id === message.id);
    if (!originalMessage) {
      return;
    }
    let messageChanges: IMessageChanges = { id: message.id };

    (Object.keys(message) as (keyof IMessage)[]).forEach((key) => {
      if (!deepEqual(originalMessage[key], message[key])) {
        messageChanges[key] = message[key];
      }
    });
    setChanges((prevChanges) => {
      let updatedChanges = prevChanges.filter(
        (c) => Object.keys(c).length > 1 && c.id != message.id
      );
      if (Object.keys(messageChanges).length > 1) {
        updatedChanges.push(messageChanges);
      }
      return updatedChanges;
    });
  };

  const refreshMessages = () => {
    setLoading(true);
    syncMessageUpdates(changes, messages).then(fetchMessages);
  };

  const updateHasUnreadSelectedMessages = () => {
    requestAnimationFrame(() => {
      let selectedMessages =
        messages && messages.filter((m) => selectedMessageIds.includes(m.id));
      setHasUnreadSelectedMessages(
        selectedMessages?.some((m) => !m.isRead) ?? false
      );
    });
  };

  const toggleSelect = (messageId: number) => {
    if (selectedMessageIds.includes(messageId)) {
      setSelectedMessageIds(selectedMessageIds.filter((m) => m != messageId));
    } else {
      let selectedMessageIdsCopy = selectedMessageIds.slice();
      selectedMessageIdsCopy.push(messageId);
      selectedMessageIdsCopy.sort();
      setSelectedMessageIds(selectedMessageIdsCopy);
    }
  };

  function deepEqual(obj1: any, obj2: any) {
    if (obj1 === obj2) return true;

    if (
      typeof obj1 == "object" &&
      typeof obj2 == "object" &&
      obj1 != null &&
      obj2 != null
    ) {
      if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

      for (let key in obj1) {
        if (!(key in obj2)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
      }

      return true;
    }

    return false;
  }

  const getGlobalSelectIcon = () => {
    if (selectedMessageIds.length === 0) {
      return " checkbox-empty-icon";
    }

    let allIds = messages!.map((m) => m.id).sort() ?? [];
    if (deepEqual(allIds, selectedMessageIds)) {
      return " checkbox-checked-icon";
    }

    return " checkbox-mixed-icon";
  };

  const handleGlobalSelect = () => {
    if (selectedMessageIds.length == 0) {
      setSelectedMessageIds(messages!.map((m) => m.id).sort() ?? []);
    } else {
      setSelectedMessageIds([]);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <LoadingWheel style={{ height: "calc(100vh - 250px)" }} />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="pb-5 px-4">
        <div className="flex gap-5 w-fit">
          {detailedMessage != null ? (
            <div
              data-tooltip="Back"
              onClick={() => {
                setDetailedMessage(null);
              }}
              className="mr-4"
            >
              <div className="cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all back-icon" />
            </div>
          ) : (
            <div
              data-tooltip="Select"
              onClick={handleGlobalSelect}
              className="mr-4"
            >
              <div
                className={
                  "cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all" +
                  getGlobalSelectIcon()
                }
              />
            </div>
          )}
          {!selectedMessageIds.length && detailedMessage == null ? (
            <div data-tooltip="Refresh" onClick={refreshMessages}>
              <div className="cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all reload-icon" />
            </div>
          ) : null}
          {!selectedMessageIds.length ||
          detailedMessage ? null : messagesType == "deleted" ? (
            <div
              data-tooltip="Restore"
              onClick={() => {
                markAs("isDeleted", false, selectedMessageIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all restore-icon" />
            </div>
          ) : (
            <div
              data-tooltip="Delete"
              onClick={() => {
                markAs("isDeleted", true, selectedMessageIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all delete-icon" />
            </div>
          )}
          {!selectedMessageIds.length ||
          detailedMessage ||
          messagesType == "deleted" ? null : messagesType === "regular" ? (
            <div
              data-tooltip="Archive"
              onClick={() => {
                markAs("isArchived", true, selectedMessageIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all archive-icon" />
            </div>
          ) : (
            <div
              data-tooltip="Restore from Archive"
              onClick={() => {
                markAs("isArchived", false, selectedMessageIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-5 h-5 bg-cardText right-0 transition-all dearchive-icon" />
            </div>
          )}
          {selectedMessageIds.length && detailedMessage == null ? (
            <div
              data-tooltip={
                hasUnreadSelectedMessages ? "Mark as read" : "Mark as unread"
              }
              onClick={() => {
                markAs("isRead", hasUnreadSelectedMessages, selectedMessageIds);
              }}
            >
              <div
                className={
                  "cursor-pointer svg-mask w-5 h-5 scale-150 bg-cardText right-0 transition-all " +
                  (hasUnreadSelectedMessages
                    ? " message-read-icon"
                    : " message-unread-icon")
                }
              />
            </div>
          ) : null}
        </div>
      </div>
      {messagesType === "deleted" && !detailedMessage && (
        <div className="bg-red-500 bg-opacity-30 w-full p-4 mb-2 text-center text-primaryText text-opacity-80">
          Messages that have been in Trash more than 30 days will be
          automatically deleted
        </div>
      )}
      <div className="w-full flex flex-col gap-1 select-text ">
        {detailedMessage != null ? (
          <div className="p-4 shadow bg-card text-cardText relative">
            <div className="absolute right-6 top-6 text-cardText text-opacity-70">
              {new Date(detailedMessage.date).toLocaleString()}
            </div>
            <h3 className="text-3xl mb-3 mr-36 font-semibold">
              {detailedMessage.subject}
            </h3>
            <div className="text-xs align-middle mb-5">
              <span className="font-bold text-base">
                {detailedMessage.name}
              </span>{" "}
              {"<" + detailedMessage.email + ">"}
            </div>
            <p className="min-h-400px">{detailedMessage.message}</p>
          </div>
        ) : messages.length ? (
          messages.map((message) => (
            <Message
              key={message.id}
              messageObject={message}
              isSelected={selectedMessageIds.includes(message.id)}
              onToggleSelect={(e) => {
                e.stopPropagation();
                toggleSelect(message.id);
              }}
              onClick={(e) => {
                setDetailedMessage(message);
                markAs("isRead", true, [message.id]);
              }}
              onChange={markAs}
            />
          ))
        ) : (
          <div className="p-4 text-center border-b-1 border-primaryText border-opacity-20">
            No {messagesType !== "deleted" ? messagesType : ""} messages{" "}
            {messagesType !== "deleted" ? "" : "in trash"}.
          </div>
        )}
      </div>
    </div>
  );
};
