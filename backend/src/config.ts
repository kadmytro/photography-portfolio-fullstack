import fs from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve(`./app-config.${env}.json`);

let config: { adminUsername: string; adminPassword: string; jwtSecret: string; };

if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} else {
  throw new Error(`Configuration file not found: ${configPath}`);
}

export default config;