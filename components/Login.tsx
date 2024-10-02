'use client'
import { Fugaz_One } from "next/font/google";
import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";

const fugaz = Fugaz_One({
   subsets: ["latin"],
   weight: ["400"],
});

export default function Login() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isRegister, setIsRegister] = useState(false)
   const [authenticating, setAuthenticating] = useState(false)

   const { signup, login } = useAuth()

   async function handleSubmit() {
      if (!email || !password || password.length < 6) {
         return
      }
      setAuthenticating(true)
      try {
         if (isRegister) {
            console.log('Signing up a new user.')
            await signup(email, password)
         } else {
            console.log('Logging in existing user.')
            await login(email, password)
         }
      } catch ( error : unknown) {
         if (error instanceof Error) {
            console.log('Failed to set data: ', error.message)
         } else {
            console.log('Failed to set data: ', error);
         }
      } finally {
         setAuthenticating(false)
      }



   }

   return (
      <div className="flex flex-col flex-1 justify-center items-center gap-4">
         <h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz.className}>
            {isRegister ? 'Register' : 'Log In'}
         </h3>
         <p>You’re one step away!</p>
         <input
            value={email}
            onChange={(e) => {
               setEmail(e.target.value)
            }}
            className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
            placeholder="Email"
         />
         <input
            value={password}
            onChange={(e) => {
               setPassword(e.target.value)
            }}
            className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
            placeholder="Password"
            type="password"
         />
         <div>
            <Button clickHandler={handleSubmit} text={authenticating ? 'Submitting': 'Submit' } full />
         </div>
         <p className="text-center">{isRegister ? 'Already have an account ? ' : 'Don’t have an account ? '} <button onClick={() => setIsRegister(!isRegister)} className="text-indigo-500">{isRegister ? 'Sign In' : 'Sign Up'}</button></p>
      </div>
   );
}
