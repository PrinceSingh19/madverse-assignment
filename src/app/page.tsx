import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default async function Home() {
  const session = await auth();

  console.log(session, " session ");

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="mx-auto max-w-4xl">
          <Stack spacing={2} direction="row">
            <Button variant="text">Text</Button>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
          </Stack>
        </div>
      </main>
    </HydrateClient>
  );
}
