import { Suspense } from "react";
import { LetterExperience } from "@/components/letters/LetterExperience";

type Props = {
  params: Promise<{ token: string }>;
};

async function LetterBody({ params }: Props) {
  const { token } = await params;
  return <LetterExperience token={decodeURIComponent(token)} />;
}

export default function LetterPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-full w-full max-w-lg items-center justify-center px-5 py-16">
          <p className="text-sm text-ink-muted">Opening letter…</p>
        </main>
      }
    >
      <LetterBody params={params} />
    </Suspense>
  );
}
