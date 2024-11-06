import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { NavbarButtons } from './Navbar/NavbarButtons'

interface NavbarProps {
  step: number
  creatorInputValue: string
  setCreatorInputValue: Dispatch<SetStateAction<string>>
  handleEnterInput: (e: { key: string }) => void
  setChatIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Navbar = ({ step, creatorInputValue, setCreatorInputValue, handleEnterInput, setChatIsOpen }: NavbarProps) => {
  const [expandNav, setExpandNav] = useState<boolean>(true)
  const [expandSearch, setExpandSearch] = useState<boolean>(false)
  const [isCreator, setIsCreator] = useState<boolean>(false)

  const handleNavWidth = () => {
    setExpandNav(!expandNav)
  }

  useEffect(() => {
    if (step === 2) {
      setIsCreator(true)
      setTimeout(() => {
        setIsCreator(false)
      }, 5000)
    }
  }, [step])

  return (
    <div className={`fixed bottom-10 left-0 ${expandNav ? 'w-full' : 'w-[223px]'} h-[60px] justify-center transition-all duration-200 z-20 ${step === 1 ? 'hidden min-[674px]:flex' : 'hidden lg:flex'}`}>
      <div className={`${step === 2 ? 'max-lg:w-full' : ''} relative rounded-[8px] overflow-hidden flex mx-20`}>
        <div className={`flex gap-x-2 max-lg:w-full h-full z-10 p-2 ${step === 2 ? 'animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : ''}`}>
          <div onClick={handleNavWidth} className='min-w-[48px] h-full flex justify-center items-center rounded-[5px] bg-[#282826]'>
            <i className={`fa-solid fa-xl fa-hurricane text-[#ffffff] hover:text-indigo-500 ${expandNav ? 'rotate-45' : ''} transition-all duration-500`}></i>
          </div>
          {
            step === 2 ? (
              <div className="sm:w-[600px] flex gap-x-2 bg-[#40403e] rounded-[5px]">
                <div
                  className={`w-full lg:w-[600px] flex justify-center items-center animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-[5px] transition-all duration-200`}>
                  <input
                    value={creatorInputValue}
                    onChange={({ target }) => { setCreatorInputValue(target.value) }}
                    onKeyDown={handleEnterInput}
                    placeholder={'Type /screenplay to start writing. Type /help to see all the commands.'}
                    type="text"
                    className={`${isCreator ? 'animate-pulse' : ''} w-full h-10 px-2 rounded-[3px] bg-[#f3f3f3] ring-0 focus:ring-0 focus:outline-none text-[0.9rem]`}
                  />
                </div>
              </div>
            )
              :
              (
                <NavbarButtons expandSearch={expandSearch} setExpandSearch={setExpandSearch} />
              )
          }
          <div onClick={() => { setChatIsOpen((prev: boolean) => !prev) }} className='h-full flex justify-center items-center px-3 bg-[#ffffff] hover:bg-indigo-500 border hover:border-transparent rounded-[5px] font-body text-[16px] text-[#40403e] hover:text-[#ffffff] transition-color duration-200 cursor-pointer'>
            <i className="fa-solid fa-comments"></i>
          </div>
        </div>
        <div className="absolute w-full h-full bg-[#40403e] opacity-90 z-0"></div>
      </div>
    </div>
  )
}
