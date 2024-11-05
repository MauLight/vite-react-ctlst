import type { Dispatch, SetStateAction, ReactElement, PropsWithChildren } from 'react'

export interface ScreenplayPosterProps {
    id: string
    title: string
    poster: string
    sizeChance: number
    shapeChance: number
}

export interface WideMenuProps {
    isUpperMenuOpen: boolean
    setUpperMenuOpen: Dispatch<SetStateAction<boolean>>
}

export type StreamElementProps = {
    id: number
    type: string
    component: ReactElement
}

export type WelcomeProps = {
    generation: string
    wasGenerated: boolean
    handleOnComplete: () => void
}

export type CursorData = {
    name: string;
    color: string;
}

export type RemoteCursorsProps = PropsWithChildren<{
    className?: string
}>

export interface LeafProps { attributes: object, children: ReactElement, leaf: Record<string, unknown> }