import { type ReactElement } from 'react'
import poster_1 from '../assets/film_festival_poster.webp'
import { format } from 'date-fns'
import { TitleText } from '../components/Common/TitleText'
import { ScreenplayList } from './ScreenplayList'

export const ScreenHome = (): ReactElement => {
  return (
    <div className="w-full flex flex-col pt-5 gap-y-20">
      <div className="flex flex-col gap-y-5">
        <div className="flex justify-center items-center gap-x-2">
          <p className='font-body text-[16px] text-gray-600'>News of the day</p>
          <div className="flex px-2 border border-gray-300 rounded-[3px]">
            <p className='font-body text-gray-800 text-[16px]'>{format(new Date(), 'MMM dd, yyyy')}</p>
          </div>
          <div className="flex gap-x-1">
            <p className='font-body text-[16px] text-gray-500'>in</p>
            <p className='font-body text-[16px] text-gray-500 underline'>Contests</p>
          </div>
        </div>
        <div className='w-full flex justify-center gap-x-5'>
          <TitleText secondaryColor='text-indigo-500' uppercase size='text-8xl' text='Ctlst' />
          <TitleText secondaryColor='text-indigo-500' uppercase size='text-8xl' text='Film' />
          <TitleText secondaryColor='text-indigo-500' uppercase size='text-8xl' text='Festival' />
        </div>
      </div>
      <div className="relative flex flex-col p-20 border rounded-[15px]">
        <img src={poster_1} className='w-full object-cover rounded-[15px] z-10' />
        <img src={poster_1} className='absolute top-0 left-0 w-full h-full object-cover rounded-[15px] opacity-70 z-0' />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-5">
        <h1 className='font-body text-[16px] text-gray-800'>Latest</h1>
        <TitleText secondaryColor='text-indigo-500' uppercase size='text-8xl' text='Screenplays' />
      </div>
      <ScreenplayList />
    </div>
  )
}
