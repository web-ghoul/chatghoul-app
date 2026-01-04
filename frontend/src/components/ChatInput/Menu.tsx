import { useRef } from "react";
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

interface MenuProps {
  onSendFile: (file: File) => void;
}

const Menu = ({ onSendFile }: MenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  const triggerInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={mediaInputRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={audioInputRef}
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*,video/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Icon variant="chats">
            <AddIcon className="text-white w-5 h-auto cursor-pointer" />
          </Icon>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => triggerInput(fileInputRef)}>
            <DocumentIcon className="w-5 h-auto text-doc" />
            Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerInput(mediaInputRef)}>
            <MediaIcon className="w-5 h-auto text-photo" />
            Photos & videos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerInput(cameraInputRef)}>
            <CameraIcon className="w-5 h-auto text-camera" />
            Camera
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerInput(audioInputRef)}>
            <AudioIcon className="w-5 h-auto text-audio" />
            Audios
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Menu;
