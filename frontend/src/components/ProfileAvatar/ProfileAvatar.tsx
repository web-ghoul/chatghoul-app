import { useRef, useState } from "react";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import DeleteIcon from "../../icons/DeleteIcon";
import EyeIcon from "../../icons/EyeIcon";
import FolderIcon from "../../icons/FolderIcon";
import MediaIcon from "../../icons/MediaIcon";
import { Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import CameraModal from "../../modals/CameraModal";

const ProfileAvatar = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const updateAvatar = async (file: File) => {
    try {
      const updatedUser = await userService.updateAvatar(file);
      setUser(updatedUser);
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update avatar");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateAvatar(file);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const updatedUser = await userService.updateProfile({ avatar: "" });
      setUser(updatedUser);
      toast.success("Avatar removed");
    } catch (error) {
      toast.error("Failed to remove avatar");
    }
  };

  return (
    <div className="my-7 m-auto">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div
            className="m-auto relative bg-cover bg-center bg-no-repeat w-34 h-34 rounded-full overflow-hidden bg-secondary group hover:cursor-pointer border-2 border-primary/20"
            style={{
              backgroundImage: user?.avatar ? `url('${user.avatar}')` : 'none',
            }}
          >
            {!user?.avatar && (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold uppercase">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="bg-[rgba(0,0,0,0.65)] left-0 top-0 h-full w-full absolute z-0 transition-all opacity-0 group-hover:opacity-100 grid justify-center items-center gap-2 content-center">
              <MediaIcon className="text-white w-6 h-auto m-auto" />
              <h6 className="text-white text-center text-sm">Change Avatar</h6>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-secondary border-gray/20">
          <DropdownMenuItem onClick={() => user?.avatar && window.open(user.avatar, '_blank')} disabled={!user?.avatar}>
            <EyeIcon />
            View photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsCameraOpen(true)}>
            <Camera className="w-5 h-5 text-txt" />
            Take photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <FolderIcon />
            Upload photo
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-500/30" />
          <DropdownMenuItem
            onClick={handleRemoveAvatar}
            className="hover:bg-red-400/15 hover:text-red-400 group"
            disabled={!user?.avatar}
          >
            <DeleteIcon className="transition-all group-hover:text-red-400" />
            Remove photo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CameraModal
        open={isCameraOpen}
        onOpenChange={setIsCameraOpen}
        onCapture={updateAvatar}
      />
    </div>
  );
};

export default ProfileAvatar;
