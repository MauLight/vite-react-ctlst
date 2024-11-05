
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ReactElement, useEffect, useState } from 'react'
import { ClockLoader } from 'react-spinners'
import bg from '../assets/bg.webp'
import logoWhite from '../assets/Logo text.webm'
import logoBlack from '../assets/Logo text black.webm'
import { useMutation } from '@tanstack/react-query'
import { postLogin } from '../api/apiCalls'

const footerItems = [
  { name: 'Help', link: '#' },
  { name: 'Privacy', link: '#' },
  { name: 'Terms', link: '#' }
]

const Login = (): ReactElement => {
  const [currStep, setCurrStep] = useState(1)
  const navigate = useNavigate()

  //const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      setCurrStep(3)
      setFieldValueUsername('')
      setFieldValuePassword('')
      navigate({ to: '/' })
    },
    onError: (error) => {
      console.log(error.message)
      setCurrStep(0)
    }
  })

  const [fieldValueUsername, setFieldValueUsername] = useState<string>('')
  const [fieldValuePassword, setFieldValuePassword] = useState<string>('')
  const [labelAnimationUsername, setLabelAnimationUsername] = useState<boolean>(false)
  const [labelAnimationPassword, setLabelAnimationPassword] = useState<boolean>(false)

  const handleTryAgain = (): void => {
    if (fieldValuePassword.length > 0) setCurrStep(2)
    else setCurrStep(1)
  }

  const handleLogin = () => {
    mutation.mutate({
      username: fieldValueUsername,
      password: fieldValuePassword
    })
  }

  useEffect(() => {
    if (currStep === 3) {
      setTimeout(() => {
        setCurrStep(1)
      }, 5000)
    }
  }, [currStep])

  return (
    <div className='relative w-full h-screen flex justify-center items-center'>
      <div className="absolute top-0 left-0 w-full h-[60px] flex justify-start px-10 bg-[#10100e]">
        <div className="relative w-[85px] flex items-center gap-x-2">
          <i className="fa-solid fa-circle text-indigo-500"></i>
          <video className='absolute -top-[46px] left-5 object-cover h-[150px]' src={logoWhite} autoPlay muted></video>

        </div>
      </div>
      {
        currStep === 3 ? (
          <div className="w-full h-full flex items-center justify-center gap-x-3 overflow-hidden">
            <ClockLoader color='#ffffff' />
            <h1 className='font-body text-4xl text-[#ffffff]'>Thank you.</h1>
          </div>
        )
          :
          (
            <div className="w-[300px] flex flex-col gap-y-2">
              <div className="relative w-[320px] min-h-[300px] bg-[#ffffff] flex flex-col rounded-[5px] px-5 pt-20 pb-4 gap-y-4">
                <div className="flex flex-col items-center gap-y-1">
                  <video className='absolute -top-10' src={logoBlack} autoPlay muted loop></video>
                  <h1 className='font-light text-[1rem] text-[#10100e]'>Log in to Ctlst</h1>
                </div>
                <div className='flex flex-col gap-y-3'>
                  <div className='relative w-full h-[50px] border border-indigo-500 rounded-[5px] px-2 overflow-hidden'>
                    <label htmlFor='username' className={`absolute ${labelAnimationUsername || fieldValueUsername.length > 0 ? 'top-1 pl-2 text-[12px] text-indigo-400' : 'top-3 pl-2 text-[16px] text-gray-600'} font-light transition-all duration-200`}>username</label>
                    <input id='username' value={fieldValueUsername} onChange={({ target }) => { setFieldValueUsername(target.value) }} onMouseDown={() => { setLabelAnimationUsername(true) }} onBlur={() => { setLabelAnimationUsername(false) }} type="username" className='absolute h-8 flex items-end font-light text-[0.9rem] text-gray-600 bg-transparent bottom-0 px-2 w-full ring-0 focus:ring-0 focus:outline-none' />
                  </div>
                  <div className={`relative w-full ${currStep === 2 ? 'h-[50px]' : 'h-0 hidden'} border border-indigo-500 rounded-[5px] px-2 overflow-hidden transition-all duration-200`}>
                    <label htmlFor='password' className={`absolute ${labelAnimationPassword || fieldValuePassword.length > 0 ? 'top-1 pl-2 text-[12px] text-indigo-400' : 'top-3 pl-2 text-[16px] text-gray-600'} font-light transition-all duration-200`}>Password</label>
                    <input id='password' value={fieldValuePassword} onChange={({ target }) => { setFieldValuePassword(target.value) }} onMouseDown={() => { setLabelAnimationPassword(true) }} onBlur={() => { setLabelAnimationPassword(false) }} type="password" className='absolute h-8 flex items-end font-light text-[0.9rem] text-gray-600 bg-transparent bottom-0 px-2 w-full ring-0 focus:ring-0 focus:outline-none' />
                  </div>
                  {
                    currStep === 1 ? (
                      <button onClick={() => { setCurrStep(2) }} className='w-full h-10 bg-indigo-500 text-[#ffffff] rounded-[5px]'>Next</button>
                    )
                      :
                      (
                        <button onClick={handleLogin} className='w-full h-10 bg-indigo-500 text-[#ffffff] rounded-[5px]'>Sign in</button>
                      )
                  }
                </div>
                <div className="flex justify-center gap-x-1">
                  <p className='text-[14px] font-light text-gray-600'>Not a Ctlst member?</p>
                  <button className='text-[14px] text-indigo-500 font-light'>Sign up here.</button>
                </div>
              </div>
              <div className="flex justify-end gap-x-2">
                {
                  footerItems.map((item, i) => (
                    <a key={i} href={item.link} className='text-[#ffffff] font-light text-[14px]'>{item.name}</a>
                  ))
                }
              </div>
            </div>
          )
      }
      <img alt='background' src={bg} className='absolute w-full h-full object-cover opacity-90 -z-10' />
      <div className='absolute w-full h-full object-cover bg-[#10100e] opacity-30 -z-10'></div>
      {
        currStep === 0 && (
          <div className='absolute w-full h-full flex flex-col justify-center items-center bg-transparent'>
            <div className="relative w-full h-full flex flex-col justify-center items-center">
              <div className='z-10 flex flex-col gap-y-6 bg-[#ffffff] p-5 rounded-[5px] shadow-xl shadow-gray-400 border-t border-gray-50'>
                <p className='font-light text-gray-600 text-[18px]'>{fieldValuePassword.length > 0 ? 'Password must contain at least one uppercase, one number and one special character.' : 'A valid username must be provided.'}</p>
                <div className="flex justify-end gap-x-2">
                  <button className='h-10 w-[150px] rounded-[5px] bg-[#ffffff] flex gap-x-1 items-center justify-center border'>
                    <i className="fa-brands fa-md fa-google"></i>
                    <p className='font-light text-[15px] text-gray-600'>Try with Google</p>
                  </button>
                  <button onClick={handleTryAgain} className='h-10 w-[150px] rounded-[5px] bg-indigo-500 hover:bg-blue-400 active:bg-indigo-500 font-light text-[15px] text-[#ffffff]'>Try again</button>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-[#ffffff] bg-blue-0 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-60 opacity-60 z-0"></div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export const Route = createLazyFileRoute('/login')({
  component: Login,
})

