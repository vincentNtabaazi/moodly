import React from 'react'

type Props = {
  children: React.ReactNode;
}

export default function Main(props: Props) {
  const { children } = props
  return (
    <main className='flex-1 flex flex-col p-4 sm:p-8'>
      {children}
    </main>
  )
}
