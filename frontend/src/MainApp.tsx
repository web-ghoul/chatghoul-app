import useSocket from './hooks/useSocket';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './globals/useAppStore';
import Header from './components/Header/Header';
import MediaSection from './sections/MediaSection/MediaSection';
import ChatsSection from './sections/ChatsSections/ChatsSection';
import SettingsSection from './sections/SettingsSection/SettingsSection';
import ProfileSection from './sections/ProfileSection/ProfileSection';
import ForceLogoutModal from './modals/ForceLogoutModal';

const MainApp = () => {
    const tab = useAppStore((state) => state.tab);

    useSocket();
    useKeyboardShortcuts();

    return (
        <main
            className={`grid justify-stretch items-center grid-cols-[auto_1fr] h-screen bg-background`}
        >
            <Header />
            {tab === "chats" ? <ChatsSection /> : <></>}
            {tab === "media" ? <MediaSection /> : <></>}
            {tab === "settings" ? <SettingsSection /> : <></>}
            {tab === "profile" ? <ProfileSection /> : <></>}
            <ForceLogoutModal />
        </main>
    );
}

export default MainApp