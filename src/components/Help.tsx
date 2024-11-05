import { ReactElement } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '../utils/functions'

export const Help = (): ReactElement => {
  return (
    <motion.div
      variants={fadeIn('top', 0.2)}
      initial={'hidden'}
      whileInView={'show'}
      viewport={{ once: false, amount: 0.1 }}
      className='w-full grid grid-cols-3 py-10 px-10 bg-gray-50 rounded-[20px] border'>
      <div className="col-span-2 flex flex-col gap-y-4">
        <h1 className='font-heading leading-tight text-[2rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Welcome to your screenwriting space.</h1>
        <p className='font-mono text-[0.9rem] text-gray-600 text-balance'>You can use simple commands to make things easier as you write. Just type one of the following commands:</p>
      </div>
      <div className="flex flex-col justify-center pt-10 gap-y-2">
        <p className='font-mono text-[0.8rem] text-gray-600'>	•	<b>/screenplay</b> – Jump into screenplay mode and start writing your script.</p>
        <p className='font-mono text-[0.8rem] text-gray-600'>	•	<b>{'/invite {userId} {priviledges}'}</b>{' – Want to collaborate? Invite a friend into your screenplay. Optional value {priviledges} sets access to document, possible values reader, editor (default reader).'}</p>
        <p className='font-mono text-[0.8rem] text-gray-600'>	•	<b>/brainstorm</b> – Want to get inspired? choose an exercise to get you started.</p>
        <p className='font-mono text-[0.8rem] text-gray-600'>	•	<b>/print</b> – Ready to share? Print your screenplay with this command.</p>
        <p className='font-mono text-[0.8rem] text-gray-600'>	•	<b>/chat</b> – Connect with other writers! Chat and brainstorm ideas together.</p>
        <p className='font-mono text-[0.8rem] text-gray-600'>	•	<b>/help</b> – Need a reminder? This will show you all the available commands.</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className='font-mono text-[0.9rem] text-gray-600'>It’s all designed to keep you focused on your writing!</p>
      </div>
    </motion.div>
  )
}
