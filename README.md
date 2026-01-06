# ⚽ 6-a-Side Football Platform

A comprehensive full-stack web application for managing football pitch bookings, teams, leagues, and community interactions. Built with modern technologies and featuring bilingual support (English/Arabic) with full RTL support.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Design System](#-design-system)
- [Contributing](#-contributing)

## ✨ Features

### Core Features

- **Pitch Management**: Browse, search, and book football pitches with advanced filtering
- **Team Management**: Create teams, manage rosters, and assign player positions
- **League System**: Create and manage leagues with automatic fixture generation and standings
- **Community**: Social feed for sharing posts, updates, and engaging with the community
- **User Profiles**: Comprehensive profiles with stats, bio, avatar, and activity history
- **Admin Panel**: Full administrative control for pitches, bookings, and user management

### Advanced Features

- **Bilingual Support**: Full English/Arabic support with RTL (Right-to-Left) layout
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live data synchronization with React Query
- **Image Uploads**: Team logos, user avatars, and post images
- **Advanced Filtering**: Search by city, type, price range, and more
- **Squad Management**: Visual pitch board for team formations
- **Games Hub**: Interactive games (Hangman, Quiz) for community engagement

## 🛠 Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Client state management
- **i18next** - Internationalization
- **Lucide React** - Icon library
- **date-fns** - Date utilities

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe SQL ORM
- **PostgreSQL** - Database (via Neon Serverless)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Cookie Parser** - Cookie handling

### Development Tools

- **Concurrently** - Run multiple commands
- **Drizzle Kit** - Database migrations and studio
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** database (or Neon Serverless account)
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd football-forked
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

   This will install dependencies for:

   - Root workspace
   - Server (`server/`)
   - Client (`client/`)

3. **Set up environment variables**

   Create a `.env` file in the `server/` directory:

   ```bash
   cd server
   cp .env.example .env  # If you have an example file
   # Or create .env manually
   ```

   See [Environment Variables](#-environment-variables) section for required variables.

4. **Set up the database**

   See [Database Setup](#-database-setup) section for detailed instructions.

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment (optional)
NODE_ENV=development
```

### Generating JWT Secrets

You can generate secure random strings using:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 64
```

## 🗄 Database Setup

### 1. Create Database

Create a PostgreSQL database (or use Neon Serverless):

```sql
CREATE DATABASE football_platform;
```

### 2. Run Migrations

```bash
cd server
npm run db:migrate
```

This will:

- Create all necessary tables
- Set up relationships
- Create indexes

### 3. (Optional) Seed Database

Populate the database with sample data:

```bash
npm run db:seed
```

### 4. (Optional) Open Drizzle Studio

View and manage your database with Drizzle Studio:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` (default port).

### Database Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Run pending migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio

## ▶ Running the Project

### Development Mode

Run both client and server concurrently:

```bash
npm run dev
```

This will start:

- **Client**: `http://localhost:3000`
- **Server**: `http://localhost:5000`

### Run Separately

**Server only:**

```bash
npm run dev:server
```

**Client only:**

```bash
npm run dev:client
```

### Production Build

Build both client and server:

```bash
npm run build
```

**Run production server:**

```bash
cd server
npm start
```

## 📁 Project Structure

```
football-forked/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components (shadcn/ui style)
│   │   │   ├── profile/   # Profile-related components
│   │   │   └── team/      # Team-related components
│   │   ├── features/      # Feature-specific modules
│   │   │   └── games/     # Games hub feature
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   │   ├── api.ts     # API client
│   │   │   └── i18n/      # Internationalization
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   └── App.tsx       # Main app component
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── db/            # Database schema and migrations
│   │   │   ├── schema.ts  # Drizzle schema definitions
│   │   │   └── migrate.ts  # Migration runner
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── public/            # Static files (uploads)
│   ├── drizzle/           # Migration files
│   └── package.json
│
├── package.json           # Root workspace configuration
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Pitches

- `GET /api/pitches` - List all pitches (with filters)
- `GET /api/pitches/:id` - Get pitch details
- `POST /api/pitches` - Create pitch (Admin/Pitch Owner)
- `PATCH /api/pitches/:id` - Update pitch (Admin/Pitch Owner)
- `DELETE /api/pitches/:id` - Delete pitch (Admin)

### Bookings

- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Teams

- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `PATCH /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove team member
- `PATCH /api/teams/:id/squad` - Update squad positions

### Leagues

- `GET /api/leagues` - List all leagues
- `GET /api/leagues/:id` - Get league details
- `POST /api/leagues` - Create league
- `PATCH /api/leagues/:id` - Update league
- `POST /api/leagues/:id/teams` - Add team to league
- `DELETE /api/leagues/:id/teams/:teamId` - Remove team from league

### Matches

- `GET /api/matches` - List matches (with filters)
- `GET /api/matches/:id` - Get match details
- `PATCH /api/matches/:id` - Update match score/status

### Community

- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post

### Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Admin

- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id` - Update user (Admin only)

### Uploads

- `POST /api/uploads` - Upload file (image)

## 🎨 Design System

This project follows a comprehensive design system. See [DESIGN_SYSTEM_PROMPT.md](./DESIGN_SYSTEM_PROMPT.md) for complete details.

### Key Design Principles

- **Clean & Premium**: Soft colors, subtle shadows, minimal borders
- **Accessibility First**: High contrast, keyboard navigation, ARIA labels
- **Responsive**: Mobile-first approach with breakpoints
- **Bilingual**: Full RTL support for Arabic
- **Dark Mode**: Beautiful dark theme with smooth transitions

### Theme Colors

- **Primary**: Blue (`#2563EB` light / `#3B82F6` dark)
- **Background**: Soft off-white (light) / Deep gray (dark)
- **Accent**: Matches primary color
- **Success/Warning/Error**: Semantic color tokens

## 🌐 Internationalization

The application supports multiple languages:

- **English** (LTR)
- **Arabic** (RTL)

Translation files are located in `client/src/lib/i18n/locales/`.

### Adding a New Language

1. Create a new JSON file in `client/src/lib/i18n/locales/`
2. Copy the structure from `en.json`
3. Add the language to the language switcher component
4. Update the direction hook if needed

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Short-lived, stored in memory
- **Refresh Token**: Long-lived, stored in HTTP-only cookies
- **Automatic Refresh**: Tokens are automatically refreshed on expiry

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Development Tips

### Hot Reload

Both client and server support hot reload in development mode.

### Database Changes

1. Modify `server/src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated migration files
4. Run migration: `npm run db:migrate`

### Adding New Features

1. Create feature branch
2. Add database schema changes (if needed)
3. Create API routes in `server/src/routes/`
4. Create React components in `client/src/`
5. Add translations to i18n files
6. Test thoroughly

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

- **Client**: Modify `client/vite.config.ts` port
- **Server**: Set `PORT` in `.env` file

### Database Connection Issues

- Verify `DATABASE_URL` in `.env`
- Check database is running
- Ensure network access is allowed

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist build .vite`

## 📝 Scripts Reference

### Root Level

- `npm run dev` - Run both client and server
- `npm run build` - Build both for production
- `npm run install:all` - Install all dependencies

### Server

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Drizzle Studio

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code quality
- Follow the existing component patterns
- Add translations for new user-facing text
- Write clear commit messages

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better football pitch management
- Community-driven feature development

---

**Note**: This is a private project. For access or questions, please contact the project maintainers.
