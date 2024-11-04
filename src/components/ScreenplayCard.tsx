import { ScreenplayPosterProps } from '../utils/types'
import { useRef, useState, type ReactElement } from 'react'

export const ScreenplayCard = ({ item }: { item: ScreenplayPosterProps }): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  const handleOpenMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div onMouseLeave={() => { setIsOpen(false) }} key={item.id} className="relative w-full flex">
      <img src={item.poster} alt={item.title} className={`w-full ${item.sizeChance > 0.45 ? 'h-full' : 'h-[250px]'} object-cover rounded-[15px]`} />
      <div className="group absolute top-0 left-0 w-full h-full rounded-[15px] opacity-0 hover:opacity-100 transition-all duration-200">
        <div className="w-full h-full absolute top-0 left-0 bg-[#40403e] rounded-[15px] opacity-45"></div>
        <div className="relative w-full h-full flex flex-col justify-between items-end p-2">
          <div className='w-[35px] h-[35px] flex justify-center items-center rounded-[5px] bg-[#282826] border border-[#585856] cursor-pointer'>
            <i className="fa-solid fa-lg fa-bookmark text-[#ffffff] hover:text-indigo-500 transition-color duration-200"></i>
          </div>
          <div className="flex justify-end gap-x-1">
            <div className='h-[30px] min-w-[60px] flex justify-center items-center rounded-full border border-[#585856] bg-[#282826] cursor-pointer'>
              <p className='text-[#ffffff] text-[14px] hover:text-indigo-500 transition-color duration-200'>Visit</p>
            </div>
            <div ref={ref} onClick={handleOpenMenu} className='w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#282826] border border-[#585856] cursor-pointer'>
              <i className="fa-solid fa-md fa-ellipsis text-[#ffffff] hover:text-indigo-500 transition-color duration-200"></i>
            </div>
          </div>
          {
            isOpen && (
              <div className="absolute -bottom-8 -right-10 w-[65px] h-[50px] px-2 bg-[#282826] border border-[#585856] rounded-[5px] flex flex-col justify-center items-start z-50">
                <p className='font-body text-[14px] text-[#ffffff] hover:text-indigo-500 transition-color duration-200 cursor-pointer'>Edit</p>
                <p className='font-body text-[14px] text-[#ffffff] hover:text-indigo-500 transition-color duration-200 cursor-pointer'>Delete</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
