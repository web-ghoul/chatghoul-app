import { handleCopyText } from "../../functions/handleCopyText";
import CopyIcon from "../../icons/CopyIcon";
import PhoneIcon from "../../icons/PhoneIcon";
import Icon from "../Icon/Icon";

const ProfilePhone = () => {
  return (
    <div className="grid justify-stretch items-center gap-4 w-full px-7.5">
      <p className="text-txt text-sm font-bold">Phone Number</p>
      <div className="flex justify-between items-center gap-3">
        <div className="flex justify-start items-center gap-3">
          <PhoneIcon className="text-txt w-5 font-bold" />
          <h6 className="text-white font-medium">+20 10 09344881</h6>
        </div>
        <Icon variant="chats" onClick={()=>handleCopyText("+20 10 09344881")}>
          <CopyIcon />
        </Icon>
      </div>
    </div>
  );
};

export default ProfilePhone;
