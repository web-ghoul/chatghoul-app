import { useAppStore } from "../../globals/useAppStore";
import SearchInput from "../../components/SearchInput/SearchInput";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import SettingsTitleSection from "./SettingsTitleSection";
import UserSettingsSection from "./UserSettingsSection";
import SettingsMenuList from "./SettingsMenuList";
import PrivacySettingsPanel from "./PrivacySettingsPanel";
import ChatSettingsPanel from "./ChatSettingsPanel";
import ThemeSettingsPanel from "./ThemeSettingsPanel";
import NotificationsSettingsPanel from "./NotificationsSettingsPanel";
import KeyboardShortcutsPanel from "./KeyboardShortcutsPanel";
import HelpSettingsPanel from "./HelpSettingsPanel";
import WallpaperSettingsPanel from "./WallpaperSettingsPanel";

const SettingsSection = () => {
  const settingsTab = useAppStore((state) => state.settingsTab);

  const renderMainSettings = () => (
    <>
      <SettingsHeader />
      <SearchInput />
      <div className="grid justify-stretch items-start gap-0 h-full overflow-y-auto">
        <UserSettingsSection />
        <hr className="border-secondary_light w-[calc(100%-5rem)] m-auto my-2" />
        <SettingsMenuList />
      </div>
    </>
  );

  const renderSubPanel = () => {
    switch (settingsTab) {
      case "privacy":
        return <PrivacySettingsPanel />;
      case "chats":
        return <ChatSettingsPanel />;
      case "chats-theme":
        return <ThemeSettingsPanel />;
      case "chats-wallpaper":
        return <WallpaperSettingsPanel />;
      case "notifications":
        return <NotificationsSettingsPanel />;
      case "shortcuts":
        return <KeyboardShortcutsPanel />;
      case "help":
        return <HelpSettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr] h-screen`}
    >
      <div
        className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
      >
        {settingsTab === "main" ? renderMainSettings() : renderSubPanel()}
      </div>
      <SettingsTitleSection />
    </section>
  );
};

export default SettingsSection;
