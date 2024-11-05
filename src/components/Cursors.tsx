import { CSSProperties, type ReactElement, useRef } from 'react'
import { useRemoteCursorOverlayPositions, CursorOverlayData } from '@slate-yjs/react'
import clsx from 'clsx'
import { CursorData, RemoteCursorsProps } from '../utils/types'
import { addAlpha } from '../utils/functions'

type CaretProps = Pick<CursorOverlayData<CursorData>, 'caretPosition' | 'data'>

const Caret = ({ caretPosition, data }: CaretProps) => {
    const caretStyle: CSSProperties = {
        ...caretPosition,
        background: data?.color
    }

    const labelStyle: CSSProperties = {
        transform: 'translateY(-100%)',
        background: data?.color
    }

    return (
        <div style={caretStyle} className='w-0.5 absolute'>
            <div className='absolute text-white whitespace-nowrap top-0 rounded rounded-bl-none px-1.5 py-0.5' style={labelStyle}>
                {data?.name}
            </div>
        </div>
    )
}

const RemoteSelection = ({
    data,
    selectionRects,
    caretPosition
}: CursorOverlayData<CursorData>) => {

    if (!data) {
        return null
    }

    const selectionStyle: CSSProperties = {
        backgroundColor: addAlpha(data.color, 0.5)
    }

    return (
        <>
            {
                selectionRects.map((position, i) => (
                    <div
                        style={{ ...selectionStyle, ...position }}
                        className='absolute pointer-events-none'
                        key={i}
                    />
                ))
            }
            {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
        </>
    )
}

export const Cursors = ({ children, className }: RemoteCursorsProps): ReactElement => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [cursors] = useRemoteCursorOverlayPositions<CursorData>({ containerRef })

    return (
        <div className={clsx('relative', className)} ref={containerRef} >
            {children}
            {cursors.map(cursor => (
                <RemoteSelection key={cursor.clientId} {...cursor} />
            ))}
        </div>
    )
}