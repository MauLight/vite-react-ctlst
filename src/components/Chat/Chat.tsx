import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import user1 from '../../assets/1.webp'
import user2 from '../../assets/2.webp'
import user3 from '../../assets/3.webp'
import user4 from '../../assets/4.webp'
import user5 from '../../assets/5.webp'
import user6 from '../../assets/6.webp'
import user7 from '../../assets/7.webp'
import user8 from '../../assets/8.webp'
import user9 from '../../assets/9.webp'
import user10 from '../../assets/10.webp'
import chat_bg from '../../assets/chat_bg2.webp'
import { toast } from 'react-toastify'
import { fadeIn } from '../../utils/functions'

interface ChatProps {
    chatIsOpen: boolean,
    setChatIsOpen: Dispatch<SetStateAction<boolean>>
}

interface UserProps {
    id: number
    pic: string
    username: string
    active: boolean
}

const users = [
    { id: 1, pic: user6, username: 'alice', active: true },
    { id: 2, pic: user2, username: 'bob', active: false },
    { id: 3, pic: user7, username: 'charlie', active: true },
    { id: 4, pic: user10, username: 'dave', active: true },
    { id: 5, pic: user5, username: 'eve', active: false },
    { id: 6, pic: user1, username: 'frank', active: true },
    { id: 7, pic: user3, username: 'grace', active: false },
    { id: 8, pic: user8, username: 'heidi', active: true },
    { id: 9, pic: user9, username: 'ivan', active: true },
    { id: 10, pic: user4, username: 'judy', active: false },
]

const upperFirstLetter = (word: string) => {
    const firstLetter = [...word][0]
    const newWord = word.replace(firstLetter, firstLetter.toUpperCase())
    return newWord
}

export const Chat = ({ chatIsOpen, setChatIsOpen }: ChatProps): ReactElement => {
    const [selectedUser, setSelectedUser] = useState<UserProps | null>(null)
    const [currChatValue, setCurrChatValue] = useState<string>('')
    const [chatStream, setChatStream] = useState<{ id: number, text: string, date: string, sender: string, recipient: string }[]>([])

    const scrollRef: RefObject<HTMLDivElement> = useRef(null)

    const handleIndividualChat = (user: UserProps) => {
        setSelectedUser(user)
    }

    const handleSubmitToChat = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (currChatValue !== '') {
            setChatStream([...chatStream, { id: chatStream.length + 1, text: currChatValue, date: Date.now().toString(), sender: 'me', recipient: selectedUser?.username || '' }])
            setCurrChatValue('')
        }
    }

    //* This needs to be changed for id
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(selectedUser?.username || '')
        toast.success(`UserId copied to clipboard.`)
    }

    useEffect(() => {
        if (chatStream.length === 2) {
            setTimeout(() => {
                const newMessage = {
                    id: chatStream.length + 1,
                    text: 'Hey Mau, what\'s up?',
                    date: Date.now().toString(),
                    sender: selectedUser?.username || '',
                    recipient: 'me'
                }
                setChatStream([...chatStream, newMessage])
            }, 5000)
            return
        }
        if (chatStream.length === 4) {
            setTimeout(() => {
                const newMessage = {
                    id: chatStream.length + 1,
                    text: 'Sure thing, I wonder what you\'re working on',
                    date: Date.now().toString(),
                    sender: selectedUser?.username || '',
                    recipient: 'me'
                }
                setChatStream([...chatStream, newMessage])
            }, 4000)
            return
        }
        if (chatStream.length === 6) {
            setTimeout(() => {
                const newMessage = {
                    id: chatStream.length + 1,
                    text: 'Okay 👍',
                    date: Date.now().toString(),
                    sender: selectedUser?.username || '',
                    recipient: 'me'
                }
                setChatStream([...chatStream, newMessage])
            }, 4000)
            return
        }
    }, [chatStream])

    useEffect(() => {
        const lastDiv = scrollRef.current
        if (lastDiv !== null) {
            lastDiv.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatStream])

    return (
        <div className={`fixed ${chatIsOpen ? 'right-10' : '-right-72'} bottom-10 w-[250px] border rounded-[20px] bg-[#ffffff] shadow-xl z-20 transition-all duration-200`}>
            <i onClick={() => { setChatIsOpen(false) }} className="absolute -top-1 -right-0 fa-solid fa-xmark fa-md hover:rotate-45 hover:text-indigo-500 transition-all duration-200 z-20"></i>
            <h1 onClick={() => { setSelectedUser(null); setChatStream([]) }} className='text-center text-gray-800 py-2 hover:text-indigo-500 transition-colors duration-200 cursor-pointer'>Chats</h1>
            <div className='rounded-[20px] h-[350px] p-1 overflow-y-scroll scrollbar-hide'>

                {
                    selectedUser ? (
                        <>
                            <div className='relative w-full h-full rounded-b-[15px] border animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-start justify-between overflow-hidden'>
                                <img className='absolute h-full w-full z-0 object-cover grayscale opacity-5' src={chat_bg} alt="bg" />
                                <div className="flex items-center gap-x-2 p-2 z-10 bg-[#40403e] w-full">
                                    <div className='relative flex'>
                                        <div className={`absolute right-0 bottom-0 w-2 h-2 ${selectedUser.active ? 'bg-green-500' : 'bg-transparent'} rounded-full`}></div>
                                        <img className='w-8 h-8 min-w-8 rounded-full object-cover' src={selectedUser.pic} alt="user" />
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <h1 className='text-[0.9rem] text-gray-50'>{upperFirstLetter(selectedUser.username)}</h1>
                                        <button onClick={handleCopyToClipboard} className='text-gray-50 hover:text-indigo-500 transition-colors duration-200'>
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className='h-full w-full overflow-y-scroll scrollbar-hide py-2 z-10'>
                                    {
                                        chatStream.length > 0 && chatStream.map((text) => (
                                            <div key={text.id} className={`flex flex-col px-2 py-1 ${text.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                                <motion.div
                                                    variants={fadeIn(text.sender === 'me' ? 'left' : 'right', 0.03)}
                                                    initial={'hidden'}
                                                    whileInView={'show'}
                                                    viewport={{ once: true, amount: 0.1 }}
                                                    className={`px-2 py-1 rounded-[8px] shadow-sm ${text.sender === 'me' ? 'bg-indigo-200' : 'bg-gray-50'}`}>
                                                    <p className='text-[0.9rem] text-gray-800'>{text.text}</p>
                                                </motion.div>
                                            </div>
                                        ))
                                    }
                                    <div ref={scrollRef}></div>
                                </div>
                                <form onSubmit={handleSubmitToChat} className="h-10 w-full flex items-center bg-[#40403e] p-2 z-10">
                                    <input value={currChatValue} onChange={({ target }) => { setCurrChatValue(target.value) }} type="text" className='relative h-6 w-full bg-[#10100e] rounded-full pl-2 pr-9 text-gray-200 text-[0.8rem] outline-none' />
                                    <button type='submit' className='absolute right-5 '>
                                        <i className="fa-solid fa-paper-plane text-gray-200"></i>
                                    </button>
                                </form>
                            </div>
                        </>
                    )
                        :
                        (
                            <>
                                {
                                    users.map((user: UserProps) => (
                                        <div onClick={() => { handleIndividualChat(user) }} className={`h-9 border-t border-gray-100 flex items-center justify-start gap-x-5 px-5 hover:bg-slate-50 cursor-pointer`} key={user.id}>
                                            <div className='relative'>
                                                <div className={`absolute -right-1 bottom-0 w-2 h-2 ${user.active ? 'bg-green-500' : 'bg-transparent'} rounded-full`}></div>
                                                <img className='w-6 h-6 rounded-full object-cover' src={user.pic} alt="user" />
                                            </div>
                                            <h1 className='text-[0.8rem] text-gray-600'>{upperFirstLetter(user.username)}</h1>
                                        </div>
                                    ))
                                }
                            </>
                        )
                }
            </div>
        </div>
    )
}
