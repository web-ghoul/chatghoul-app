import { useChatsStore } from "../../globals/useChatsStore";
import AddChatIcon from "../../icons/AddChatIcon";
import Menu from "./Menu";
import Icon from "../Icon/Icon";

const ChatsHeader = () => {
  const setChatTab = useChatsStore((state) => state.setChatTab);

  return (
    <header className="flex justify-between items-center gap-4 px-5 min-h-10">
      <h1 className={`text-2xl text-white font-medium`}>ChatGhoul</h1>
      <div className="flex justify-center items-center gap-2">
        <Icon variant="chats" onClick={() => setChatTab("new_chat")}>
          <AddChatIcon className="text-white w-5 h-auto" />
        </Icon>
        <Menu />
      </div>
    </header>
  );
};

export default ChatsHeader;
