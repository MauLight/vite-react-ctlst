import { Dispatch, SetStateAction, useState, type ReactElement } from 'react'
import { getScrenplaysByUserId } from '../../api/apiCalls'
import { motion } from 'framer-motion'
import { fadeIn } from '../../utils/functions'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

interface NavbarButtonsProps {
  expandSearch: boolean
  setExpandSearch: Dispatch<SetStateAction<boolean>>
  handleCollaborationNav: (id: string) => void
}

interface ScreenplayProps {
  id: string
  title: string
  userId: string
  body: string
  allowedUsers: string[]
  updated_at: string
  created_at: string
}

export const NavbarButtons = ({ expandSearch, setExpandSearch, handleCollaborationNav }: NavbarButtonsProps): ReactElement => {
  const [screenplaysFromDb, setScreenplaysFromDb] = useState<ScreenplayProps[]>([])
  const [openScreenplaysMenu, setOpenScreenplayMenu] = useState<boolean>(false)

  const handleSearch = () => {
    if (!expandSearch) setExpandSearch(true)
  }

  const handleOpenProjects = async () => {
    if (screenplaysFromDb.length === 0) {
      const { screenplays } = await getScrenplaysByUserId()
      if (screenplays.length === 0) {
        toast.error('You have no saved screenplays.')
      }
      setScreenplaysFromDb(screenplays)
    }

    setOpenScreenplayMenu(!openScreenplaysMenu)
  }

  const handleClickNotification = (type: number, id?: string) => {
    switch (type) {
      case 1: {
        if (id) {
          handleCollaborationNav(id)
        }
        break
      }
      default: {
        break
      }
    }
  }

  return (
    <div className="flex gap-x-2 bg-[#40403e] py-1 px-2 rounded-[5px]">
      <div onBlur={() => { setExpandSearch(false) }} onClick={handleSearch} className={`${expandSearch ? 'w-[200px]' : ''} h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] cursor-pointer transition-all duration-400`}>
        {
          expandSearch ? (
            <input type="text" placeholder='Search' className='w-full h-full bg-[#40403e] ring-0 focus:ring-0 focus:outline-none text-[16px] font-body text-[#ffffff]' />
          ) : (
            <p className='font-body text-[16px] text-[#ffffff]'>Search</p>
          )
        }
      </div>
      <div onClick={handleOpenProjects} className='h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] transition-color duration-200 cursor-pointer'>
        <p className='font-body text-[16px] text-[#ffffff]'>Projects</p>
      </div>
      <div className='h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] transition-color duration-200 cursor-pointer'>
        <p className='font-body text-[16px] text-[#ffffff]'>Contests</p>
      </div>
      <div className='h-full flex justify-center items-center px-3 rounded-[5px] border border-[#585856] hover:border-[#888887] transition-color duration-200 cursor-pointer'>
        <p className='font-body text-[16px] text-[#ffffff]'>Courses</p>
      </div>
      {
        openScreenplaysMenu && screenplaysFromDb.length > 0 && (
          <motion.div
            variants={fadeIn('top', 0.1)}
            initial={'hidden'}
            whileInView={'show'}
            viewport={{ once: true, amount: 0.1 }}
            className='absolute -top-[210px] left-0 w-full h-[200px] flex flex-col gap-y-2 py-8 px-10 rounded-[8px] bg-[#ffffff]'>
            <h1 className='text-gray-800 text-[1.2rem]'>Your Screenplays: </h1>
            <div className='overflow-scroll scrollbar-hide flex flex-col gap-y-1'>
              {
                screenplaysFromDb.map((screenplay) => (
                  <ul key={screenplay.id}>
                    <li onClick={() => { handleClickNotification(1, screenplay.id) }} className='flex gap-x-5 items-end cursor-pointer'>
                      <p className='leading-none animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text transition-all duration-200'>- {screenplay.title}</p>
                      <p className='text-[0.8rem] text-gray-600 leading-none'>{`Last update on ${format(new Date(Number(screenplay.updated_at)), 'PPP')}`}</p>
                    </li>
                  </ul>
                ))
              }
            </div>
          </motion.div>
        )
      }
    </div>
  )
}
