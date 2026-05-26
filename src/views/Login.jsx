import './css/Login.css'
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {message} from 'antd';

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username.trim()) {
            message.error('请输入用户名');
            return false;
        }
        if (!password.trim()) {
            message.error('请输入密码');
            return false;
        }
        if (password.length < 6) {
            message.error('密码长度至少为6位');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.post('/user/login', {name: username, password});
            if (response.data.code === 200) {
                if (response.data.msg.includes('登录成功')) {
                    const {token, id, avatar} = response.data.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('userId', id);
                    localStorage.setItem('avatar', avatar);
                    message.success(response.data.msg);
                    navigate('/');
                } else {
                    message.error(response.data.msg);
                }
            }
        } catch (err) {
            console.log(err);
            message.error('登录失败，请检查网络或者稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const applyResetPassword = async () => {
        if (!username.trim()) {
            message.error('请输入用户名');
            return;
        }

        try {
            const response = await axios.post('/user/apply/reset/password', null, {params: {name: username}});
            if (response.data.code === 200) {
                if (response.data.msg.includes('申请重置密码成功')) {
                    message.success(response.data.msg);
                } else {
                    message.error(response.data.msg);
                }
            }
        } catch (err) {
            console.log(err);
            message.error('申请重置密码失败，请检查网络或者稍后重试');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-area">
                    <div className="recipe-icon">🍲</div>
                    <h1 className="brand-title">小钦菜谱 • 登录</h1>
                    <p className="brand-slogan">登录，解锁千道家常美味</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">用户名</label>
                        <div className="input-icon">
                            <span className="icon">👤</span>
                            <input
                                type="text"
                                id="username"
                                placeholder="你的用户名"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">密码</label>
                        <div className="input-icon">
                            <span className="icon">🔒</span>
                            <input
                                type="password"
                                id="password"
                                placeholder="至少6位字符"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="options-row">
                        <div></div>
                        <a href="#" className="forgot-link" onClick={applyResetPassword}>
                            忘记密码？
                        </a>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <span className="loader"></span> : '登录 · 开启食光'}
                    </button>
                </form>

                <div className="register-prompt">
                    还没有账号？{' '}
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate('/register');
                    }}>
                        立即注册
                    </a>
                </div>

                <div className="food-deco deco-1">🍕</div>
                <div className="food-deco deco-2">🍅</div>
                <div className="food-deco deco-3">🍄‍🟫</div>
            </div>
        </div>
    );
}