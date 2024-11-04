import { Dispatch, SetStateAction, useState, type ReactElement } from 'react'
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
    { id: 3, pic: user3, username: 'charlie', active: true },
    { id: 4, pic: user10, username: 'dave', active: true },
    { id: 5, pic: user5, username: 'eve', active: false },
    { id: 6, pic: user1, username: 'frank', active: true },
    { id: 7, pic: user7, username: 'grace', active: false },
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

    const handleIndividualChat = (user: UserProps) => {
        console.log('clicked!')
        setSelectedUser(user)
    }

    return (


        <div className={`fixed ${chatIsOpen ? 'right-10' : '-right-72'} bottom-10 w-[250px] h-[400px] border rounded-[20px] bg-[#ffffff] shadow-xl z-20 transition-all duration-200`}>
            <i onClick={() => { setChatIsOpen(false) }} className="absolute -top-1 -right-0 fa-solid fa-xmark fa-md hover:rotate-45 hover:text-indigo-500 transition-all duration-200 z-20"></i>
            <div className='h-[400px] rounded-[20px] overflow-hidden p-1'>

                {
                    selectedUser ? (
                        <>
                            <h1 className='text-center text-gray-800 py-2'>Chats</h1>
                            <div className='w-full h-[89%] rounded-b-[15px] border bg-indigo-500 flex items-end overflow-hidden'>
                                <div className="h-10 w-full flex items-center bg-slate-700 p-2">
                                    <input type="text" className='relative h-6 w-full bg-[#10100e] rounded-full px-2 text-gray-200 text-[0.8rem] outline-none' />
                                    <i className="absolute right-5 fa-solid fa-paper-plane text-gray-200"></i>
                                </div>
                            </div>
                        </>
                    )
                        :
                        (
                            <>
                                <h1 className='text-center text-gray-800 py-2'>Chats</h1>
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
