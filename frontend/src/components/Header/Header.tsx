import { useAppStore } from "../../globals/useAppStore";
import ChatIcon from "../../icons/ChatIcon";
import MediaIcon from "../../icons/MediaIcon";
import SettingsIcon from "../../icons/SettingsIcon";
import UserIcon from "../../icons/UserIcon";
import Icon from "../Icon/Icon";

const Header = () => {
  const tab = useAppStore((state) => state.tab);
  const setTab = useAppStore((state) => state.setTab);

  return (
    <header className="h-full px-3 py-2.5 grid justify-center content-between items-center gap-4 bg-secondary">
      <div className={`grid justify-center items-center gap-2`}>
        <Icon onClick={() => setTab("chats")} active={tab === "chats"}>
          <ChatIcon
            className={`w-5 h-auto ${tab === "chats" ? "scale-95" : "scale-100"}`}
          />
        </Icon>
      </div>

      <div className={`grid justify-center items-center gap-2`}>
        <Icon onClick={() => setTab("media")} active={tab === "media"}>
          <MediaIcon className={`w-6 h-auto ${tab === "media" ? "scale-95" : "scale-100"}`} />
        </Icon>
        <Icon onClick={() => setTab("settings")} active={tab === "settings"}>
          <SettingsIcon className={`w-6 h-auto ${tab === "settings" ? "scale-95" : "scale-100"}`} />
        </Icon>
        <Icon onClick={() => setTab("profile")} active={tab === "profile"}>
          <UserIcon
            className={`rounded-full w-6 h-6 ${tab === "profile" ? "scale-95" : "scale-100"}`}
          />
        </Icon>
      </div>
    </header>
  );
};

export default Header;
