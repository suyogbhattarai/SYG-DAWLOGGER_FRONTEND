// src/lib/redux/ReduxProvider.js
'use client'
import { Provider } from 'react-redux'
import { store } from './store'
import { useEffect } from 'react'
import { loadUserFromStorage } from './features/auth/authSlice'

export default function ReduxProvider({ children }) {
  useEffect(() => {
    store.dispatch(loadUserFromStorage())
  }, [])

  return <Provider store={store}>{children}</Provider>
}
