import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arm OCR" },
      { name: "description", content: "Arm OCR" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <h1 className="text-white text-5xl md:text-7xl font-semibold tracking-tight">
        Arm OCR
      </h1>
    </main>
  );
}
