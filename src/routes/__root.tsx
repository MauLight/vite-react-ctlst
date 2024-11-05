import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        theme='dark'
        limit={1}
      />
    </>
  ),
})