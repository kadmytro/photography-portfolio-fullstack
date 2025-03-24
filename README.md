# Photographer Portfolio Website

This project is a full-stack portfolio website for a photographer, built with React, TypeScript, and Tailwind CSS for the frontend, and Node.js, Express.js, TypeORM, Postgres, and TypeScript for the backend.

## Features

- **Homepage:**
  - "About Me" section.
  - Contact information.
  - Gallery of latest works.
- **Prices Page:**
  - Displays available services and their prices.
  - Contact form, which sends messages to the admin page and the admin email.
- **Gallery Page:**
  - Photos categorized with a tab view for category selection.
  - Lazy image loading with blurred thumbnail placeholders.
  - Image optimization for various devices.
- **Admin Page (Hidden):**
  - Accessible via a hidden login page.
  - **Authentication:** Requires login credentials to access.
  - Allows content management (text, photos, categories, links, contacts, prices).
  - Displays visitor messages.
- **Backend:**
  - Node.js and Express.js for the API.
  - TypeORM for database interaction.
  - PostgreSQL database.
  - Internal messaging system.
  - Automatic email notifications for visitor messages.
- **Frontend:**
  - React and TypeScript for a robust and maintainable UI.
  - Tailwind CSS for styling.
  - Dark/light theme toggle.
  - All components are custom-built.

## Technologies

- **Frontend:**
  - React (CRA)
  - TypeScript
  - Tailwind CSS
- **Backend:**
  - Node.js
  - Express.js
  - TypeORM
  - PostgreSQL
  - TypeScript

## Future Improvements

- Add more advanced image editing features within the admin panel.
- Implement SEO optimization.
- Add a blog section.