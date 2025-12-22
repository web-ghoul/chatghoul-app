import AddIcon from "../../icons/AddIcon";
import AudioIcon from "../../icons/AudioIcon";
import CameraIcon from "../../icons/CameraIcon";
import DocumentIcon from "../../icons/DocumentIcon";
import MediaIcon from "../../icons/MediaIcon";
import Icon from "../Icon/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Menu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Icon variant="chats">
          <AddIcon className="text-white w-5 h-auto" />
        </Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DocumentIcon className="w-5 h-auto text-doc" />
          Document
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MediaIcon className="w-5 h-auto text-photo" />
          Photos & videos
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CameraIcon className="w-5 h-auto text-camera" />
          Camera
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AudioIcon className="w-5 h-auto text-audio" />
          Audios
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
