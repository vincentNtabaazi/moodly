'use client'
import React, { useEffect, useState } from 'react'
import Main from './Main'
import { Fugaz_One } from 'next/font/google';
import Calender from './Calender';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Login from './Login';
import Loading from './Loading';

const fugaz = Fugaz_One({
   subsets: ["latin"],
   weight: ["400"],
});

type Statuses = {
   // num_days: number;
   // average_mood: string;
   time_remaining: string;
}
export default function Dashboard() {
   const now = new Date()
   const { currentUser, userDataObj, setUserDataObj, loading } = useAuth()
   const [data, setData] = useState<any>({})

   function countValues() {
      let total_number_of_days = 0
      let sum_moods = 0
      for (let year in data) {
         for (let month in data[year]) {
            for (let day in data[year][month]) {
               let days_mood = data[year][month][day]
               total_number_of_days ++
               sum_moods += days_mood
            }

         }
      }
      return { num_days: total_number_of_days, average_mood: sum_moods / total_number_of_days}
   }

   const statuses: Statuses = {
      ...countValues(),
      time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
      
   }


   async function handleSetMood(mood: Number) {
      const day = now.getDate()
      const month = now.getMonth()
      const year = now.getFullYear()

      try {
         const newData = { ...userDataObj }

         if (!newData?.[year]) {
            newData[year] = {}
         }

         if (!newData?.[year]?.[month]) {
            newData[year][month] = {}
         }
         newData[year][month][day] = mood
         // update the current state
         setData(data)
         // update the global state
         setUserDataObj(newData)
         // update firebase

         const docRef = doc(db, 'users', currentUser.uid)
         if (year && month && day && mood) {

            const res = await setDoc(docRef, {
               [year]: {
                  [month]: {
                     [day]: mood
                  }
               }
            }, { merge: true });
         } else {
            console.error("Invalid data: year, month, day, or mood is undefined");
         }

      } catch (error: any) {
         console.log('Failed to set data: ', error.message)
      }
   }


   const moods: any = {
      '&*@#$': '😭',
      'Sad': '😢',
      'Existing': '🙁',
      'Good': '😁',
      'Elated': '😍',
   }

   useEffect(() => {
      if (!currentUser || !userDataObj) {
         return
      }
      setData(userDataObj)
   }, [currentUser, userDataObj])


   if (loading) {
      return <Loading />
   }

   if (!currentUser) {
      return <Login />
   }

   return (
      <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
         <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-large p-4 gap-4'>
            {Object.keys(statuses).map((status, statusIndex) => {
               return (
                  <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
                     <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
                     <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status as keyof Statuses]}{status === 'num_days' ? ' 🔥':'' }</p>
                  </div>
               )
            })}
         </div>
         <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
            How do you <span className='textGradient'>feel</span> today?
         </h4>
         <div className='flex items-stretch flex-wrap  gap-4'>
            {Object.keys(moods).map((mood, moodIndex) => {
               return (
                  <button onClick={() => {
                     const currentMoodValue = moodIndex + 1
                     handleSetMood(currentMoodValue)
                  }} className={'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col gap-2 items-center flex-1 '} key={moodIndex}>
                     <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
                     <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
                  </button>
               )
            })}
         </div>
         <Calender completeData={data} handleSetMood={handleSetMood} />
      </div>
   )
}
