import React from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/SideBar/Sidebar'
import { Routes , Route} from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const Url = 'https://foodweb-backend-nopk.onrender.com';

  return (
    <div>
        <ToastContainer/>
        <Navbar/>
        <hr/>
        <div className="app-content">
            <Sidebar/>
            <Routes>
              <Route path='/add' element = {<Add Url = {Url}/>}/>
              <Route path='/list' element = {<List Url = {Url}/>}/>
              <Route path='/orders' element = {<Orders Url = {Url}/>}/>
            </Routes>
        </div>
    </div>
  )
} 

export default App
