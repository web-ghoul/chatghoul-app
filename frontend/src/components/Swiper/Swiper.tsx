import ChevronDownIcon from '../../icons/ChevronDownIcon'

interface SwiperProps {
  onClick?: () => void;
  show?: boolean;
  unreadCount?: number;
}

const Swiper = ({ onClick, show, unreadCount }: SwiperProps) => {
  if (!show) return null;

  return (
    <div
      onClick={onClick}
      className='w-10 h-10 rounded-full flex justify-center items-center absolute bg-secondary_light hover:bg-secondary transition-all bottom-24 right-6 z-20 cursor-pointer shadow-lg animate-in fade-in zoom-in duration-300'
    >
      <ChevronDownIcon className='text-txt w-5' />
      {unreadCount ? unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-primary text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      ) : null}
    </div>
  )
}

export default Swiper
