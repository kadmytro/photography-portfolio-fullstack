import React, { useCallback, useEffect, useState } from "react";
import { IMessage } from "@shared/types/IMessage";
import { IMessageChanges } from "@shared/types/IMessageChanges";
import { Message } from "./Message";
import LoadingWheel from "../components/LoadingWheel";
import api from "../services/api";
import Pager from "../components/Pager";
import Button from "../base_components/Button";

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
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

export const Messages: React.FC<MessagesProps> = ({
  messagesType,
  openPopupCallback,
  closePopupCallback,
}) => {
  const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([]);
  const [initialMessages, setInitialMessages] = useState<IMessage[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessageIds, setCurrentMessageIds] = useState<number[]>([]);
  const [currentPageSelectedIds, setCurrentPageSelectedIds] = useState<
    number[]
  >([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [changes, setChanges] = useState<IMessageChanges[]>([]);
  const [prevScrollPosition, setPrevScrollPosition] = useState<number | null>(
    null
  );

  const [detailedMessage, setDetailedMessage] = useState<IMessage | null>(null);
  const [hasUnreadSelectedMessages, setHasUnreadSelectedMessages] =
    useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setCurrentPageSelectedIds(
      selectedMessageIds.filter((i) => currentMessageIds.includes(i))
    );
  }, [selectedMessageIds]);

  useEffect(() => {
    updateHasUnreadSelectedMessages();
  }, [currentPageSelectedIds]);

  useEffect(() => {
    const messagesCopy = initialMessages.map((object) => ({ ...object }));
    setMessages(messagesCopy);
    setDetailedMessage((prevDetailedMessage) =>
      prevDetailedMessage && initialMessages.includes(prevDetailedMessage)
        ? prevDetailedMessage
        : null
    );
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
      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Failed to update the messages", "error", "red"),
          "Something went wrong"
        );
      }
    }
  };

  const debouncedSyncMessageUpdates = useCallback(
    debounce(syncMessageUpdates, 2000),
    []
  );

  const markAs = (
    fieldName: "isRead" | "isDeleted" | "isArchived" | "isForeverDeleted",
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
          case "isForeverDeleted":
            m.isForeverDeleted = fieldValue;
            break;
        }
        updateMessageChanges(m);
        return m;
      });

      switch (messagesType) {
        case "regular":
          return updatedMessages.filter(
            (m) => !m.isArchived && !m.isDeleted && !m.isForeverDeleted
          );
        case "archived":
          return updatedMessages.filter(
            (m) => !m.isDeleted && m.isArchived && !m.isForeverDeleted
          );
        case "deleted":
          return updatedMessages.filter(
            (m) => m.isDeleted && !m.isForeverDeleted
          );
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
      let currentPageSelectedMessages = messages.filter((m) =>
        currentPageSelectedIds.includes(m.id)
      );
      setHasUnreadSelectedMessages(
        currentPageSelectedMessages.some((m) => !m.isRead) ?? false
      );
    });
  };

  const toggleSelect = (messageId: number) => {
    if (selectedMessageIds.includes(messageId)) {
      setSelectedMessageIds(selectedMessageIds.filter((m) => m != messageId));
    } else {
      setSelectedMessageIds((prevSelectedIds) =>
        [...prevSelectedIds, messageId].sort()
      );
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
    if (currentPageSelectedIds.length === 0) {
      return " checkbox-empty-icon";
    }

    if (deepEqual(currentMessageIds, currentPageSelectedIds)) {
      return " checkbox-checked-icon";
    }

    return " checkbox-mixed-icon";
  };

  const handleGlobalSelect = () => {
    if (currentPageSelectedIds.length == 0) {
      setSelectedMessageIds((prevSelectedIds) => [
        ...prevSelectedIds,
        ...currentMessageIds,
      ]);
    } else {
      setSelectedMessageIds((prevSelectedIds) =>
        prevSelectedIds.filter((i) => !currentMessageIds.includes(i))
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <LoadingWheel style={{ height: "calc(100vh - 250px)" }} />
      </div>
    );
  }

  const MessageContentComponent = ({
    items,
    refreshData,
    containerDimensions,
  }: {
    items: IMessage[];
    refreshData: () => void;
    containerDimensions?: { width: number; height: number };
  }) => {
    return (
      <>
        {items.map((message) => (
          <Message
            key={message.id}
            messageObject={message}
            isSelected={selectedMessageIds.includes(message.id)}
            onToggleSelect={(e) => {
              e.stopPropagation();
              toggleSelect(message.id);
            }}
            onClick={(e) => {
              markAs("isRead", true, [message.id]);
              setPrevScrollPosition(window.scrollY);
              setDetailedMessage(message);
              window.scrollTo({
                top: 0,
              });
            }}
            onChange={markAs}
            containerDimensions={containerDimensions}
          />
        ))}
      </>
    );
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col relative">
      <div className="pb-5 pt-4 px-4 narrow:px-8 border-b border-primaryText border-opacity-30 sticky top-36 w-full bg-primary z-30">
        <div className="flex gap-5 w-fit">
          {detailedMessage != null ? (
            <div
              data-tooltip="Back"
              onClick={() => {
                setDetailedMessage(null);
                setTimeout(() => {
                  if (prevScrollPosition) {
                    window.scrollTo({
                      top: prevScrollPosition,
                    });
                  }
                  setPrevScrollPosition(null);
                }, 10);
              }}
              className="mr-4"
            >
              <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all arrow-back-icon" />
            </div>
          ) : (
            <div
              data-tooltip="Select"
              onClick={handleGlobalSelect}
              className="mr-4"
            >
              <div
                className={
                  "cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all" +
                  getGlobalSelectIcon()
                }
              />
            </div>
          )}
          {!currentPageSelectedIds.length && detailedMessage == null ? (
            <div data-tooltip="Refresh" onClick={refreshMessages}>
              <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all refresh-icon" />
            </div>
          ) : null}
          {!currentPageSelectedIds.length ||
          detailedMessage ||
          messagesType == "deleted" ? null : messagesType === "regular" ? (
            <div
              data-tooltip="Archive"
              onClick={() => {
                markAs("isArchived", true, currentPageSelectedIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all archive-icon" />
            </div>
          ) : (
            <div
              data-tooltip="Restore from Archive"
              onClick={() => {
                markAs("isArchived", false, currentPageSelectedIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all unarchive-icon" />
            </div>
          )}
          {!currentPageSelectedIds.length ||
          detailedMessage ? null : messagesType == "deleted" ? (
            <>
              <div
                data-tooltip="Restore"
                onClick={() => {
                  markAs("isDeleted", false, currentPageSelectedIds);
                }}
              >
                <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all restore-icon" />
              </div>
              <div
                data-tooltip="Delete forever"
                onClick={() => {
                  markAs("isForeverDeleted", true, currentPageSelectedIds);
                }}
              >
                <div className="cursor-pointer svg-mask w-6 h-6 bg-red-600 right-0 transition-all delete-icon" />
              </div>
            </>
          ) : (
            <div
              data-tooltip="Move to trash"
              onClick={() => {
                markAs("isDeleted", true, currentPageSelectedIds);
              }}
            >
              <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all delete-icon" />
            </div>
          )}
          {currentPageSelectedIds.length && detailedMessage == null ? (
            <div
              data-tooltip={
                hasUnreadSelectedMessages ? "Mark as read" : "Mark as unread"
              }
              onClick={() => {
                markAs(
                  "isRead",
                  hasUnreadSelectedMessages,
                  currentPageSelectedIds
                );
              }}
            >
              <div
                className={
                  "cursor-pointer svg-mask w-6 h-6 bg-cardText right-0 transition-all " +
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
        <div className="bg-red-500 bg-opacity-30 w-full p-4 text-center text-primaryText text-opacity-80">
          Messages that have been in Trash more than 30 days will be
          automatically deleted
        </div>
      )}
      <div className="w-full h-full flex-1 flex flex-col gap-1 select-text ">
        {detailedMessage != null ? (
          <div className="p-4 shadow bg-card text-cardText relative">
            <h3 className="text-xl narrow:text-3xl font-semibold font-title">
              {detailedMessage.subject}
            </h3>
            <div className="text-cardText text-opacity-70">
              {new Date(detailedMessage.date).toLocaleString()}
            </div>
            <div className="text-xs align-middle mb-2 pb-3 border-b-2 border-primaryText border-opacity-20">
              <span className="font-bold text-base">
                {detailedMessage.name}
              </span>{" "}
              <a
                href={`mailto:${detailedMessage.email}`}
                className="cursor-pointer hover:underline"
              >
                {"< " + detailedMessage.email + " >"}
              </a>
            </div>
            <p className="min-h-400px p-2 narrow:p-4 wide:p-8">
              {detailedMessage.message}
            </p>
          </div>
        ) : messages.length ? (
          <Pager
            contentComponent={MessageContentComponent}
            items={messages}
            itemsPerPage={20}
            initialPage={pageIndex}
            pageChangedCallback={(page, messages) => {
              setPageIndex(page);
              const messageIds = messages.map((m) => m.id);
              setCurrentMessageIds(messageIds);
              setCurrentPageSelectedIds(
                selectedMessageIds.filter((i) => messageIds.includes(i))
              );
            }}
          />
        ) : (
          <div className="p-4 text-center border-b-1 border-primaryText border-opacity-20">
            No {messagesType !== "deleted" ? messagesType : ""} messages{""}
            {messagesType !== "deleted" ? "." : " in trash."}
          </div>
        )}
      </div>
    </div>
  );
};
