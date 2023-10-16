import Image from 'next/image'
import React, { useEffect, useState } from 'react'
const Home = () => {
  return (
    <>
      {/* bg-[url('/assets/img/background.webp')] */}
      <div className="w-full min-h-screen   bg-cover bg-no-repeat" >
        <div className="backdrop-blur w-full min-h-screen  md:p-36 px-2 py-5 flex">
          <div className=' w-full h-1/2 grid grid-cols-9 justify-center items-center'>
            <div className='col-span-4'>
              <div className="w-5/6">
                <h2 className='text-5xl font-bold  text-gray-600'>iStow</h2>
                <h2 className='text-5xl tracking-[15px] font-bold  font-poppins text-primary  mt-3 text-gray-600'>SURVEY</h2>
                <hr className='w-3/4 mt-7 border-primary border-b-2' />
                <p className='mt-7 text-gray-600 text-md'>We would like to thank those who have helped us make the process system more effective in general, administrative and technical. In an effort to improve services and features at iStow, we ask that you write your opinions and comments on the link we have provided.</p>
              </div>
            </div>
            <Image
              className='col-span-5'
              src="/assets/img/container.png "
              alt="Picture of the author"
              width={1000}
              height={1000}
              quality={100}
            />
          </div>

          <div className="w-full fixed left-0 bottom-0 bg-primary h-4"></div>
        </div >

      </div>

    </>
  )
}

export default Home
