import BlockIcon from "../../icons/BlockIcon";
import ChevronDownIcon from "../../icons/ChevronDownIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import LogoutIcon from "../../icons/LogoutIcon";
import PinIcon from "../../icons/PinIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Menu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none text-txt absolute transition-all right-0 p-1 translate-x-6 group-hover:translate-0 cursor-pointer">
        <ChevronDownIcon className="w-6 h-auto transition-all" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PinIcon />
          Pin chat
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-500/30" />
        <DropdownMenuItem className="hover:bg-red-400/15 hover:text-red-400 group">
          <BlockIcon className="transition-all group-hover:text-red-400" />
          Block
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-red-400/15 hover:text-red-400 group">
          <DeleteIcon className="transition-all group-hover:text-red-400" />
          Delete chat
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-red-400/15 hover:text-red-400 group">
          <LogoutIcon className="transition-all group-hover:text-red-400" />
          Exit group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
