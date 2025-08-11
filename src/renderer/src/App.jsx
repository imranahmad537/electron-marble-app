// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import Setting from './components/Setting'
import Order from './components/Order'
import Stock from './components/Stock'
import Login from './components/Login'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
       <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* <Route path="dashboardlayout" element={<DashboardLayout />} /> */}
          <Route path="stock" element={<Stock />} />
          <Route path="order" element={<Order />} />
          <Route path="login" element={<Login />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
