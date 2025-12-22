import { useAppStore } from "../../globals/useAppStore";
import { useChatsStore } from "../../globals/useChatsStore";
import ChatIcon from "../../icons/ChatIcon";
import SettingsIcon from "../../icons/SettingsIcon";
import UserIcon from "../../icons/UserIcon";
import Icon from "../Icon/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import MediaDialog from "../MediaDialog/MediaDialog";

const Header = () => {
  const tab = useAppStore((state) => state.tab);
  const setTab = useAppStore((state) => state.setTab);
  const setChatTab = useChatsStore((state) => state.setChatTab);

  const handleChats = () => {
    setChatTab("chats");
    setTab("chats");
  };

  return (
    <header className="h-full px-3 py-2.5 grid justify-center content-between items-center gap-4 bg-secondary">
      <Tooltip>
        <TooltipTrigger>
          <Icon onClick={handleChats} active={tab === "chats"}>
            <ChatIcon />
          </Icon>
        </TooltipTrigger>
        <TooltipContent>Chats</TooltipContent>
      </Tooltip>
      <div className={`grid justify-center items-center gap-2`}>
        <MediaDialog />
        <Tooltip>
          <TooltipTrigger>
            <Icon
              onClick={() => setTab("settings")}
              active={tab === "settings"}
            >
              <SettingsIcon />
            </Icon>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Icon onClick={() => setTab("profile")} active={tab === "profile"}>
              <UserIcon className={`rounded-full`} />
            </Icon>
          </TooltipTrigger>
          <TooltipContent>Profile</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
