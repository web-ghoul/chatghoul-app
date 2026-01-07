import { useState } from "react";
import Menu from "./Menu";
import { useChatInput } from "../../hooks/useChatInput";
import SendIcon from "../../icons/SendIcon";
import MediaPreview from "./MediaPreview";
import CameraCapture from "../CameraCapture/CameraCapture";

const ChatInput = () => {
  const {
    message,
    setMessage,
    isSending,
    sendMessage,
    onSelectFile,
    submitFile,
    clearPendingFile,
    pendingFile,
    previewUrl,
    fileType,
    handleKeyPress,
    isDisabled
  } = useChatInput();

  const [showCamera, setShowCamera] = useState(false);

  return (
    <>
      <div className="px-2 w-full pb-3 bottom-0 left-0 z-10 shadow-xl">
        <div
          className={`grid justify-stretch items-center grid-cols-[auto_1fr_auto] rounded-full transition-all px-2 py-1.5 bg-secondary_light gap-2`}
        >
          <Menu onSendFile={onSelectFile} onOpenCamera={() => setShowCamera(true)} />
          <input
            type={"text"}
            name={"message"}
            id={"message"}
            autoComplete="off"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isDisabled}
            className="w-full max-h-12 min-h-2 outline-none focus-visible:bg-transparent placeholder:text-txt px-1 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none text-white text-md disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isSending || isDisabled}
            className="p-1.5 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon className="w-4 h-auto text-primary" />
            )}
          </button>
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={onSelectFile}
          onClose={() => setShowCamera(false)}
        />
      )}

      {pendingFile && previewUrl && (
        <MediaPreview
          file={pendingFile}
          url={previewUrl}
          type={fileType}
          onClose={clearPendingFile}
          onSend={submitFile}
          isSending={isSending}
          caption={message}
          setCaption={setMessage}
        />
      )}
    </>
  );
};

export default ChatInput;
