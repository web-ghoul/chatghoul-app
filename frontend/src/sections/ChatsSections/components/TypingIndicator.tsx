const TypingIndicator = ({ roomTypingUsers }: { roomTypingUsers: any[] }) => {
    if (roomTypingUsers.length === 0) return null;

    return (
        <div className="px-16 pb-3 flex justify-start items-center">
            <div className="p-3 rounded-xl rounded-tl-none bg-secondary_light">
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
