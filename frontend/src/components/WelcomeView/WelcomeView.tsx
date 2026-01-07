import { MessageSquare } from "lucide-react";

const WelcomeView = () => {
  return (
    <div className='flex flex-col justify-center items-center h-full bg-background relative overflow-hidden'>
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url('https://static.whatsapp.net/rsrc.php/v4/y1/r/m5BEg2K4OR4.png')`, backgroundSize: '400px' }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center px-6 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 shadow-2xl ring-1 ring-primary/20">
          <MessageSquare className="text-primary w-12 h-12" />
        </div>

        <h1 className="text-3xl text-white font-bold mb-3 tracking-tight">ChatGhoul Desktop</h1>
        <p className="text-txt text-base leading-relaxed mb-8">
          Send and receive messages without keeping your phone online.
          Use ChatGhoul on up to 4 linked devices and 1 phone at the same time.
        </p>

        <div className="flex items-center gap-2 text-txt/40 text-sm mt-12 pt-8 border-t border-secondary w-full justify-center">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            End-to-end encrypted
          </span>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-20">
        <div className="h-1 w-32 bg-primary rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default WelcomeView;
