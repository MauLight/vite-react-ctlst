import { useState, type ReactElement } from 'react'
import { Navbar } from './Navbar'
import { Topbar } from './Topbar'
import { Creator } from './Creator'
import { ScreenHome } from './ScreenHome'
import { Pricing } from './Pricing'
import { StreamElementProps } from '../utils/types'
// @ts-expect-error: Unreachable code error
import html2pdf from 'html2pdf.js'
import { format } from 'date-fns'
import { Help } from './Help'
import Screenplay from './Screenplay'
import { TheQuest } from './TheQuest'
import { Chat } from './Chat/Chat'
import { toast } from 'react-toastify'
import { WaitingRoom } from './WaitingRoom'

export const ScreenIndex = (): ReactElement => {
  const [step, setStep] = useState<number>(1)
  const [prompt, setPrompt] = useState<string>('')

  const [stream, setStream] = useState<StreamElementProps[] | null>(null)
  const [creatorInputValue, setCreatorInputValue] = useState<string>('')

  const [chatIsOpen, setChatIsOpen] = useState(false)

  const handlePrintScreenplay = (): void => {
    const element = document.getElementById('screenplay')
    const opt = {
      hotfixes: 'px_scaling',
      margin: 1,
      filename: `Screenplay-${format(new Date(), 'yyyy-MMM-dd')}.pdf`,
      jsPDF: {
        unit: 'mm', format: 'letter', orientation: 'portrait'
      }
    }
    html2pdf().from(element).set(opt).save()
  }

  const sendInvitationToUserAsync = async () => {
    setTimeout(() => {
      toast.success('User accepted the invitation.')
      if (stream !== null) {
        const removeWaitingRoom = stream.filter((elem) => elem.type !== 'waitingroom')
        setStream([...removeWaitingRoom, { id: stream.length, type: 'screenplay', component: <Screenplay /> }])
      }
    }, 10000)
  }

  const handleEnterInput = (e: { key: string }) => {
    if (e.key === 'Enter') {
      if (creatorInputValue.length > 0 && stream !== null) {

        if (creatorInputValue.includes('invite')) {
          console.log('this is an invite')

          const invitedUser = creatorInputValue.split('/invite')[1].split(' ')[1].trim()
          const invitedPriviledges = creatorInputValue.split('/invite')[1].split(' ')[2].trim()
          console.log(invitedUser)
          console.log(invitedPriviledges)

          if (stream[stream.length - 1].type !== 'screenplay') {
            toast.error('Screenplay instance must be open before inviting a user.')
            return
          }

          toast.success(`Invitation sent to ${invitedUser}`)
          setCreatorInputValue('')
          setStream([...stream, { id: stream.length, type: 'waitingroom', component: <WaitingRoom /> }])

          sendInvitationToUserAsync()

          return
        }

        switch (creatorInputValue) {
          case '/screenplay':
            setStream([...stream, { id: stream.length, type: 'screenplay', component: <Screenplay /> }])
            break
          case '/print':
            handlePrintScreenplay()
            break
          case '/creator':
            setStream([...stream, { id: stream.length, type: 'creator', component: <TheQuest /> }])
            break
          case '/chat':
            setStream([...stream, { id: stream.length, type: 'chat', component: <div>Chat</div> }])
            break
          case '/help':
            setStream([...stream, { id: stream.length, type: 'help', component: <Help /> }])
            break
          default:
            setStream([...stream, { id: stream.length, type: 'warning', component: <div>Help with warning.</div> }])
            break
        }
        setCreatorInputValue('')
      }
    }
  }

  const handlePro = () => {
    if (step === 3) setStep(1)
    else setStep(3)
  }

  return (
    <div className='w-full bg-[#fdfdfd] flex justify-center items-center px-20 overflow-scroll scrollbar-hide'>
      {/* topbar */}
      <Topbar handlePro={handlePro} prompt={prompt} setPrompt={setPrompt} setStep={setStep} />
      <div className="w-full pt-20 pb-20">
        {
          step === 1 && (
            <ScreenHome />
          )
        }
        {
          step === 2 && (
            <Creator stream={stream} setStream={setStream} prompt={prompt} />
          )
        }
        {
          step === 3 && (
            <Pricing handlePro={handlePro} />
          )
        }
      </div>
      {/* navbar */}
      <Navbar
        creatorInputValue={creatorInputValue}
        setCreatorInputValue={setCreatorInputValue}
        handleEnterInput={handleEnterInput}
        step={step}
        setChatIsOpen={setChatIsOpen}
      />
      <Chat chatIsOpen={chatIsOpen} setChatIsOpen={setChatIsOpen} />
    </div>
  )
}
