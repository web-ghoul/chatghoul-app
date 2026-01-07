import { useEffect } from "react";
import Routers from "./routers/Routers";
import { useAuthStore } from "./globals/useAuthStore";
import userService from "./services/user.service";

function App() {
  const { user, token, setUser, isAuthenticated } = useAuthStore();
  const theme = user?.settings?.theme || "dark";

  // Fetch latest user profile and settings on mount
  useEffect(() => {
    if (isAuthenticated && token) {
      userService.getMe()
        .then(updatedUser => {
          setUser(updatedUser);
        })
        .catch(err => {
          console.error("Failed to fetch user profile:", err);
        });
    }
  }, [isAuthenticated, token, setUser]);

  // Handle Theme switching
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <Routers />
  );
}

export default App;
