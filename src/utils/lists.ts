import antichrist from '../assets/1-the-antichrist.webp'
import echoes from '../assets/2-echoes.webp'
import sin from '../assets/3-sin.webp'
import memory from '../assets/4-not-a-memory.webp'
import hope from '../assets/5-hope.webp'
import forbidden from '../assets/6-the-forbidden.webp'
import speed from '../assets/7-speed-of-light.webp'
import rebel from '../assets/8-rebel-seraphim.webp'
import hunger from '../assets/9-hunger.webp'
import them from '../assets/10-them.webp'
import { ScreenplayPosterProps } from './types'

const screenplayPosters = [
  {
    id: 'a1',
    title: 'The Antichrist',
    poster: antichrist
  },
  {
    id: 'b2',
    title: 'Echoes',
    poster: echoes
  },
  {
    id: 'c3',
    title: 'Sin',
    poster: sin
  },
  {
    id: 'd4',
    title: '[not] a memory',
    poster: memory
  },
  {
    id: 'e5',
    title: 'Hope',
    poster: hope
  },
  {
    id: 'f6',
    title: 'The Forbidden',
    poster: forbidden
  },
  {
    id: 'g7',
    title: 'Speed of Light',
    poster: speed
  },
  {
    id: 'h8',
    title: 'Rebel Seraphim',
    poster: rebel
  },
  {
    id: 'i9',
    title: 'Hunger',
    poster: hunger
  },
  {
    id: 'j10',
    title: 'Them',
    poster: them
  },
]

export const randomAddedArrayBuilder = () => {
  const randomAddedArray: ScreenplayPosterProps[] = []
  const copyArray =   [...screenplayPosters]
  copyArray.forEach((item) => {
    randomAddedArray.push({ ...item, sizeChance: Math.random(), shapeChance: Math.random() })
  })
  return randomAddedArray
}