import { AnimatePresence, motion } from 'framer-motion';
const TemplatePage = () => {
  return (
    <div className='  flex-col  w-[100vw] flex justify-center items-center bg-gradient-to-b from-gray-950 to-slate-900'>
      <h1 className='text-3xl text-white py-10 '>Choose your Template</h1>
      <div className='w-[70%] flex  flex-wrap gap-6  border-2 p-10 justify-center'>
        <AnimatePresence>
          <motion.div
            onClick={() => {
              location.replace('http://sub1.localhost:3000/');
            }}
            className='w-[30%] cursor-pointer '
            initial={{ boxShadow: '0px 0px 0 #fff' }}
            whileHover={{ boxShadow: '2px 2px 0px 0px #fff' }}
            exit={{ width: '30%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <img src='/template-1.jpg' alt='' />
          </motion.div>
          <motion.div className='w-[30%] '>
            <img src='/comingSoon.jpg' alt='' />
          </motion.div>
          <motion.div className='w-[30%]'>
            <img src='/comingSoon.jpg' alt='' />
          </motion.div>
          <motion.div className='w-[30%]'>
            <img src='/comingSoon.jpg' alt='' />
          </motion.div>
          <motion.div className='w-[30%]'>
            <img src='/comingSoon.jpg' alt='' />
          </motion.div>
          <motion.div className='w-[30%]'>
            <img src='/comingSoon.jpg' alt='' />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TemplatePage;
// className=' cursor-pointer w-[30%]  '
// onClick={() => {
//   console.log('hello');
//   location.replace('http://localhost:5173/');
// }}
