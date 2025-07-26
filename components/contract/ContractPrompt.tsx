export default function ContractPrompt({ prompt }: { prompt: string }) {
  if (!prompt) return null;

  return (
    <div className="mb-6 p-4 bg-accent/30 rounded-lg border text-sm italic text-muted-foreground">
      “{prompt}”
    </div>
  );
}
