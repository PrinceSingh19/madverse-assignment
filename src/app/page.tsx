import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  console.log(session, " session ");

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Secret Sharing Platform
            </h1>
            <p className="text-gray-300">
              Secure, temporary transmission of sensitive information
            </p>
          </header>
        </div>
      </main>
    </HydrateClient>
  );
}
