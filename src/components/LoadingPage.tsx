import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingPage = (): React.JSX.Element => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Loader2 className='h-12 w-12 animate-spin text-primary' />
    </div>
  )
}
