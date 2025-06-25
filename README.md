# Share a Secret Chit: Engineering Assignment

This is a web application built with (Next.js, React, TypeScript, tRPC, Prisma, and NextAuth.js) for the Share a Secret Chit engineering assignment.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file and add the following environment variables:
   - `DATABASE_URL="postgresql://johndoe:randompassword@ec2-35-89-202-120.us-west-2.compute.amazonaws.com:5432/shareasecretchit"`
   - `AUTH_SECRET="your-auth-secret"`
   - `AUTH_DISCORD_ID="your-discord-id"`
   - `AUTH_DISCORD_SECRET="your-discord-secret"`
4. Run `npm run dev` to start the development server
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
