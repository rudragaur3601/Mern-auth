import React from 'react'
import { assets } from '../assets/assets'


const Header = () => {
    

    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            {/* Header image */}
            <img 
                src={assets.header_img} 
                alt="Header" 
                className='w-36 h-36 mb-6 rounded-full' 
            />

            {/* Greeting and Wave */}
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
                Hey Developer
                <img 
                    className='w-8 aspect-square' 
                    src={assets.hand_wave} 
                    alt="Waving hand emoji" 
                />
            </h1>

            {/* Welcome message */}
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
                Welcome to our app
            </h2>
            <p className='mb-8 max-w-md'>
                Let's start with a quick product tour and we will have you up and running in no time
            </p>

            {/* Get Started Button */}
            <button 
                
                className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
                Get Started
            </button>
        </div>
    )
}

export default Header