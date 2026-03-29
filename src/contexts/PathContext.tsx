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
  const [path, setPath] = useState<PathType>("portal");
  const [loaded, setLoaded] = useState(false);

  const getPathFromLocation = (): PathType => {
    if (location.pathname.startsWith("/legado")) return "legado";
    if (location.pathname.startsWith("/flow")) return "flow";
    return "portal";
  };

  // Load persisted current_mode from Supabase on mount
  useEffect(() => {
    const loadPersistedMode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("current_mode, language")
            .eq("id", user.id)
            .single();

          if (profile?.current_mode && (profile.current_mode === "legado" || profile.current_mode === "flow")) {
            setPath(profile.current_mode as PathType);
            // Navigate to persisted path if on portal
            if (location.pathname === "/") {
              navigate(`/${profile.current_mode}`, { replace: true });
            }
          } else {
            setPath(getPathFromLocation());
          }

          // Apply persisted language
          if (profile?.language) {
            const { i18n } = await import("@/i18n");
            i18n.changeLanguage(profile.language);
          }
        } else {
          setPath(getPathFromLocation());
        }
      } catch {
        setPath(getPathFromLocation());
      }
      setLoaded(true);
    };

    loadPersistedMode();
  }, []);

  // Sync path from URL changes (after initial load)
  useEffect(() => {
    if (loaded) {
      setPath(getPathFromLocation());
    }
  }, [location.pathname, loaded]);

  const selectPath = useCallback(async (p: PathType) => {
    setPath(p);
    if (p === "portal") {
      navigate("/");
    } else {
      navigate(`/${p}`);
    }

    // Sync to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ selected_path: p, current_mode: p } as any)
        .eq("id", user.id);
    }
  }, [navigate]);

  return (
    <PathContext.Provider value={{ path, selectPath }}>
      <div className={path !== "portal" ? `theme-${path}` : ""}>{children}</div>
    </PathContext.Provider>
  );
};
