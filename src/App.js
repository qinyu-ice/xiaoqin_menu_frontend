import {Routes, Route, Navigate} from 'react-router-dom'
import Layout from './views/Layout'
import Login from './views/Login'
import Register from './views/Register'
import UserInfo from './views/UserInfo'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/layout" replace/>}/>
            <Route path="/layout" element={<Layout/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/userInfo" element={<UserInfo/>}/>
        </Routes>
    );
}