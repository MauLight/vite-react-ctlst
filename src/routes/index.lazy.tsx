import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ScreenIndex } from '../components/ScreenApp'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { InvitationProps } from '../utils/types'

const isDev = import.meta.env.DEV
const url = isDev ? import.meta.env.VITE_BACKEND_PORT_DEV : import.meta.env.VITE_BACKEND_PORT_PROD

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const [invitations, setInvitations] = useState<InvitationProps[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const currUser = localStorage.getItem('ctlst-user')
    if (!currUser) {
      navigate({ to: '/login' })
    }
  }, [])

  useEffect(() => {
    const eventSource = new EventSource(`${url}/api/events`)
    eventSource.onmessage = (event) => {
      console.log(event)
      const data = JSON.parse(event.data)
      const currUserId = localStorage.getItem('ctlst-user') !== null ? JSON.parse(localStorage.getItem('ctlst-user') || '').id : ''

      if (data.recipientId === currUserId) {
        setInvitations((prevInvitations) => [...prevInvitations, data])
        toast.success('You received an invitation')
      }
    }
    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className="w-screen flex justify-center items-center">
      <ScreenIndex invitations={invitations} />
    </div>
  )
}