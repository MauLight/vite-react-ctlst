import { SetStateAction, useEffect, useState, type ReactElement } from 'react'
import logoBlack from '../assets/Logo text black.webm'
import { InvitationProps } from '../utils/types'
import { toast } from 'react-toastify'
import Hamburger from 'hamburger-react'

interface TopbarProps {
  prompt: string
  setPrompt: React.Dispatch<SetStateAction<string>>
  setStep: React.Dispatch<SetStateAction<number>>
  handlePro: () => void
  invitations: InvitationProps[]
  handleCollaborationNav: (documentId: string) => void
}

export const Topbar = ({ prompt, setPrompt, setStep, handlePro, invitations, handleCollaborationNav }: TopbarProps): ReactElement => {
  const [isActive, setIsActive] = useState(false)
  const [Ypos, setYpos] = useState(0)
  const [openNotifications, setOpenNotifications] = useState<boolean>(false)
  const [hamburgerIsActive, setHamburgerIsActive] = useState<boolean>(false)

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setPrompt(e.target.value)
  }

  const handleEnterEvent = (e: { key: string }) => {
    if (e.key === 'Enter' && prompt.length > 0) {
      setStep(2)
      setPrompt('')
    }
  }

  const handleOpenNotifications = () => {
    setOpenNotifications(!openNotifications)
  }

  const handleClickNotification = (type: number, documentId?: string) => {
    switch (type) {
      case 1: {
        if (documentId) {
          handleCollaborationNav(documentId)
          toast.success('🙂 You accepted the invitation.')
        }
        break
      }
      default: {
        break
      }
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
    <div id='topbar' className={`fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-2 sm:px-20 bg-[#fdfdfd] z-20 ${Ypos > 45 ? 'shadow-sm shadow-gray-300' : ''}`}>
      <video onClick={() => { setStep(1) }} className='absolute -top-[46px] -left-20 sm:-left-4 object-cover h-[150px]' src={logoBlack} autoPlay muted></video>
      <div className="w-full flex justify-end gap-x-10">
        <div className={`relative hidden sm:flex h-11 items-center px-[0.2rem] rounded-[5px] transition-all duration-200 ${isActive ? 'w-[40rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]' : 'w-[20rem] bg-transparent'}`}>
          <input onMouseDown={() => { setIsActive(true) }} onBlur={() => { setIsActive(false) }} onKeyDown={handleEnterEvent} value={prompt} onChange={handleChange} placeholder='What do you want to write about?' type="text" className='w-full h-[40px] bg-[#f3f3f3] ring-0 focus:ring-0 focus:outline-none px-5 rounded-[3px] font-body text-[14px]' />
        </div>
        <div className="flex items-center gap-x-5">
          <img className='hidden sm:flex w-[38px] h-[38px] rounded-full' src="https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?q=80&w=1974&auto=format" alt="profile pic" />
          <div className="hidden lg:flex gap-x-2">
            <button onClick={handlePro} className='h-[40px] px-3 bg-[#40403e] hover:bg-[#585856] rounded-[5px] font-body text-[14px] text-[#ffffff]'>Be a Pro</button>
            <button className='h-[40px] px-3 bg-[#ffffff] hover:bg-indigo-500 border hover:border-transparent rounded-[5px] font-body text-[14px] text-[#40403e] hover:text-[#ffffff] transition-color duration-200'>Submit Project</button>
          </div>
          <button onClick={handleOpenNotifications} className='relative text-[#40403e] hover:text-[#585856] active:text-[#40403e] transition-colors duration-200'>
            <i className="fa-solid fa-bell fa-lg"></i>
            {
              invitations.length > 0 && (
                <div className='absolute bottom-0 -right-1 w-2 h-2 rounded-full bg-red-500'></div>
              )
            }
            {
              openNotifications && (
                <div className='absolute top-6 right-1 py-5 z-20 w-[22rem] border bg-[#ffffff] rounded-[10px] shadow-xl'>
                  {
                    invitations.length > 0 ? (
                      <>
                        {
                          invitations.map((not, i) => (
                            <div className='flex items-start px-2 text-balance text-[0.9rem] text-gray-800' onClick={() => { handleClickNotification(1, not.documentId) }} key={not.recipientId + i}>
                              <p className='h-10 flex items-center w-full border rounded-[8px] px-2 text-left'>{`${not.senderUsername} sent you an invitation to collaborate`}</p>
                            </div>
                          ))
                        }
                      </>
                    )
                      :
                      (
                        <div className='flex items-start px-2 text-balance text-[0.9rem] text-gray-800'>
                          <p className='h-10 flex items-center w-full border rounded-[8px] px-2 text-left'>You have no notifications.</p>
                        </div>
                      )
                  }
                </div>
              )
            }
          </button>
          <div className='relative max-sm:flex hidden'>
            <Hamburger toggle={setHamburgerIsActive} toggled={hamburgerIsActive} size={18} />
            {
              hamburgerIsActive && (
                <div className='absolute top-9 right-4 flex flex-col gap-y-8 w-[22rem] border bg-[#ffffff] rounded-[8px] py-5 px-5'>
                  <div className="flex justify-center">
                    <img className='flex w-20 h-20 rounded-full' src="https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?q=80&w=1974&auto=format" alt="profile pic" />
                  </div>
                  <div className='flex flex-col gap-y-4'>
                    <div className={`relative flex h-11 items-center px-[0.2rem] rounded-[5px] transition-all duration-200 ${isActive ? ' animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]' : 'bg-transparent'}`}>
                      <input onMouseDown={() => { setIsActive(true) }} onBlur={() => { setIsActive(false) }} onKeyDown={handleEnterEvent} value={prompt} onChange={handleChange} placeholder='What do you want to write about?' type="text" className='flex w-full h-[40px] z-20 border bg-[#f3f3f3] ring-0 focus:ring-0 focus:outline-none px-5 rounded-[3px] font-body text-[14px]' />
                    </div>
                    <div className="flex justify-end">
                      <div className="flex gap-x-2">
                        <button onClick={handlePro} className='h-[40px] px-3 bg-[#40403e] hover:bg-[#585856] rounded-[5px] font-body text-[14px] text-[#ffffff]'>Be a Pro</button>
                        <button className='h-[40px] px-3 bg-[#ffffff] hover:bg-indigo-500 border hover:border-transparent rounded-[5px] font-body text-[14px] text-[#40403e] hover:text-[#ffffff] transition-color duration-200'>Submit Project</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
