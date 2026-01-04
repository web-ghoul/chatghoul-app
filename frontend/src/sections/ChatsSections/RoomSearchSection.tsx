import { useChatsStore } from "../../globals/useChatsStore";
import CloseIcon from "../../icons/CloseIcon";
import Icon from "../../components/Icon/Icon";
import SearchInput from "../../components/SearchInput/SearchInput";

const RoomSearchSection = () => {
    const setRoomTab = useChatsStore((state) => state.setRoomTab);

    return (
        <section className="grid justify-stretch items-start content-start gap-0 bg-background h-screen w-[400px]">
            {/* Header */}
            <header className="flex justify-start items-center gap-4 px-5 py-3 bg-background border-b border-secondary_light">
                <Icon variant="chats" onClick={() => setRoomTab(undefined)}>
                    <CloseIcon className="text-txt" />
                </Icon>
                <h3 className="text-lg text-white font-medium">Search messages</h3>
            </header>

            {/* Search Input */}
            <SearchInput
                placeholder="Search messages..."
                containerClassName="px-4 py-3"
            />

            {/* Search Results */}
            <div className="grid justify-stretch items-start gap-0 px-4 py-2 overflow-y-auto">
                <p className="text-txt text-sm text-center py-8">
                    Search for messages in this chat
                </p>
            </div>
        </section>
    );
};

export default RoomSearchSection;

