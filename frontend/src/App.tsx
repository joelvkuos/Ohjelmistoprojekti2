import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/landingPage'
import Homepage from './pages/HomePage'
import News from './pages/News'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/homepage' element={<Homepage />} />
      <Route path='/news' element={<News />} />
    </Routes>
  )
}

export default App
