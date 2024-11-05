import { type ReactElement } from 'react'
import { ReactTyped } from 'react-typed'

export const WaitingRoom = (): ReactElement => {
    return (
        <div className='w-full flex justify-start'>
            <ReactTyped startWhenVisible className='font-mono text-[14px]' showCursor={false} strings={['Waiting for user to accept the invitation']} typeSpeed={10} />
            <ReactTyped loop startWhenVisible className='font-mono text-[14px]' strings={['...']} typeSpeed={60} />
        </div>
    )
}
