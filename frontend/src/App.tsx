import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/landingPage'
import Homepage from './pages/HomePage'
import News from './pages/News'
import { ProtectedRoute } from './components/ProtectedRoute'
import Portfolio from './pages/Portfolio'
import Profile from './pages/Profile'
import AllPortfolios from './pages/AllPortfolios'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/homepage'
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/news'
        element={
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        }
      />
      <Route
        path='/portfolio'
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/portfolios'
        element={
          <ProtectedRoute>
            <AllPortfolios />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App