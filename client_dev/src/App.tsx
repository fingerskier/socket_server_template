import { useEffect } from 'react'
import {useLocalStore} from 'react-confection'
import Header from '@com/Header'
import Main from '@com/Main'
import Footer from '@com/Footer'
import './App.css'

const DEFAULT_CONTEXT = ''


function App() {
  const Store = useLocalStore()

  const handleHashChange = () => {
    const newContext = window.location.hash.slice(1) || DEFAULT_CONTEXT
    const newQuery = Object.fromEntries(new URLSearchParams(window.location.search))

    console.log('newContext', newContext)
    Store.context = newContext
    Store.query = newQuery
  }


  useEffect(()=>{
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])


  return <>
     <Header />

     <Main />

     <Footer />
  </>
}

export default App
