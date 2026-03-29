import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type PathType = "portal" | "legado" | "flow";

interface PathContextValue {
  path: PathType;
  selectPath: (p: PathType) => void;
}

const PathContext = createContext<PathContextValue>({ path: "portal", selectPath: () => {} });

export const usePath = () => useContext(PathContext);

export const PathProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPathFromLocation = (): PathType => {
    if (location.pathname.startsWith("/legado")) return "legado";
    if (location.pathname.startsWith("/flow")) return "flow";
    return "portal";
  };

  const [path, setPath] = useState<PathType>(getPathFromLocation);

  useEffect(() => {
    setPath(getPathFromLocation());
  }, [location.pathname]);

  const selectPath = useCallback(async (p: PathType) => {
    setPath(p);
    if (p === "portal") {
      navigate("/");
    } else {
      navigate(`/${p}`);
      // Sync selected_path to Supabase if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ selected_path: p } as any)
          .eq("id", user.id);
      }
    }
  }, [navigate]);

  return (
    <PathContext.Provider value={{ path, selectPath }}>
      <div className={path !== "portal" ? `theme-${path}` : ""}>{children}</div>
    </PathContext.Provider>
  );
};
