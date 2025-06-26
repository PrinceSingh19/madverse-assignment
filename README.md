# Secure Secret Share

A web application for sharing sensitive information securely with automatic expiration and one-time access controls.

## Features

- Create encrypted secrets with custom expiration times
- One-time access links that self-destruct after viewing
- Password protection for additional security
- Personal dashboard to manage your secrets
- Search and filter your shared secrets

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Material-UI
- **Backend**: tRPC, Prisma ORM, NextAuth.js
- **Database**: PostgreSQL (Supabase)
- **State Management**: Zustand
- **Styling**: Material-UI + Tailwind CSS

## Quick Start

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd my-project
   npm install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your database and auth settings
   ```

3. **Database setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3001` to see the app.

## Environment Variables

Create a `.env` file with these variables:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"
DIRECT_URL="postgresql://user:pass@host:port/db"

# Authentication
AUTH_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_TRUST_HOST="true"

# Environment
NODE_ENV="development"
```

## Usage

### Creating Secrets

1. Go to the home page
2. Enter your secret message
3. Set optional password protection
4. Choose expiration time (1 hour, 24 hours, 7 days, or custom)
5. Enable one-time access if needed
6. Click "Create Secret" to get a shareable link

### Managing Secrets

- Visit `/dashboard` to see all your secrets
- Search through your secrets using the search bar
- Edit unviewed secrets (content, settings)
- Delete secrets you no longer need
- Copy secret links to share

### Viewing Secrets

- Anyone with the link can view the secret
- Password-protected secrets require the password
- One-time secrets are deleted after first view
- Expired secrets show an error message

## Architecture

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── server/             # Backend API and auth
├── stores/             # Zustand state management
├── styles/             # Global styles
└── trpc/               # tRPC client setup
```

The app uses a modern stack with server-side rendering, type-safe APIs via tRPC, and a PostgreSQL database for persistence.

## Deployment

1. **Build the app**

   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform

3. **Deploy** to your preferred platform (Vercel, Netlify, etc.)

## API Documentation

See [docs/API.md](docs/API.md) for detailed API endpoints and usage examples.
