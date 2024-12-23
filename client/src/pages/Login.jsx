import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {
    const { state, setState } = useState('Sign Up')
    return (
        <div className='flex flex-col justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400' >
            <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <h2>{state === 'Sign Up' ? "Create Account" : "Login !"}</h2>
            <p>{state === 'Sign Up' ? "Create your Account" : "Login to your Account !"}</p>
            <form>
                <div>
                    <img src={assets.person_icon} alt=""/>
                    <input type="text" placeholder='Full Name' required/>
                </div>
            </form>
        </div>
    )
}

export default Login