import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CatalogPage from './pages/CatalogPage'
import AnimeDetailPage from './pages/AnimeDetailPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}
