import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ScreenIndex } from '../components/ScreenApp'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const isDev = import.meta.env.DEV
const url = isDev ? import.meta.env.VITE_BACKEND_PORT_DEV : import.meta.env.VITE_BACKEND_PORT_PROD

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
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
      const data = JSON.parse(event.data)
      const currUserId = localStorage.getItem('ctlst-user') !== null ? JSON.parse(localStorage.getItem('ctlst-user') || '').id : ''

      if (data.recipientId === currUserId) {
        toast.success('You received an invitation')
      }
    }
  }, [])

  return (
    <div className="w-screen flex justify-center items-center">
      <ScreenIndex />
    </div>
  )
}