import { ReactElement } from 'react'

interface PriceCardProps {
price: number
saved: number
percentage: number
title: string
description: string
cta: string
size?: string
clicked: boolean
}

export const PriceCard = ({ price, saved, percentage, title, description, cta, size, clicked } : PriceCardProps): ReactElement => {
  return (
    <div className={`w-full ${size === 'sm'  ? 'h-full bg-[#40403e]' : size === 'en' ? 'h-full' : 'h-4/5 bg-[#282826] '} flex flex-col justify-between items-start p-5 rounded-[15px]`}>
      <div className={`border border-indigo-500 px-1 rounded-[5px] ${size ? 'opacity-0' : ''}`}>
        <p className='font-body text-[12px] text-indigo-500 uppercase'>Recommended</p>
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-end items-end gap-x-1">
          <p className={`font-body text-[32px] ${size === 'en' ? 'text-[#282826]' : 'text-[#ffffff]'} tracking-tight leading-none`}>{`$${price}`}</p>
          <p className={`font-body text-[16px] ${size === 'en' ? 'text-gray-600' : 'text-gray-300'}`}>{size === 'en' ? 'user/month' : '/ month'}</p>
        </div>
        <div className="w-full flex justify-end items-end gap-x-1">
          <p className={`font-body text-[12px] ${size === 'en' ? 'text-gray-600' : 'text-gray-300'}`}>{clicked ? '*Billed anually' : '*Billed monthly'}</p>
        </div>
        <div className="w-full flex justify-between items-end gap-x-1 pt-1">
          <div className="flex items-end gap-x-2">
            <p className={`uppercase font-body text-[20px] ${size === 'en' ? 'text-[#282826]' : 'text-[#ffffff]'} leading-none`}>{title.split(' ')[0]}</p>
            <p className={`font-body text-[18px] ${size === 'en' ? 'text-[#282826]' : 'text-[#ffffff]'} leading-none`}>{title.split(' ')[1]}</p>
          </div>
          <div className="flex gap-x-1">
            <div className="flex px-1 text-[13px] text-[#10100e] bg-indigo-500 rounded-[3px]">{`save $${saved}`}</div>
            <div className="flex px-1 text-[12px] text-[#10100e] bg-[#ffffff] rounded-[3px]">{`-${percentage}%`}</div>
          </div>
        </div>
        <div className="w-full flex justify-between items-end gap-x-1 pt-5">
          <p className={`text-[14px] text-balance ${size === 'en' ? 'text-gray-600 font-body' : 'text-gray-300 font-light'} leading-none w-2/3`}>
            {description}
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <button className={`w-full h-10 border rounded-[7px] font-body text-[16px] text-balance ${size === 'en' ? 'text-gray-600 border-gray-600' : 'text-gray-300'} hover:bg-indigo-500 hover:border-transparent hover:text-[#10100e] transition-color duration-200`}>{cta}</button>
      </div>
    </div>
  )
}
