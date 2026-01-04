import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { useSocketStore } from "../globals/useSocketStore";
import { useSocket } from "../hooks/useSocket";

const ForceLogoutModal = () => {
    const forceLogoutOpen = useSocketStore((state) => state.forceLogoutOpen);
    const forceLogoutMessage = useSocketStore((state) => state.forceLogoutMessage);
    const { handleForceLogoutConfirm } = useSocket();

    return (
        <Dialog open={forceLogoutOpen} onOpenChange={() => { }}>
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Session Expired</DialogTitle>
                    <DialogDescription className="text-center pt-4">
                        {forceLogoutMessage || "Your session has been terminated."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <button
                        onClick={handleForceLogoutConfirm}
                        className="w-full sm:w-auto px-8 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        OK
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ForceLogoutModal;
