import ChevronDownIcon from '../../icons/ChevronDownIcon'

const Swiper = () => {
  return (
    <div className='w-12 h-12 rounded-full flex justify-center items-center absolute bg-secondary_light transition-all bottom-20 right-2 z-11 cursor-pointer'>
        <ChevronDownIcon className='text-txt w-6' />
    </div>
  )
}

export default Swiper
