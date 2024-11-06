import { type ReactElement } from 'react'
import { randomAddedArrayBuilder } from '../utils/lists'
import { ScreenplayPosterProps } from '../utils/types'
import { ScreenplayCard } from './ScreenplayCard'

export const ScreenplayList = (): ReactElement => {
  return (
    <div className='w-full columns-2 min-[500px]:columns-3 md:columns-5 gap-5 space-y-5'>
      {
        [...randomAddedArrayBuilder(), ...randomAddedArrayBuilder()].map((item: ScreenplayPosterProps, i: number) => (
          <ScreenplayCard key={i} item={item} />
        ))
      }
    </div>
  )
}
