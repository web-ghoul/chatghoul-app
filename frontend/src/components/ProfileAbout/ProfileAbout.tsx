import { useState } from "react";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import { toast } from "sonner";
import EditIcon from "../../icons/EditIcon";
import CheckIcon from "../../icons/CheckIcon";
import CloseIcon from "../../icons/CloseIcon";

const ProfileAbout = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(user?.about || "");

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updateProfile({ about });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("About updated");
    } catch (error) {
      toast.error("Failed to update about");
    }
  };

  return (
    <div className="grid justify-stretch items-center gap-4 w-full px-7.5 group">
      <p className="text-txt text-sm font-bold">About (Bio)</p>
      {isEditing ? (
        <div className="flex items-center gap-3 border-b border-primary py-1">
          <input
            className="bg-transparent text-white font-medium outline-none w-full"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <div onClick={() => { setAbout(user?.about || ""); setIsEditing(false); }}>
              <CloseIcon className="text-red-400 w-5 h-auto cursor-pointer" />
            </div>
            <div onClick={handleSave}>
              <CheckIcon className="text-primary w-5 h-auto cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-3">
          <h6 className="text-white font-medium">
            {user?.about || "Hey there! I am using ChatGhoul."}
          </h6>
          <div onClick={() => setIsEditing(true)}>
            <EditIcon
              className="text-txt w-9 h-auto cursor-pointer p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAbout;
