import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import './css/Layout.css';
import Home from '../components/Home';
import Kind from '../components/Kind';
import Menu from '../components/Menu';
import Snacks from '../components/Snacks';
import Knowledge from '../components/Knowledge';

export default function Layout() {
    // 获取 navigate 函数，实现路由跳转
    const navigate = useNavigate();
    // 记录当前选中的按钮的标识（这里用按钮文字，也可以改用 id/value）
    const [activeKey, setActiveKey] = useState('home')

    // 按钮列表数据，方便维护
    const navItems = [
        {label: '首页', key: 'home'},
        {label: '分类', key: 'kind'},
        {label: '精选菜单', key: 'menu'},
        {label: '小吃大全', key: 'snacks'},
        {label: '食物小知识', key: 'knowledge'},
    ]

    const handleClick = (key) => {
        setActiveKey(key);
    }

    // 根据 activeKey 渲染对应组件
    const renderContent = () => {
        switch (activeKey) {
            case 'home':
                return <Home/>;
            case 'kind':
                return <Kind/>;
            case 'menu':
                return <Menu/>;
            case 'snacks':
                return <Snacks/>;
            case 'knowledge':
                return <Knowledge/>;
            default:
                return <Home/>;
        }
    }

    const avatarClick = () => {
        navigate('/userInfo')
    }

    const login = () => {
        navigate('/login')
    }

    const register = () => {
        navigate('/register')
    }

    return (
        <>
            <header className="home-header">
                <div className="header-right">
                    <i className="i" onClick={register}>注册</i>
                    <i className="i" onClick={login}>登录</i>
                    <img className="avatar" src="/menu.png" alt="头像" onClick={avatarClick}
                         onError={(e) => {
                             e.target.onerror = null;   // 防止循环
                             e.target.src = 'default-avatar.png';
                         }}/>
                </div>
            </header>
            <nav className="home-nav">
                {navItems.map((item) => (
                    <button
                        key={item.key}
                        className={`nav-button ${activeKey === item.key ? 'active' : ''}`}
                        onClick={() => handleClick(item.key)}
                        aria-pressed={activeKey === item.key}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="home-content">
                {renderContent()}
            </div>
            <footer className="home-footer"></footer>
        </>
    );
}