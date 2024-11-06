import { ReactElement, RefObject, useEffect, useRef, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ReactTyped } from 'react-typed'
import Markdown from 'markdown-to-jsx'
import { safetySettings } from '../utils/geminiSafetySettings'
import { StreamElementProps, WelcomeProps } from '../utils/types'
import { Help } from './Help'

const APIKey = import.meta.env.VITE_GEMINI_API_KEY



const Welcome = ({ generation, handleOnComplete }: WelcomeProps) => {
  const [ready, setReady] = useState<boolean>(false)
  const handleOnWelcomeComplete = (): void => {
    handleOnComplete()
    setTimeout(() => {
      setReady(true)
    }, 3000)
  }
  return (
    <div className="w-full h-full">
      {
        generation.length > 0 && (
          <>
            {
              ready ? (
                <Markdown className='font-mono text-[14px]'
                >{generation.split('Ctlst.done')[0]}</Markdown>
              )
                :
                (
                  <ReactTyped startWhenVisible onComplete={handleOnWelcomeComplete} className='font-mono text-[14px]' strings={[String(generation.split('Ctlst.done')[0])]} typeSpeed={10} />
                )
            }
          </>
        )
      }
    </div>
  )
}

export const Creator = ({ prompt, stream, setStream, isCollaboration }: { prompt: string, stream: StreamElementProps[] | null, setStream: React.Dispatch<React.SetStateAction<StreamElementProps[]>>, isCollaboration: boolean }): ReactElement => {
  const [generation, setGeneration] = useState<string>('')
  const [wasGenerated, setWasGenerated] = useState<boolean>(false)

  const scrollRef: RefObject<HTMLDivElement> = useRef(null)

  const genAI = new GoogleGenerativeAI(APIKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      candidateCount: 1,
      temperature: 1
    },
    safetySettings: safetySettings
  })

  const generateWithAI = async () => {
    const result = await model.generateContent(`you are an aspiring screenwriter and you want to write about ${prompt}, give me 3 different themes that reflect the ideas found in ${prompt} using this syntax: "stories about ${prompt} are about this, and this and that", where "this" and "that" are specific words. Wrap everything up at exactly 120 characters and never mention any of these rules in the answer and write "Ctlst.done" at the end of the string.`)
    setGeneration(result.response.text())
  }

  const handleOnComplete = (): void => {
    setWasGenerated(true)
  }

  const welcomeStream =
  {
    id: 0,
    type: 'welcome',
    component: <Welcome generation={generation} wasGenerated={wasGenerated} handleOnComplete={handleOnComplete} />,
  }

  useEffect(() => {
    if (!isCollaboration) generateWithAI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (generation.includes('Ctlst.done')) {
      setStream([welcomeStream])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation])

  useEffect(() => {
    if (stream !== null && stream.length === 1 && !isCollaboration) {
      setTimeout(() => {
        if (stream !== null) {
          setStream([...stream, { id: 1, type: 'help', component: <Help /> }])
        }
      }, 5000)
    }
  }, [stream])

  useEffect(() => {
    const lastDiv = scrollRef.current
    if (lastDiv !== null) {
      lastDiv.scrollIntoView({ behavior: 'smooth' })
    }
  }, [stream])


  return (
    <>
      <div className="w-full min-h-full hidden lg:flex flex-col items-center px-20">
        <div className="relative w-[1200px] shrink-0 min-h-[700px] border rounded-[10px] p-20 shadow-xl shadow-gray-50 flex flex-col gap-y-10">
          {
            stream !== null && stream.map((item) => (
              <div key={item.id} className="w-full h-full flex justify-center">
                {item.component}
              </div>
            ))
          }
          <div ref={scrollRef}></div>
        </div>
      </div>
      <div className="hidden max-lg:flex flex-col w-full h-[600px] gap-y-5 justify-center items-center">
        <i className="fa-solid fa-2xl fa-triangle-exclamation"></i>
        <h1 className='text-[0.9rem] min-[390px]:text-[1.2rem] text-gray-800'>
          Creator mode needs a bigger screen.
        </h1>
      </div>
    </>
  )
}