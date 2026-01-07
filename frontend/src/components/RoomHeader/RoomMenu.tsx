import CloseIcon from "../../icons/CloseIcon";
import MenuIcon from "../../icons/MenuIcon";
import BlockIcon from "../../icons/BlockIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import UserIcon from "../../icons/UserIcon";
import Icon from "../Icon/Icon";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useRoomMenu } from "../../hooks/useRoomMenu";

const RoomMenu = () => {
    const {
        room,
        isBlocked,
        handleBlockToggle,
        handleReport,
        handleClearChat,
        handleDeleteChat,
        setRoom,
        setRoomTab,
    } = useRoomMenu();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Icon variant="chats">
                    <MenuIcon className="text-txt w-4 h-auto" />
                </Icon>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRoomTab("info")}>
                    <UserIcon />
                    Contact info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoom(undefined)}>
                    <CloseIcon />
                    Close chat
                </DropdownMenuItem>

                {room?.type === 'private' && (
                    <>
                        <DropdownMenuSeparator className="bg-gray-500/30" />
                        <DropdownMenuItem onClick={handleReport}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" x2="4" y1="22" y2="15" />
                            </svg>
                            Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleBlockToggle}
                            className="hover:bg-red-400/15 hover:text-red-400 group"
                        >
                            <BlockIcon className="transition-all group-hover:text-red-400" />
                            {isBlocked ? "Unblock" : "Block"}
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator className="bg-gray-500/30" />
                <DropdownMenuItem onClick={handleClearChat}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    Clear chat
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDeleteChat}
                    className="hover:bg-red-400/15 hover:text-red-400 group"
                >
                    <DeleteIcon className="transition-all group-hover:text-red-400" />
                    {room?.type === 'group' ? 'Exit group' : 'Delete chat'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default RoomMenu;
