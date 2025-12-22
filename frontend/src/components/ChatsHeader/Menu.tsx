import { useChatsStore } from "../../globals/useChatsStore";
import AddUsersIcon from "../../icons/AddUsersIcon";
import LogoutIcon from "../../icons/LogoutIcon";
import MenuIcon from "../../icons/MenuIcon";
import StarIcon from "../../icons/StarIcon";
import Icon from "../Icon/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Menu = () => {
  const setChatTab = useChatsStore((state) => state.setChatTab);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Icon variant="chats">
          <MenuIcon className="text-white w-5 h-auto" />
        </Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setChatTab("new_group")}>
          <AddUsersIcon />
          New group
        </DropdownMenuItem>
        <DropdownMenuItem>
          <StarIcon />
          Starred messages
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-500/30" />
        <DropdownMenuItem className="hover:bg-red-400/15 hover:text-red-400 group">
          <LogoutIcon className="transition-all group-hover:text-red-400" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
