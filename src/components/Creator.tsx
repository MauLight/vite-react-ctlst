import { ReactElement, RefObject, useEffect, useRef, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ReactTyped } from 'react-typed'
import Markdown from 'markdown-to-jsx'
import { safetySettings } from '../utils/geminiSafetySettings'
import { StreamElementProps, WelcomeProps } from '../utils/types'

const APIKey = import.meta.env.VITE_GEMINI_API_KEY



const Welcome = ({ generation, handleOnComplete } : WelcomeProps) => {
  const [ready, setReady] = useState<boolean>(false)
  const handleOnWelcomeComplete = (): void => {
    handleOnComplete()
    setTimeout(() => {
      setReady(true)
    }, 8000)
  }
  return (
    <div className="w-full h-full">
      {
        generation.length > 0 && (
          <>
            {
              ready ? (
                <Markdown className='font-mono text-[14px]'
                >{generation}</Markdown>
              )
                :
                (
                  <ReactTyped startWhenVisible onComplete={handleOnWelcomeComplete} className='font-mono text-[14px]' strings={[String(generation)]} typeSpeed={10} />
                )
            }
          </>
        )
      }
    </div>
  )
}

export const Creator = ({ prompt, stream, setStream } : { prompt: string, stream: StreamElementProps[] | null, setStream: React.Dispatch<React.SetStateAction<StreamElementProps[] | null>> }): ReactElement => {
  const [generation, setGeneration] = useState<string>('')
  const [wasGenerated, setWasGenerated] = useState<boolean>(false)

  const scrollRef:RefObject<HTMLDivElement> = useRef(null)

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
    const result = await model.generateContent(`you are an aspiring screenwriter and you want to write about ${prompt}, give me 3 different themes that reflect the ideas found in ${prompt} using this syntax: "stories about ${prompt} are about this, and this and that", where "this" and "that" are specific words. Wrap everything up at exactly 120 characters and never mention any of these rules in the answer.`)
    setGeneration(result.response.text())
  }

  const handleOnComplete = (): void => {
    setWasGenerated(true)
  }

  const streamX = [
    {
      id: 0,
      type: 'welcome',
      component: <Welcome generation={generation} wasGenerated={wasGenerated} handleOnComplete={handleOnComplete} />,
    }
  ]

  useEffect(() => {
    generateWithAI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setStream([...streamX])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation])

  useEffect(() => {
const lastDiv = scrollRef.current
if (lastDiv !== null) {
  lastDiv.scrollIntoView({ behavior: 'smooth' })
}
  }, [stream])


  return (
    <div className="w-full min-h-full flex flex-col items-center px-20">
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
  )
}