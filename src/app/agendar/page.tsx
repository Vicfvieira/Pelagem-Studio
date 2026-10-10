import type { Metadata } from "next";
import { Suspense } from "react";

import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Agendar" };

async function BookingContent({ searchParams }: { searchParams: PageProps<"/agendar">["searchParams"] }) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") query.set(key, value);
  }
  const path = query.size > 0 ? `/agendar?${query}` : "/agendar";
  const user = await requireUser(path);

  return (
    <>
      <h1 className="text-3xl font-black tracking-tight">Agendar</h1>
      <p className="text-muted-foreground">
        Tudo certo, {user.name?.split(" ")[0]}! O agendamento em 5 passos chega na próxima etapa.
      </p>
    </>
  );
}

export default function BookingPage({ searchParams }: PageProps<"/agendar">) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12">
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <BookingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
