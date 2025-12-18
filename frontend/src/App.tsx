import Header from "./components/Header/Header";
import ChatsSection from "./sections/ChatsSections/ChatsSection";
import SettingsSection from "./sections/SettingsSection/SettingsSection";
import ProfileSection from "./sections/ProfileSection/ProfileSection";
import { useAppStore } from "./globals/useAppStore";
import MediaSection from "./sections/MediaSection/MediaSection";

function App() {
  const tab = useAppStore((state) => state.tab);

  return (
    <main
      className={`grid justify-stretch items-center grid-cols-[auto_1fr] h-screen bg-background`}
    >
      <Header />
      {tab === "chats" ? <ChatsSection /> : <></>}
      {tab === "media" ? <MediaSection /> : <></>}
      {tab === "settings" ? <SettingsSection /> : <></>}
      {tab === "profile" ? <ProfileSection /> : <></>}
    </main>
  );
}

export default App;
