interface TitleTextProps {
  text: string
  uppercase?: boolean
  size?: string
  color?: string
  secondaryColor?: string
}

export const TitleText = ({ text, uppercase, size, color, secondaryColor } : TitleTextProps) => {
  return (
    <div className="flex">
      {
        text.split('').map((letter, index) => (
          <h1 key={index} className={`${size ? size : 'text-9xl'} font-bold ${uppercase ? 'uppercase' : ''} text-center z-10 cursor-default ${color ? color : ''} hover:${secondaryColor ? secondaryColor : 'text-[#ffffff]'} transition-color duration-300`}>{letter}</h1>
        ))
      }
    </div>
  )
}