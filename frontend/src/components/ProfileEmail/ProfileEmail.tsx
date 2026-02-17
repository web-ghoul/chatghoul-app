import { useState } from "react";
import { useAuthStore } from "../../globals/useAuthStore";
import userService from "../../services/user.service";
import { toast } from "sonner";
import EditIcon from "../../icons/EditIcon";
import CheckIcon from "../../icons/CheckIcon";
import CloseIcon from "../../icons/CloseIcon";
import { Mail } from "lucide-react";

const ProfileEmail = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const updatedUser = await userService.updateProfile({ email });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Email updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update email");
    }
  };

  return (
    <div className="grid justify-stretch items-center gap-4 w-full px-7.5 group">
      <p className="text-txt text-sm font-bold">Email Address</p>

      {isEditing ? (
        <div className="flex items-center gap-3 border-b border-primary py-1">
          <Mail className="text-txt w-5 h-5 font-bold" />
          <input
            className="bg-transparent text-white font-medium outline-none w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            type="email"
          />
          <div className="flex gap-2">
            <div
              onClick={() => {
                setEmail(user?.email || "");
                setIsEditing(false);
              }}
            >
              <CloseIcon className="text-red-400 w-5 h-auto cursor-pointer" />
            </div>
            <div onClick={handleSave}>
              <CheckIcon className="text-primary w-5 h-auto cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-3">
          <div className="flex justify-start items-center gap-3">
            <Mail className="text-txt w-5 h-5 font-bold" />
            <h6 className="text-white font-medium">
              {user?.email || "No email set"}
            </h6>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div onClick={() => setIsEditing(true)}>
              <EditIcon className="text-txt w-9 h-auto cursor-pointer p-2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEmail;
