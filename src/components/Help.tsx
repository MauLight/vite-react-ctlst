import { ReactElement } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/functions'

export const Help = (): ReactElement => {
  return (
    <motion.div
      variants={fadeIn('top', 0.2)}
      initial={'hidden'}
      whileInView={'show'}
      viewport={{ once: false, amount: 0.1 }}
      className='w-full flex flex-col gap-y-5 p-5 bg-gray-50 rounded-[5px]'>
      <div className="flex flex-col gap-y-2">
        <h1 className='font-mono font-semibold text-[12px] text-gray-800'>Welcome to your screenwriting space!</h1>
        <p className='font-mono text-[12px] text-gray-600'>You can use simple commands to make things easier as you write. Just type “/” followed by one of the following commands:</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className='font-mono text-[12px] text-gray-600'>	•	<b>/screenplay</b> – Jump into screenplay mode and start writing your script.</p>
        <p className='font-mono text-[12px] text-gray-600'>	•	<b>/print</b> – Ready to share? Print your screenplay with this command.</p>
        <p className='font-mono text-[12px] text-gray-600'>	•	<b>/creator</b> – Create your screenplay from scratch with “The Quest” method.</p>
        <p className='font-mono text-[12px] text-gray-600'>	•	<b>/chat</b> – Connect with other writers! Chat and brainstorm ideas together.</p>
        <p className='font-mono text-[12px] text-gray-600'>	•	<b>/help</b> – Need a reminder? This will show you all the available commands.</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className='font-mono text-[12px] text-gray-600'>It’s all designed to keep you focused on your writing!</p>
      </div>
    </motion.div>
  )
}
