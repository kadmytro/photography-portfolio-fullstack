import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import { User } from "../entity/User";

const seedAdmin = async () => {
  try {
    await AppDataSource.initialize();
    const userRepository = await AppDataSource.getRepository(User);

    // Check if admin user already exists
    const defaultUserName = process.env.DEFAULT_USER_NAME;
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD;

    if (!defaultUserName || !defaultPassword) {
      throw new Error("Default password or username not set");
    }
    const existingAdmin = await userRepository.findOne({
      where: { username: defaultUserName },
    });

    if (!existingAdmin) {
      // Hash the admin password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create and save the admin user
      const adminUser = userRepository.create({
        username: defaultUserName,
        password: hashedPassword,
        role: "admin",
      });

      await userRepository.save(adminUser);
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await AppDataSource.destroy();
  }
};

seedAdmin().catch((error) => {
  console.error("Error seeding admin user:", error);
  process.exit(1);
});
