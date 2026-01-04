import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { useAuth } from "../hooks/useAuth";

interface LogoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LogoutModal = ({ open, onOpenChange }: LogoutModalProps) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-secondary border-gray/20">
                <DialogHeader>
                    <DialogTitle className="text-white">Log out</DialogTitle>
                    <DialogDescription className="text-txt pt-2">
                        Are you sure you want to log out of ChatGhoul?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 sm:justify-end mt-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-500/20"
                    >
                        Log out
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LogoutModal;
