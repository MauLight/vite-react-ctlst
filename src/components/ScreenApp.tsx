import { useState, type ReactElement } from 'react'
// @ts-expect-error: Unreachable code error
import html2pdf from 'html2pdf.js'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

//* Components
import { Navbar } from './Navbar'
import { Topbar } from './Topbar'
import { Creator } from './Creator'
import { ScreenHome } from './ScreenHome'
import { Pricing } from './Pricing'
import { Help } from './Help'
import Screenplay from './Screenplay'
import { TheQuest } from './TheQuest'
import { Chat } from './Chat/Chat'
import { WaitingRoom } from './WaitingRoom'

import { InvitationProps, StreamElementProps } from '../utils/types'
import { sendInvitationToScreenplayAsync } from '../api/apiCalls'

export const ScreenIndex = ({ invitations }: { invitations: InvitationProps[] }): ReactElement => {
  const [step, setStep] = useState<number>(1)
  const [prompt, setPrompt] = useState<string>('')

  const [stream, setStream] = useState<StreamElementProps[]>([])
  const [creatorInputValue, setCreatorInputValue] = useState<string>('')

  const [chatIsOpen, setChatIsOpen] = useState<boolean>(false)
  const [documentId, setDocumentId] = useState<string>('')
  const [isCollaboration, setIsCollaboration] = useState<boolean>(false)

  const [expandNav, setExpandNav] = useState<boolean>(true)

  const handlePrintScreenplay = (): void => {
    const element = document.getElementById('screenplay')
    const opt = {
      hotfixes: 'px_scaling',
      margin: [20, 1, 35, 1],
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
        setStream([...removeWaitingRoom])
      }
    }, 10000)
  }

  const handleCollaborationNav = (documentId: string) => {
    console.log(documentId)
    setIsCollaboration(true)
    setStream([...stream, { id: stream.length, type: 'screenplay', component: <Screenplay isCollaboration documentId={documentId} setDocumentId={setDocumentId} /> }])
    setExpandNav(false)
    setStep(2)
  }

  const handleEnterInput = (e: { key: string }) => {
    if (e.key === 'Enter') {
      if (creatorInputValue.length > 0 && stream) {

        if (creatorInputValue.includes('invite')) {
          const invitedUser = creatorInputValue.split('/invite')[1].split(' ')[1].trim()

          if (stream[stream.length - 1].type !== 'screenplay') {
            toast.error('Screenplay instance must be open before inviting a user.')
            return
          }

          sendInvitationToScreenplayAsync(invitedUser, documentId)
          setCreatorInputValue('')
          setStream([...stream, { id: stream.length, type: 'waitingroom', component: <WaitingRoom /> }])

          sendInvitationToUserAsync()

          return
        }

        if (creatorInputValue.includes('screenplay') && creatorInputValue.substring(12)) {
          const title = creatorInputValue.substring(12)
          if (title) {
            setStream([...stream, { id: stream.length, type: 'screenplay', component: <Screenplay title={title} setDocumentId={setDocumentId} /> }])
          }
          setExpandNav(false)
          setCreatorInputValue('')
          return
        }

        switch (creatorInputValue) {
          case '/screenplay':
            setStream([...stream, { id: stream.length, type: 'screenplay', component: <Screenplay setDocumentId={setDocumentId} /> }])
            setExpandNav(false)
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
            setStream([...stream, { id: stream.length, type: 'warning', component: <Help /> }])
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
    <div className='w-full bg-[#fdfdfd] flex justify-center items-center px-5 sm:px-20 overflow-scroll scrollbar-hide'>
      {/* topbar */}
      <Topbar
        invitations={invitations}
        handlePro={handlePro}
        prompt={prompt}
        setPrompt={setPrompt}
        setStep={setStep}
        handleCollaborationNav={handleCollaborationNav}
      />
      <div className="w-full pt-20 pb-20">
        {
          step === 1 && (
            <ScreenHome />
          )
        }
        {
          step === 2 && (
            <Creator isCollaboration={isCollaboration} stream={stream} setStream={setStream} prompt={prompt} />
          )
        }
        {
          step === 3 && (
            <Pricing handlePro={handlePro} />
          )
        }
      </div>
      <Navbar
        expandNav={expandNav}
        setExpandNav={setExpandNav}
        handleCollaborationNav={handleCollaborationNav}
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
