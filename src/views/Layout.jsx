import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import './css/Layout.css';
import Home from '../components/Home';
import Kind from '../components/Kind';
import Menu from '../components/Menu';
import Snacks from '../components/Snacks';
import Knowledge from '../components/Knowledge';
import axios from "axios";
import {Avatar, Button, message} from "antd";

export default function Layout() {
    // 获取 navigate 函数，实现路由跳转
    const navigate = useNavigate();
    // 记录当前选中的按钮的标识（这里用按钮文字，也可以改用 id/value）
    const [activeKey, setActiveKey] = useState('home');
    const [status, setStatus] = useState(true);

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
        if (status) {
            navigate('/login')
        } else {
            navigate('/userInfo')
        }
    }

    const login = () => {
        navigate('/login')
    }

    const register = () => {
        navigate('/register')
    }

    const switchAccount = () => {
        navigate('/login')
        setStatus(true);
    }

    const exitAccount = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            const response = await axios.get(
                '/user/exit',
                {
                    params: {id: userId},
                    headers: {'Authorization': `Bearer ${token}`}
                }
            )
            if (response.data.code === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('avatar');
                setStatus(true);
                message.success(response.data.msg);
                navigate('/login')
            } else {
                setStatus(false);
                message.error(response.data.msg);
            }
        } catch (err) {
            console.log(err)
            message.error('退出登录失败，请检查网络或者稍后重试')
        }
    }

    const isLogin = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/user/status`, {
                headers: {'Authorization': `Bearer ${token}`}
            })
            if (response.data.code === 200 && response.data.data) {
                setStatus(false);
            }
            if (response.data.code === 200 && !response.data.data) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('avatar');
            }
        } catch (err) {
            console.log(err);
            message.error('获取用户状态失败，请检查网络或者稍后重试');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('avatar');
        }
    }

    const location = useLocation();
    useEffect(() => {
        isLogin();
    }, [location]);

    return (
        <>
            <header className="home-header">
                <div className="header-right">

                    {status ? (
                        <>
                            <i className="i" onClick={register}>注册</i>
                            <i className="i" onClick={login}>登录</i>
                        </>
                    ) : (
                        <>
                            <i className="switch-i" onClick={switchAccount}>切换账号</i>
                            <i className="switch-i" onClick={exitAccount}>退出登录</i>
                        </>
                    )}

                    <Avatar className="avatar" src={localStorage.getItem('avatar') || '/default-avatar.png'}
                            alt="头像" onClick={avatarClick}/>
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