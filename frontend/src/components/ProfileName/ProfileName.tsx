import { useState } from "react";
import EditIcon from "../../icons/EditIcon";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import { toast } from "sonner";
import CheckIcon from "../../icons/CheckIcon";
import CloseIcon from "../../icons/CloseIcon";

const ProfileName = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      const updatedUser = await userService.updateProfile({ name });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Name updated");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  return (
    <div className="grid justify-stretch items-center gap-4 w-full px-7.5 group">
      <p className="text-txt text-sm font-bold">Your name</p>
      {isEditing ? (
        <div className="flex items-center gap-3 border-b border-primary py-1">
          <input
            className="bg-transparent text-white font-medium outline-none w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            autoFocus
          />
          <div className="flex gap-2">
            <div onClick={() => { setName(user?.name || ""); setIsEditing(false); }}>
              <CloseIcon className="text-red-400 w-5 h-auto cursor-pointer" />
            </div>
            <div onClick={handleSave}>
              <CheckIcon className="text-primary w-5 h-auto cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-3">
          <h6 className="text-white font-medium">{user?.name || "No name set"}</h6>
          <div onClick={() => setIsEditing(true)}>
            <EditIcon
              className="text-txt w-9 h-auto cursor-pointer p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      )}
      <p className="text-[10px] text-txt/60 mt-2 leading-tight">
        This is not your username or pin. This name will be visible to your ChatGhoul contacts.
      </p>
    </div>
  );
};

export default ProfileName;
