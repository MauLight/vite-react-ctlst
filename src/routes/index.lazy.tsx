import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ScreenIndex } from '../components/ScreenApp'
import { useEffect } from 'react'

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

  return (
    <div className="w-screen flex justify-center items-center">
      <ScreenIndex />
    </div>
  )
}