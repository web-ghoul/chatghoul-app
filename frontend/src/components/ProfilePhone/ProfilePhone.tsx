import { useState } from "react";
import { handleCopyText } from "../../functions/handleCopyText";
import CopyIcon from "../../icons/CopyIcon";
import PhoneIcon from "../../icons/PhoneIcon";
import EditIcon from "../../icons/EditIcon";
import CheckIcon from "../../icons/CheckIcon";
import CloseIcon from "../../icons/CloseIcon";
import Icon from "../Icon/Icon";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import { toast } from "sonner";

const ProfilePhone = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updateProfile({ phone });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Phone number updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update phone number");
    }
  };

  return (
    <div className="grid justify-stretch items-center gap-4 w-full px-7.5 group">
      <p className="text-txt text-sm font-bold">Phone Number</p>

      {isEditing ? (
        <div className="flex items-center gap-3 border-b border-primary py-1">
          <PhoneIcon className="text-txt w-5 font-bold" />
          <input
            className="bg-transparent text-white font-medium outline-none w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <Icon variant="chats" onClick={() => { setPhone(user?.phone || ""); setIsEditing(false); }}>
              <CloseIcon className="text-red-400 w-5 h-auto cursor-pointer" />
            </Icon>
            <Icon variant="chats" onClick={handleSave}>
              <CheckIcon className="text-primary w-5 h-auto cursor-pointer" />
            </Icon>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-3">
          <div className="flex justify-start items-center gap-3">
            <PhoneIcon className="text-txt w-5 font-bold" />
            <h6 className="text-white font-medium">{user?.phone || "No phone set"}</h6>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon variant="chats" onClick={() => setIsEditing(true)}>
              <EditIcon
                className="text-txt w-5 h-auto cursor-pointer"
              />
            </Icon>
            <Icon variant="chats" onClick={() => handleCopyText(user?.phone || "")}>
              <CopyIcon />
            </Icon>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhone;
