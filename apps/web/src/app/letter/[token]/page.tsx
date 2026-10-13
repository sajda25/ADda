import { LetterExperience } from "@/components/letters/LetterExperience";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function LetterPage({ params }: Props) {
  const { token } = await params;
  return <LetterExperience token={decodeURIComponent(token)} />;
}
