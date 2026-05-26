import './css/Login.css'
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username.trim()) {
            setError('请输入用户名');
            return false;
        }
        if (!password.trim()) {
            setError('请输入密码');
            return false;
        }
        if (password.length < 6) {
            setError('密码长度至少为6位');
            return false;
        }
        setError('');
        setSuccess('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/user/login', {name: username, password});
            if (response.data.code === 200) {
                if (response.data.msg.includes('登录成功')) {
                    const {token} = response.data.data;
                    localStorage.setItem('token', token);
                    setSuccess(response.data.msg);
                    navigate('/');
                } else {
                    setError(response.data.msg);
                }
            }
        } catch (err) {
            setError('登录失败，请检查网络或者稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const applyResetPassword = async () => {
        if (!username.trim()) {
            setError('请输入用户名');
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/user/apply/reset/password', null, {params: {name: username}});
            if (response.data.code === 200) {
                if (response.data.msg.includes('申请重置密码成功')) {
                    setSuccess(response.data.msg);
                } else {
                    setError(response.data.msg);
                }
            }
        } catch (err) {
            setError('申请重置密码失败，请检查网络或者稍后重试');
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

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

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