import { useState, useEffect, useRef } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import { useAuthStore } from "../../globals/useAuthStore";
import { useSocketStore } from "../../globals/useSocketStore";
import CloseIcon from "../../icons/CloseIcon";
import Icon from "../../components/Icon/Icon";
import DocumentIcon from "../../icons/DocumentIcon";
import roomService from "../../services/room.service";
import type { Media, Room } from "../../types/app.d";
import EditIcon from "../../icons/EditIcon";
import CheckIcon from "../../icons/CheckIcon";
import { Camera, UserPlus, Shield, MessageSquare, Settings, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import AddMembersModal from "../../modals/AddMembersModal";

const RoomInfoSection = () => {
  const currentRoomId = useChatsStore((state) => state.room);
  const rooms = useChatsStore((state) => state.rooms);
  const setRoomTab = useChatsStore((state) => state.setRoomTab);
  const currentUser = useAuthStore((state) => state.user);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  const [media, setMedia] = useState<Media[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAbout, setEditedAbout] = useState("");
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const room = rooms.find((r) => r._id === currentRoomId);

  useEffect(() => {
    if (room) {
      setEditedName(room.name || "");
      setEditedAbout(room.description || "");
    }
  }, [room?._id]);

  useEffect(() => {
    if (!currentRoomId) return;

    const fetchRecentMedia = async () => {
      setIsLoadingMedia(true);
      try {
        const data = await roomService.getRoomMedia(currentRoomId);
        setMedia(data.slice(0, 3)); // Only show last 3 for preview
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    fetchRecentMedia();
  }, [currentRoomId]);

  if (!room) return null;

  const getDisplayInfo = () => {
    if (room.type === 'group') {
      return {
        name: room.name || 'Group Chat',
        avatar: room.image,
        description: room.description || 'No description set',
        phone: `${room.participants.length} participants`,
        isOnline: false,
      };
    } else {
      const otherParticipant = room.participants.find(
        (p) => String(p._id) !== String(currentUser?._id)
      );
      const participant = otherParticipant || room.participants[0];

      return {
        name: participant?.name || 'Unknown User',
        avatar: participant?.avatar,
        description: participant?.about || 'Hey there! I am using ChatGhoul.',
        phone: participant?.phone || '',
        isOnline: participant ? onlineUsers.has(participant._id) : false,
      };
    }
  };

  const info = getDisplayInfo();

  const getUserId = (u: any): string => {
    if (!u) return '';
    return typeof u === 'string' ? u : u._id;
  };

  const isAdmin = room.type === 'group' && (
    getUserId(room.superAdmin) === currentUser?._id ||
    room.admins?.some(a => getUserId(a) === currentUser?._id)
  );

  const updatePermission = (key: string, value: string) => {
    handleUpdateRoom({
      permissions: {
        sendMessages: room.permissions?.sendMessages || 'everyone',
        addMembers: room.permissions?.addMembers || 'admins',
        editSettings: room.permissions?.editSettings || 'admins',
        [key]: value
      } as any
    });
  };

  const handleUpdateRoom = async (payload: Partial<Room>) => {
    try {
      const updatedRoom = await roomService.updateRoom(room._id, payload);
      useChatsStore.getState().updateRoom(room._id, updatedRoom);
      toast.success("Group updated");
    } catch (error) {
      toast.error("Failed to update group");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { url } = await roomService.uploadFile(room._id, file);
        await handleUpdateRoom({ image: url });
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
  };

  return (
    <section className="grid justify-stretch items-start content-start gap-0 bg-background border-l border-secondary h-screen w-[400px] overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex justify-start items-center gap-4 px-5 py-3 bg-secondary border-b border-secondary_light shrink-0">
        <Icon variant="chats" onClick={() => setRoomTab(undefined)}>
          <CloseIcon className="text-txt" />
        </Icon>
        <h3 className="text-lg text-white font-medium">
          {room.type === 'group' ? 'Group info' : 'Contact info'}
        </h3>
      </header>

      {/* Profile Section */}
      <div className="grid justify-center items-center gap-4 py-8 px-6 bg-secondary text-center relative group/avatar">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
        <div
          className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center mx-auto bg-cover bg-center shadow-xl ring-4 ring-background relative overflow-hidden"
          style={{ backgroundImage: info.avatar ? `url('${info.avatar}')` : undefined }}
          onClick={() => isAdmin && fileInputRef.current?.click()}
        >
          {!info.avatar && (
            <span className="text-primary text-6xl font-semibold">
              {info.name.charAt(0).toUpperCase()}
            </span>
          )}
          {isAdmin && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
              <Camera size={32} />
              <span className="text-xs uppercase font-bold mt-1">Change icon</span>
            </div>
          )}
        </div>
        <div className="grid gap-1">
          {isEditingName ? (
            <div className="flex items-center gap-2 border-b border-primary py-1">
              <input
                className="bg-transparent text-white text-2xl font-medium outline-none text-center w-full"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
              />
              <div onClick={() => { handleUpdateRoom({ name: editedName }); setIsEditingName(false); }}>
                <CheckIcon className="text-primary w-6 h-auto cursor-pointer" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 group/name">
              <h2 className="text-white text-2xl font-medium">{info.name}</h2>
              {isAdmin && (
                <div onClick={() => setIsEditingName(true)}>
                  <EditIcon
                    className="text-txt w-5 h-auto cursor-pointer opacity-0 group-hover/name:opacity-100 transition-opacity"
                  />
                </div>
              )}
            </div>
          )}
          <p className="text-txt text-sm font-medium">{info.phone}</p>
          {info.isOnline && <p className="text-primary text-xs font-semibold">online</p>}
        </div>
      </div>

      {/* About Section */}
      <div className="grid gap-2 px-6 py-4 border-b border-secondary bg-secondary/30">
        <p className="text-txt text-xs uppercase tracking-wider font-semibold">Description</p>
        {isEditingAbout ? (
          <div className="flex items-center gap-2 border-b border-primary py-1">
            <textarea
              className="bg-transparent text-white text-sm outline-none w-full resize-none"
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              rows={3}
              autoFocus
            />
            <div onClick={() => { handleUpdateRoom({ description: editedAbout }); setIsEditingAbout(false); }}>
              <CheckIcon className="text-primary w-6 h-auto cursor-pointer flex-shrink-0" />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start gap-4 group/desc">
            <p className="text-white text-sm leading-relaxed">{info.description}</p>
            {isAdmin && (
              <div onClick={() => setIsEditingAbout(true)}>
                <EditIcon
                  className="text-txt w-5 h-auto cursor-pointer opacity-0 group-hover/desc:opacity-100 transition-opacity flex-shrink-0"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Group Permissions (Admins only) */}
      {isAdmin && (
        <div className="grid gap-4 px-6 py-4 border-b border-secondary bg-secondary/30">
          <p className="text-txt text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            Group Settings
          </p>
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <MessageSquare size={16} className="text-txt" />
                <span>Send messages</span>
              </div>
              <select
                className="bg-secondary text-xs rounded border-none outline-none p-1"
                value={room.permissions?.sendMessages || 'everyone'}
                onChange={(e) => updatePermission('sendMessages', e.target.value)}
              >
                <option value="everyone">Everyone</option>
                <option value="admins">Only Admins</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <UserPlus size={16} className="text-txt" />
                <span>Add members</span>
              </div>
              <select
                className="bg-secondary text-xs rounded border-none outline-none p-1"
                value={room.permissions?.addMembers || 'admins'}
                onChange={(e) => updatePermission('addMembers', e.target.value)}
              >
                <option value="everyone">Everyone</option>
                <option value="admins">Only Admins</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <Settings size={16} className="text-txt" />
                <span>Edit group info</span>
              </div>
              <select
                className="bg-secondary text-xs rounded border-none outline-none p-1"
                value={room.permissions?.editSettings || 'admins'}
                onChange={(e) => updatePermission('editSettings', e.target.value)}
              >
                <option value="everyone">Everyone</option>
                <option value="admins">Only Admins</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Media, Links, Docs */}
      <div className="grid gap-2 px-6 py-4 border-b border-secondary bg-secondary/30">
        <div className="flex justify-between items-center">
          <p className="text-txt text-xs uppercase tracking-wider font-semibold">Media, links and docs</p>
          <button
            onClick={() => setRoomTab("media")}
            className="text-primary text-xs hover:underline font-medium"
          >
            {media.length > 0 ? 'View all' : ''}
          </button>
        </div>

        {isLoadingMedia ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary"></div>
          </div>
        ) : media.length === 0 ? (
          <p className="text-txt text-xs py-2 italic text-center">No common media</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 py-2">
            {media.map((item) => (
              <div
                key={item._id}
                onClick={() => setRoomTab("media")}
                className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all shadow-sm"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="p-1 text-center">
                    <span className="text-xl">
                      {item.type === 'audio' ? '🎵' : '📎'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-0 py-2">
        <button
          onClick={() => {
            setRoomTab("starred");
          }}
          className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/50 transition-all text-left"
        >
          <DocumentIcon className="text-txt w-4 h-auto text-primary" />
          <div className="grid">
            <span className="text-white text-sm">Starred messages</span>
          </div>
        </button>
      </div>

      {/* Participants Section (for Groups) */}
      {room.type === 'group' && (
        <div className="grid gap-2 border-t border-secondary py-4 bg-secondary/30">
          <div className="px-6 flex flex-col gap-3 mb-2">
            {(isAdmin || room.permissions?.addMembers === 'everyone') && (
              <button
                onClick={() => setIsAddMembersOpen(true)}
                className="flex items-center gap-4 py-1 group/add transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/10 group-hover/add:scale-105 transition-transform">
                  <UserPlus size={20} strokeWidth={2.5} />
                </div>
                <span className="text-primary font-bold text-sm">Add member</span>
              </button>
            )}
            <p className="text-txt text-[11px] uppercase tracking-[0.1em] font-bold opacity-80 mt-1">
              {room.participants.length} participants
            </p>
          </div>
          <div className="grid gap-0">
            {[...room.participants]
              .sort((a, b) => {
                const aIsAdmin = room.admins?.some(adm => getUserId(adm) === a._id) || getUserId(room.superAdmin) === a._id;
                const bIsAdmin = room.admins?.some(adm => getUserId(adm) === b._id) || getUserId(room.superAdmin) === b._id;
                if (aIsAdmin && !bIsAdmin) return -1;
                if (!aIsAdmin && bIsAdmin) return 1;
                return 0;
              })
              .map((participant) => {
                const pId = participant._id;
                const pIsAdmin = (room.admins?.some(a => getUserId(a) === pId)) ||
                  getUserId(room.superAdmin) === pId;
                const isSuperAdmin = getUserId(room.superAdmin) === pId;

                return (
                  <div
                    key={participant._id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/50 transition-all cursor-pointer group/member"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 bg-cover bg-center relative ring-2 ring-secondary/50"
                      style={{ backgroundImage: participant.avatar ? `url('${participant.avatar}')` : undefined }}
                    >
                      {!participant.avatar && (
                        <div className="w-full h-full flex items-center justify-center text-primary font-semibold text-sm">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {onlineUsers.has(participant._id) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary shadow-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 border-b border-secondary/30 pb-3 mt-1 group-last:border-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-medium truncate">{participant.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-txt text-xs font-medium tabular-nums">{participant.phone}</span>
                            {pIsAdmin && (
                              <span className="text-[9px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shadow-sm border border-primary/20">
                                Admin
                              </span>
                            )}
                          </div>
                          {isAdmin && !isSuperAdmin && !room.admins?.some(a => getUserId(a) === pId) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="text-txt w-4 h-auto opacity-0 group-hover/member:opacity-100 transition-opacity" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-secondary border-gray/20">
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await roomService.promoteToAdmin(room._id, pId);
                                      toast.success(`${participant.name} is now an admin`);
                                      // Update local store
                                      const currentAdminIds = room.admins?.map(a => getUserId(a)) || [];
                                      const updatedRoom = { ...room, admins: [...currentAdminIds, pId] };
                                      useChatsStore.getState().updateRoom(room._id, updatedRoom as any);
                                    } catch (error) {
                                      toast.error("Failed to promote user");
                                    }
                                  }}
                                >
                                  Make group admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                      <p className="text-txt text-xs truncate">
                        {participant.about || 'Available'}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <AddMembersModal
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        roomId={room._id}
        existingParticipants={room.participants.map(p => p._id)}
      />

      {/* Block & Report */}
      {room.type === 'private' && (
        <div className="grid gap-0 py-2 border-t border-secondary mt-4">
          <button
            disabled={isProcessing}
            onClick={async () => {
              const otherParticipant = room.participants.find(p => String(p._id) !== String(currentUser?._id));
              if (!otherParticipant) return;
              setIsProcessing(true);
              try {
                const isBlocked = currentUser?.blockedUsers?.includes(otherParticipant._id);
                if (isBlocked) {
                  await useChatsStore.getState().unblockUser(otherParticipant._id);
                } else {
                  await useChatsStore.getState().blockUser(otherParticipant._id);
                }
              } catch (error) {
                console.error("Action failed:", error);
              } finally {
                setIsProcessing(false);
              }
            }}
            className="flex items-center gap-4 px-6 py-3 hover:bg-red-400/10 transition-all text-left group disabled:opacity-50"
          >
            <span className="text-red-400 text-sm group-hover:underline">
              {currentUser?.blockedUsers?.includes(room.participants.find(p => String(p._id) !== String(currentUser?._id))?._id || '')
                ? `Unblock ${info.name}`
                : `Block ${info.name}`}
            </span>
          </button>
          <button
            disabled={isProcessing || currentUser?.reportedUsers?.includes(room.participants.find(p => String(p._id) !== String(currentUser?._id))?._id || '')}
            onClick={async () => {
              const otherParticipant = room.participants.find(p => String(p._id) !== String(currentUser?._id));
              if (!otherParticipant) return;
              setIsProcessing(true);
              try {
                await useChatsStore.getState().reportUser(otherParticipant._id);
              } catch (error) {
                console.error("Action failed:", error);
              } finally {
                setIsProcessing(false);
              }
            }}
            className="flex items-center gap-4 px-6 py-3 hover:bg-red-400/10 transition-all text-left group disabled:opacity-50"
          >
            <span className="text-red-400 text-sm group-hover:underline">
              {currentUser?.reportedUsers?.includes(room.participants.find(p => String(p._id) !== String(currentUser?._id))?._id || '')
                ? `Reported ${info.name}`
                : `Report ${info.name}`}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default RoomInfoSection;
