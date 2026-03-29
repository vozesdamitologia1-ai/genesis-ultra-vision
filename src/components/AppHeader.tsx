import { KeyRound, Mic } from "lucide-react";

const AppHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md">
    <div className="flex items-center gap-2">
      <KeyRound className="h-5 w-5 text-primary" />
      <span className="font-serif text-lg font-bold italic tracking-wide text-foreground">
        LEGADO <span className="text-muted-foreground">|</span> FLOW
      </span>
    </div>
    <button className="text-muted-foreground transition-colors hover:text-foreground">
      <Mic className="h-5 w-5" />
    </button>
  </header>
);

export default AppHeader;
