import Chat from "../components/chat";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <header className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Pandit AI</h1>
        <p className="text-muted-foreground">
          Your spiritual companion powered by AI
        </p>
      </header>
      <main className="w-full">
        <Chat />
      </main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Pandit AI © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
