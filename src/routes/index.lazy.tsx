import { createLazyFileRoute } from '@tanstack/react-router'
import { ScreenIndex } from '../components/ScreenApp'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="w-screen flex justify-center items-center">
      <ScreenIndex />
    </div>
  )
}