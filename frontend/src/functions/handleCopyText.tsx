import { handleToaster } from "./handleToaster";

export const handleCopyText = async (text: string): Promise<boolean> => {
  if (!text) {
    console.warn("Cannot copy empty text");
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    handleToaster("success", {
      title: "Clipboard",
      description: `${text} is copied`,
      position:'bottom-left'
    });
    return true;
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
};
