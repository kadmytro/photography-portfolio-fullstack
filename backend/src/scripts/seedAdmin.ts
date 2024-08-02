import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import config from '../config';

const seedAdmin = async () => {
    try {

        await AppDataSource.initialize();
        const userRepository = await AppDataSource.getRepository(User);
      
        // Check if admin user already exists
        const existingAdmin = await userRepository.findOne({ where: { username: config.adminUsername } });
      
        if (!existingAdmin) {
          // Hash the admin password
          const hashedPassword = await bcrypt.hash(config.adminPassword, 10);
      
          // Create and save the admin user
          const adminUser = userRepository.create({
            username: config.adminUsername,
            password: hashedPassword,
            role: 'admin',
          });
      
          await userRepository.save(adminUser);
          console.log('Admin user created');
        } else {
          console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
    await AppDataSource.destroy();
    }
};

seedAdmin().catch((error) => {
  console.error('Error seeding admin user:', error);
  process.exit(1);
});
