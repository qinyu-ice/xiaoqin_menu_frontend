import {useState} from 'react';
import './css/Layout.css';
import Home from '../components/Home';
import Kind from '../components/Kind';
import Menu from '../components/Menu';
import Snacks from '../components/Snacks';
import Knowledge from '../components/Knowledge';

export default function Layout() {
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

    return (
        <>
            <header className="home-header"></header>
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