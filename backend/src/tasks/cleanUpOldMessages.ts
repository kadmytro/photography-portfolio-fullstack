import { LessThan } from "typeorm";
import { AppDataSource } from "../data-source";
import cron from "node-cron";
import { ContactRequest } from "../entity/ContactRequest";

// Function to delete messages older than 30 days
export const cleanUpOldMessages = async () => {
  const messageRepository = AppDataSource.getRepository(ContactRequest);

  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - 30);

  try {
    const messagesToDelete = await messageRepository.find({
      where: {
        deletedDate: LessThan(dateThreshold),
        isDeleted: true,
      },
    });

    if (messagesToDelete.length > 0) {
      await messageRepository.remove(messagesToDelete);
      console.log(`${messagesToDelete.length} messages deleted.`);
    } else {
      console.log("No messages to delete.");
    }
  } catch (error) {
    console.error("Error cleaning up old messages: ", error);
  }
};
