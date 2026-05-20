import {Routes, Route, Navigate} from 'react-router-dom'
import Layout from './views/Layout'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace/>}/>
            <Route path="/home" element={<Layout/>}/>
        </Routes>
    );
}