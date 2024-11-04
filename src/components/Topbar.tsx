import { SetStateAction, useEffect, useState, type ReactElement } from 'react'
import logoBlack from '../assets/Logo text black.webm'

interface TopbarProps {
    prompt: string
    setPrompt: React.Dispatch<SetStateAction<string>>
    setStep: React.Dispatch<SetStateAction<number>>
    handlePro: () => void
}

export const Topbar = ({ prompt, setPrompt, setStep, handlePro } : TopbarProps): ReactElement => {
  const [isActive, setIsActive] = useState(false)
  const [Ypos, setYpos] = useState(0) 

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setPrompt(e.target.value)
  }
  const handleEnterEvent = (e: { key: string }) => {
    if (e.key === 'Enter' && prompt.length > 0) {
      setStep(2)
      setPrompt('')
    }
  }

  useEffect(() => {

    window.addEventListener('scroll', () => {
      setYpos(window.scrollY)
    })

    return window.removeEventListener('scroll', () => {
      setYpos(window.scrollY)
    })
  }, [])

  return (
    <div id='topbar' className={`fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-20 bg-[#fdfdfd] z-20 ${ Ypos > 45 ? 'shadow-sm shadow-gray-300' : '' }`}>
      <video onClick={() => { setStep(1) }} className='absolute -top-[46px] -left-4 object-cover h-[150px]' src={logoBlack} autoPlay muted></video>
      <div className="w-full flex justify-end gap-x-5">
        <div className={`relative flex h-11 items-center px-[0.2rem] rounded-[5px] transition-all duration-200 ${isActive ? 'w-[40rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]' : 'w-[20rem] bg-transparent'}`}>
          <input onMouseDown={() => { setIsActive(true) }} onBlur={() => { setIsActive(false) }} onKeyDown={handleEnterEvent} value={prompt} onChange={handleChange} placeholder='What do you want to write about?' type="text" className='w-full h-[40px] bg-[#f3f3f3] ring-0 focus:ring-0 focus:outline-none px-5 rounded-[3px] font-body text-[14px]' />
        </div>
        <div className="flex items-center gap-x-2">
          <img className='w-[38px] h-[38px] rounded-full' src="https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?q=80&w=1974&auto=format" alt="profile pic" />
          <button onClick={handlePro} className='h-[40px] px-3 bg-[#40403e] hover:bg-[#585856] rounded-[5px] font-body text-[14px] text-[#ffffff]'>Be a Pro</button>
          <button className='h-[40px] px-3 bg-[#ffffff] hover:bg-indigo-500 border hover:border-transparent rounded-[5px] font-body text-[14px] text-[#40403e] hover:text-[#ffffff] transition-color duration-200'>Submit Project</button>
        </div>
      </div>
    </div>
  )
}
