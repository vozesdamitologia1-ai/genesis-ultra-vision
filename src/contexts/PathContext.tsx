import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type PathType = "portal" | "legado" | "flow";

interface PathContextValue {
  path: PathType;
  selectPath: (p: PathType) => void;
}

const PathContext = createContext<PathContextValue>({ path: "portal", selectPath: () => {} });

export const usePath = () => useContext(PathContext);

export const PathProvider = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState<PathType>("portal");
  const selectPath = useCallback((p: PathType) => setPath(p), []);

  return (
    <PathContext.Provider value={{ path, selectPath }}>
      <div className={path !== "portal" ? `theme-${path}` : ""}>{children}</div>
    </PathContext.Provider>
  );
};
