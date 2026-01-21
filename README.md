# ⚽ PLAYRO LEAGUE - 6-a-Side Football Platform

A comprehensive full-stack web application for managing football pitch bookings, teams, leagues, and community interactions. Built with modern technologies and featuring bilingual support (English/Arabic) with full RTL support.

**PLAYRO LEAGUE** is a complete platform for organizing and managing 6-a-side football activities, including pitch bookings, team management, competitive leagues, community engagement, and interactive games.

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

- **Pitch Management**:

  - Browse and search football pitches with bilingual support (English/Arabic)
  - Advanced filtering by city, type (indoor/outdoor), price range
  - View pitch details with images, working hours, and availability
  - Book pitches with date and time selection
  - Manage bookings with status tracking (Pending, Confirmed, Cancelled, Completed)
  - Blocked slots management for maintenance or special events

- **Team Management**:

  - Create and manage teams with custom logos
  - Invite players and manage team rosters
  - Visual squad formation board (5-a-side or 6-a-side)
  - Drag-and-drop player positioning on pitch board
  - Team member roles (Owner, Admin, Member, Captain)
  - City-based team organization

- **League System**:

  - Create leagues with custom seasons and schedules
  - Automatic fixture generation for round-robin tournaments
  - League status management (Draft, Active, Completed)
  - Real-time standings calculation
  - Match scheduling with pitch booking integration
  - Score recording and match result tracking

- **Community Feed**:

  - Social feed for sharing posts and updates
  - Image posts with media upload
  - Like and comment system
  - City and pitch/team tagging
  - Post detail pages with full engagement features

- **User Profiles**:

  - Comprehensive user profiles with bio and avatar
  - User statistics and activity history
  - Profile customization
  - City-based user organization

- **Admin Dashboard**:
  - Modern admin panel with sidebar navigation
  - Overview dashboard with statistics
  - User management (view, edit, role assignment)
  - Team management and moderation
  - League administration
  - Pitch management (create, edit, delete)
  - Post moderation
  - Settings and configuration
  - Global search functionality
  - Collapsible sidebar with RTL support

### Advanced Features

- **Bilingual Support**:

  - Full English/Arabic support with complete translations
  - RTL (Right-to-Left) layout for Arabic
  - Language switcher in navigation
  - Bilingual pitch data (name, description, address, type)

- **Games Hub**:

  - Interactive games for community engagement
  - Available games:
    - **Quiz**: Football trivia questions
    - **Memory**: Card matching game
    - **Hangman**: Word guessing game
    - **Tic-Tac-Toe**: Classic game
    - **Guess Player**: Player identification game (coming soon)
  - Game categories and difficulty levels
  - Score tracking and game history

- **Dark Mode**:

  - Beautiful dark theme with smooth transitions
  - Theme persistence across sessions
  - Consistent design system

- **Responsive Design**:

  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly interactions
  - Responsive admin dashboard

- **Real-time Updates**:

  - Live data synchronization with React Query (TanStack Query)
  - Optimistic updates for better UX
  - Automatic cache invalidation

- **Image Uploads**:

  - Team logo uploads
  - User avatar uploads
  - Post image uploads
  - Pitch image galleries
  - Image optimization and storage

- **Advanced Filtering & Search**:

  - Search by city, type, price range
  - Global search in admin panel
  - Debounced search inputs
  - Filter persistence

- **Squad Management**:

  - Visual pitch board for team formations
  - Drag-and-drop player positioning
  - Support for 5-a-side and 6-a-side formations
  - Slot-based player assignment

- **Authentication & Security**:
  - JWT-based authentication
  - Refresh token mechanism
  - Role-based access control (User, Admin, Pitch Owner)
  - Protected routes
  - Secure password hashing with bcrypt

## 🛠 Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown Menu, Select, Tabs, Toast, Popover, Switch, Label
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **i18next & react-i18next** - Internationalization
- **Lucide React** - Icon library
- **date-fns** - Date utilities
- **@dnd-kit** - Drag and drop for squad management
  - @dnd-kit/core
  - @dnd-kit/sortable
  - @dnd-kit/utilities
- **Axios** - HTTP client
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Conditional styling

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe SQL ORM
- **PostgreSQL** - Database (via Neon Serverless)
  - @neondatabase/serverless - Neon database driver
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Cookie Parser** - Cookie handling
- **dotenv** - Environment variable management
- **tsx** - TypeScript execution for development

### Development Tools

- **Concurrently** - Run multiple commands simultaneously
- **Drizzle Kit** - Database migrations and studio
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **tsx** - TypeScript execution for scripts
- **PostCSS & Autoprefixer** - CSS processing

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
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Base UI components (shadcn/ui style)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   ├── admin/               # Admin panel components
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── AdminRoute.tsx
│   │   │   │   ├── GlobalSearch.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── ...
│   │   │   ├── profile/              # Profile-related components
│   │   │   ├── team/                 # Team-related components
│   │   │   │   ├── LogoBuilder.tsx
│   │   │   │   └── TeamLogoUpload.tsx
│   │   │   ├── playro/               # PLAYRO LEAGUE branded components
│   │   │   │   ├── MatchHeader.tsx
│   │   │   │   ├── ClubTile.tsx
│   │   │   │   ├── VenueRow.tsx
│   │   │   │   ├── LeagueRow.tsx
│   │   │   │   ├── GameRow.tsx
│   │   │   │   └── ...
│   │   │   ├── editorial/            # Editorial-style components
│   │   │   ├── royale/               # Royale game components
│   │   │   ├── stadium/              # Stadium-related components
│   │   │   ├── common/               # Common components
│   │   │   │   └── AppLoader.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── PitchBoard.tsx
│   │   │   ├── FixturesList.tsx
│   │   │   └── ...
│   │   ├── features/                 # Feature-specific modules
│   │   │   └── games/                # Games hub feature
│   │   │       ├── games/            # Individual game implementations
│   │   │       │   ├── quiz/
│   │   │       │   ├── memory/
│   │   │       │   ├── hangman/
│   │   │       │   ├── tictactoe/
│   │   │       │   └── guessPlayer/
│   │   │       ├── components/       # Shared game components
│   │   │       ├── data/              # Game data (questions, words)
│   │   │       ├── pages/             # Game pages
│   │   │       ├── registry.tsx       # Game registry
│   │   │       └── types.ts
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useDebounce.ts
│   │   │   ├── useDirection.ts
│   │   │   ├── useFilters.ts
│   │   │   └── useGlobalSearch.ts
│   │   ├── lib/                      # Utilities and helpers
│   │   │   ├── api.ts                # API client (Axios)
│   │   │   ├── avatar.ts             # Avatar utilities
│   │   │   ├── cities.ts             # City data
│   │   │   ├── formations.ts         # Squad formation data
│   │   │   ├── timeAgo.ts            # Time formatting
│   │   │   ├── utils.ts              # General utilities
│   │   │   └── i18n/                 # Internationalization
│   │   │       ├── index.ts
│   │   │       ├── locales/
│   │   │       │   ├── en.json
│   │   │       │   └── ar.json
│   │   │       └── types.ts
│   │   ├── pages/                    # Page components
│   │   │   ├── admin/                # Admin pages
│   │   │   │   ├── AdminOverview.tsx
│   │   │   │   ├── AdminUsers.tsx
│   │   │   │   ├── AdminTeams.tsx
│   │   │   │   ├── AdminLeagues.tsx
│   │   │   │   ├── AdminPitches.tsx
│   │   │   │   ├── AdminPosts.tsx
│   │   │   │   └── AdminSettings.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Pitches.tsx
│   │   │   ├── PitchDetail.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   ├── Teams.tsx
│   │   │   ├── TeamDetail.tsx
│   │   │   ├── CreateTeam.tsx
│   │   │   ├── Leagues.tsx
│   │   │   ├── LeagueDetail.tsx
│   │   │   ├── CreateLeague.tsx
│   │   │   ├── Community.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── CreatePost.tsx
│   │   │   └── Profile.tsx
│   │   ├── store/                    # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── localeStore.ts
│   │   │   └── themeStore.ts
│   │   ├── auth/                     # Auth utilities
│   │   │   └── token.ts
│   │   ├── assets/                    # Static assets
│   │   │   └── Logo.jpg
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                            # Backend Express application
│   ├── src/
│   │   ├── db/                       # Database schema and migrations
│   │   │   ├── schema.ts             # Drizzle schema definitions
│   │   │   ├── index.ts              # Database connection
│   │   │   ├── migrate.ts            # Migration runner
│   │   │   ├── seed.ts              # Database seeding
│   │   │   └── *.ts                  # Migration utilities
│   │   ├── routes/                   # API route handlers
│   │   │   ├── auth.ts              # Authentication routes
│   │   │   ├── pitches.ts           # Pitch routes
│   │   │   ├── bookings.ts          # Booking routes
│   │   │   ├── teams.ts             # Team routes
│   │   │   ├── leagues.ts           # League routes
│   │   │   ├── matches.ts           # Match routes
│   │   │   ├── posts.ts             # Post routes
│   │   │   ├── users.ts             # User routes
│   │   │   ├── admin.ts             # Admin routes
│   │   │   └── uploads.ts           # File upload routes
│   │   ├── middleware/               # Express middleware
│   │   │   └── auth.ts              # Authentication middleware
│   │   ├── utils/                    # Utility functions
│   │   │   ├── jwt.ts               # JWT utilities
│   │   │   ├── cities.ts            # City utilities
│   │   │   ├── fixtureGenerator.ts  # League fixture generation
│   │   │   └── standingsCalculator.ts # Standings calculation
│   │   └── index.ts                  # Server entry point
│   ├── public/                       # Static files (uploads)
│   │   └── uploads/                  # User-uploaded images
│   ├── drizzle/                      # Migration files
│   │   ├── meta/                     # Migration metadata
│   │   └── *.sql                     # SQL migration files
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                      # Root workspace configuration
└── README.md                         # This file
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

### Community (Posts)

- `GET /api/posts` - List all posts (with filters)
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post
- Note: Posts support likes and comments (handled via separate tables)

### Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Admin

- `GET /api/admin/stats` - Get admin statistics (users, teams, leagues, pitches, posts)
- `GET /api/admin/users` - List all users (with filters)
- `PATCH /api/admin/users/:id` - Update user (Admin only)
- `GET /api/admin/teams` - List all teams (Admin view)
- `GET /api/admin/leagues` - List all leagues (Admin view)
- `GET /api/admin/pitches` - List all pitches (Admin view)
- `GET /api/admin/posts` - List all posts (Admin view)

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

### Theme Colors (PLAYRO LEAGUE Brand)

- **Primary Blue**: `#2563EB` (light) / `#3B82F6` (dark) - Vibrant blue from logo
- **Brand Green**: Bright green accent - Arrow from logo
- **Brand Orange**: Orange accent - Curved shape from logo
- **Brand Navy**: Dark navy - Text color
- **Background**: Soft off-white (light) / Deep gray (dark)
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

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (lg, xl, 2xl)

The admin dashboard features a collapsible sidebar that adapts to screen size, with a mobile overlay menu for smaller screens.

## 🧪 Development Tips

### Hot Reload

Both client and server support hot reload in development mode:

- Client uses Vite HMR (Hot Module Replacement)
- Server uses `tsx watch` for automatic restarts

### Database Changes

1. Modify `server/src/db/schema.ts`
2. Generate migration: `cd server && npm run db:generate`
3. Review generated migration files in `server/drizzle/`
4. Run migration: `cd server && npm run db:migrate`
5. (Optional) Update seed data in `server/src/db/seed.ts`

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Add database schema changes (if needed) in `server/src/db/schema.ts`
3. Generate and run migrations
4. Create API routes in `server/src/routes/`
5. Add authentication middleware if needed
6. Create React components in `client/src/components/` or `client/src/pages/`
7. Add routes in `client/src/App.tsx`
8. Add translations to `client/src/lib/i18n/locales/en.json` and `ar.json`
9. Test thoroughly in both languages and RTL mode

### Adding a New Game

1. Create game component in `client/src/features/games/games/your-game/`
2. Register game in `client/src/features/games/registry.tsx`
3. Add translations for game title and description
4. Add game data files if needed in `client/src/features/games/data/`

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

- `npm run dev` - Start development server (with watch mode)
- `npm run build` - Build for production (TypeScript compilation)
- `npm start` - Run production server
- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Run pending migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:fix-enum` - Fix enum migrations (if needed)
- `npm run db:update-admin` - Update admin role for users

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

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **users**: User accounts with roles (USER, ADMIN, PITCH_OWNER)
- **pitches**: Football pitches with bilingual support
- **pitch_images**: Pitch image galleries
- **pitch_working_hours**: Per-day working hours for pitches
- **blocked_slots**: Blocked time slots for maintenance
- **bookings**: Pitch bookings with status tracking
- **teams**: Teams with squad formations
- **team_members**: Team membership with roles
- **leagues**: Leagues with status tracking
- **league_teams**: League-team associations
- **matches**: Match fixtures
- **match_results**: Match scores and results
- **posts**: Community posts
- **comments**: Post comments
- **post_likes**: Post likes

All tables include proper indexes, foreign keys, and cascade delete rules.

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better football pitch management
- Community-driven feature development
- PLAYRO LEAGUE branding and design system

---

**Note**: This is a private project. For access or questions, please contact the project maintainers.
