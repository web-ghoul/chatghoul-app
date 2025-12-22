import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../Icon/Icon";
import { useChatsStore } from "../../globals/useChatsStore";

const NewChatHeader = () => {
  const setChatTab = useChatsStore((state) => state.setChatTab);

  return (
    <header className="flex justify-between items-center gap-4 px-5 min-h-10">
      <div className="flex justify-center items-center gap-4 text-white">
        <Icon onClick={() => setChatTab("chats")} variant="chats">
          <ArrowLeftIcon />
        </Icon>
        <h5 className="text-md font-medium">New Chat</h5>
      </div>
    </header>
  );
};

export default NewChatHeader;
