import { useChatsStore } from "../../globals/useChatsStore";
import CameraIcon from "../../icons/CameraIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import EyeIcon from "../../icons/EyeIcon";
import FolderIcon from "../../icons/FolderIcon";
import MediaIcon from "../../icons/MediaIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ProfileAvatar = () => {
  const setChatTab = useChatsStore((state) => state.setChatTab);

  return (
    <div className="my-7 m-auto">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div
            className="m-auto relative bg-cover bg-center bg-no-repeat w-34 h-34 rounded-full overflow-hidden bg-secondary group hover:cursor-pointer"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1761839258239-2be2146f1605?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8')`,
            }}
          >
            <div className="bg-[rgba(0,0,0,0.65)] left-0 top-0 h-full w-full absolute z-0 transition-all opacity-0 group-hover:opacity-100 grid justify-center items-center gap-2 content-center">
              <MediaIcon className="text-white w-6 h-auto m-auto" />
              <h6 className="text-white text-center text-sm">Change Avatar</h6>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setChatTab("new_group")}>
            <EyeIcon />
            View photo
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CameraIcon />
            Take photo
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderIcon />
            Upload photo
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-500/30" />
          <DropdownMenuItem className="hover:bg-red-400/15 hover:text-red-400 group">
            <DeleteIcon className="transition-all group-hover:text-red-400" />
            Remove photo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileAvatar;
