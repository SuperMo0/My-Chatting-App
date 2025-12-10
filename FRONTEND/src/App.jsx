import { useEffect, useRef, useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import { Routes, Route, Navigate } from 'react-router'
import Chats from './pages/Chats.jsx'
import Profile from './pages/Profile.jsx'
import People from './pages/People.jsx'
import { useAuthStore } from './stores/auth.store.js';
import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import Signup from './pages/Signup.jsx'




function App() {

  const { authUser, check, isChecking } = useAuthStore();
  const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    check();
  }, [])

  if (isChecking) return <div className='grid place-content-center h-full'>
    <ClipLoader color='blue' loading={true} />
  </div>


  function toggleDark() {
    setDark(!dark);
  }

  return (
    <div data-theme={dark ? "dark" : "light"}>
      <ToastContainer />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />}>
          <Route index='true' element={authUser && <Chats />}  ></Route>
          <Route path='/people' element={authUser && <People />}></Route>
          <Route path='/profile' element={authUser && <Profile dark={dark} toggleDark={toggleDark} />}></Route>
        </Route>
        <Route path='/login' element={authUser ? <Navigate to={"/"} /> : <Login />}></Route>
        <Route path='/signup' element={authUser ? <Navigate to={"/"} /> : <Signup />}></Route>

      </Routes>
    </div>
  )
}

export default App
