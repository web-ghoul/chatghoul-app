import WelcomeView from "../../components/WelcomeView/WelcomeView";
import { useChatsStore } from "../../globals/useChatsStore";
import ChatsViewSection from "./ChatsViewSection";
import NewChatViewSection from "./NewChatViewSection";
import RoomInfoSection from "./RoomInfoSection";
import RoomMediaSection from "./RoomMediaSection";
import RoomPermissionsSection from "./RoomPermissionsSection";

const ChatsSection = () => {
  const user = useChatsStore((state) => state.user);
  const chatTab = useChatsStore((state) => state.chatTab);
  const roomTab = useChatsStore((state) => state.roomTab);

  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr_30%] h-screen`}
    >
      {chatTab === "chats" ? <ChatsViewSection /> : <></>}
      {chatTab === "new_chat" ? <NewChatViewSection /> : <></>}
      {user ? <></> : <WelcomeView />}
      {roomTab === "info" ? <RoomInfoSection /> : <></>}
      {roomTab === "media" ? <RoomMediaSection /> : <></>}
      {roomTab === "permissions" ? <RoomPermissionsSection /> : <></>}
    </section>
  );
};

export default ChatsSection;
