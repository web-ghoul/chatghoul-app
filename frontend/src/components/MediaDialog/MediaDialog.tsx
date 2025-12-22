import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MediaIcon from "../../icons/MediaIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Icon from "../Icon/Icon";

const MediaDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Tooltip>
            <TooltipTrigger>
              <Icon onClick={() => {}} active={false}>
                <MediaIcon />
              </Icon>
            </TooltipTrigger>
            <TooltipContent>Media</TooltipContent>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Media</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDialog;
