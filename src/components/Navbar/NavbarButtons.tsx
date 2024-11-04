import { Dispatch, SetStateAction, type ReactElement } from 'react'

interface NavbarButtonsProps {
    expandSearch: boolean
    setExpandSearch: Dispatch<SetStateAction<boolean>>
}

export const NavbarButtons = ({ expandSearch, setExpandSearch } : NavbarButtonsProps): ReactElement => {
    const handleSearch = () => {
        if (!expandSearch) setExpandSearch(true)
      }
  return (
    <div className="flex gap-x-2 bg-[#40403e] py-1 px-2 rounded-[5px]">
        <div onBlur={() => { setExpandSearch(false) }} onClick={handleSearch} className={`${expandSearch ? 'w-[200px]' : ''} h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] cursor-pointer transition-all duration-400`}>
            {
                expandSearch ? (
                  <input type="text" placeholder='Search' className='w-full h-full bg-[#40403e] ring-0 focus:ring-0 focus:outline-none text-[16px] font-body text-[#ffffff]' />
                ) : (
                <p className='font-body text-[16px] text-[#ffffff]'>Search</p>
                )
            }
            </div>
            <div className='h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] transition-color duration-200 cursor-pointer'>
              <p className='font-body text-[16px] text-[#ffffff]'>Projects</p>
            </div>
            <div className='h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] transition-color duration-200 cursor-pointer'>
              <p className='font-body text-[16px] text-[#ffffff]'>Contests</p>
            </div>
            <div className='h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] transition-color duration-200 cursor-pointer'>
            <p className='font-body text-[16px] text-[#ffffff]'>Courses</p>
        </div>
    </div>
  )
}
