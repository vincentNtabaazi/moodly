'use client'
import React, { useContext, useEffect, useState } from "react"
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

type Authprops = {
   children: React.ReactNode
}


const AuthContext = React.createContext<any>(null)

export function useAuth() {
   return useContext(AuthContext)
}

export function AuthProvider({ children }: Authprops) {

   const [currentUser, setCurrentUser] = useState<any>(null)
   const [userDataObj, setUserDataObj] = useState<any>(null)
   const [loading, setLoading] = useState<any>(true)

   //AUTH HANDLERS
   function signup(email: string, password: string) {
      return createUserWithEmailAndPassword(auth, email, password)
   }

   function login(email: string, password: string) {
      return signInWithEmailAndPassword(auth, email, password)
   }

   function logout(email: string, password: string) {
      setUserDataObj(null)
      setCurrentUser(null)
      return signOut(auth)
   }

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async user => {
         try {
            //Set the user to our local context
            setLoading(true)
            setCurrentUser(user)
            if (!user) {
               console.log('No user found')
               return
            }

            //If the user exists, fetch the data from firestore db
            console.log('Fetching User Data')
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            let firebaseData = {}
            if (docSnap.exists()) {
               console.log('Found User Data')
               firebaseData = docSnap.data()
               console.log(firebaseData)
            }
            setUserDataObj(firebaseData)

         } catch (err: any) {
            console.log(err.message)
         } finally {
            setLoading(false)
         }

      })
      return unsubscribe
   }, [])

   const value = {
      currentUser,
      userDataObj,
      setUserDataObj,
      signup,
      logout,
      login,
      loading
   }

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )
}