import { Route , Routes } from 'react-router-dom'
import './App.css'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import Feed from './components/Feed'
import Connections from './components/Connections'
import Request from './components/Request'
import ProtectedRoutes from './components/ProtectedRoutes';
import NotFound from './components/NotFound';
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Body />} >
        <Route path="/auth" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Request />} />
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Route> 
    </Routes>

    </>
  )
}

export default App
