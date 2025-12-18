import NewChatHeader from "../../components/NewChatHeader/NewChatHeader";
import SearchInput from "../../components/SearchInput/SearchInput";
import { useChatsStore } from "../../globals/useChatsStore";
import AddUsersIcon from "../../icons/AddUsersIcon";

const NewChatViewSection = () => {
  const setChatTab = useChatsStore((state)=>state.setChatTab)

  return (
    <section
      className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
    >
      <NewChatHeader />
      <SearchInput />
      <div className="px-4 w-full">
        <button className="transition-all hover:bg-secondary rounded-lg p-4 flex justify-start items-center gap-6 w-full hover:cursor-pointer" onClick={()=>setChatTab("new_group")}>
          <div className="bg-primary p-2 text-black w-12 h-12 flex justify-center items-center rounded-full">
            <AddUsersIcon className="w-6 h-auto" />
          </div>
          <h5 className="font-medium text-white">New Group</h5>
        </button>
      </div>
    </section>
  );
};

export default NewChatViewSection;
