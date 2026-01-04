import WelcomeView from "../../components/WelcomeView/WelcomeView";
import { useChatsStore } from "../../globals/useChatsStore";
import ChatsViewSection from "./ChatsViewSection";
import NewChatViewSection from "./NewChatViewSection";
import RoomInfoSection from "./RoomInfoSection";
import RoomMediaSection from "./RoomMediaSection";
import RoomPermissionsSection from "./RoomPermissionsSection";
import RoomSearchSection from "./RoomSearchSection";
import RoomSection from "./RoomSection";
import StarredMessagesSection from "./StarredMessagesSection";
import NewGroupSection from "./NewGroupSection";

const ChatsSection = () => {
  const room = useChatsStore((state) => state.room);
  const chatTab = useChatsStore((state) => state.chatTab);
  const roomTab = useChatsStore((state) => state.roomTab);

  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr_auto] h-screen`}
    >
      {chatTab === "chats" ? <ChatsViewSection /> : <></>}
      {chatTab === "new_chat" ? <NewChatViewSection /> : <></>}
      {chatTab === "new_group" ? <NewGroupSection /> : <></>}
      {chatTab === "starred_messages" ? <StarredMessagesSection /> : <></>}
      {room ? <RoomSection /> : <WelcomeView />}
      {roomTab === "info" ? <RoomInfoSection /> : <></>}
      {roomTab === "media" ? <RoomMediaSection /> : <></>}
      {roomTab === "permissions" ? <RoomPermissionsSection /> : <></>}
      {roomTab === "search" ? <RoomSearchSection /> : <></>}
    </section>
  );
};

export default ChatsSection;
