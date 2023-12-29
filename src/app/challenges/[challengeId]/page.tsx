import ChallengePanels from "@/components/ChallengePanels";

interface ChallengePageProps {
  params: {
    challengeId: string;
  };
}

export default function ChallengePage({
  params: { challengeId },
}: ChallengePageProps) {
  return (
    <div className="flex p-10 h-screen justify-center items-center">
      <ChallengePanels />
    </div>
  );
}
