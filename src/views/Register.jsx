import './css/Register.css'
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Register() {
    // 表单状态
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 表单验证
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
        if (!rePassword.trim()) {
            setError('请再次输入密码');
            return false;
        }
        if (rePassword !== password) {
            setError('两次输入的密码不一致');
            return false;
        }
        setError('');
        return true;
    };

    // 处理注册提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        // 模拟 API 请求
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            // 模拟注册成功逻辑
            console.log('注册信息:', {username, password, rePassword, rememberMe});

            // 处理“记住我”
            if (rememberMe) {
                localStorage.setItem('recipe_username', username);
            } else {
                localStorage.removeItem('recipe_username');
            }

            // 成功提示
            alert('注册成功！');
            navigate('/login');
        } catch (err) {
            setError('注册失败，请检查网络或稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-area">
                    <div className="recipe-icon">🍲</div>
                    <h1 className="brand-title">小钦菜谱 • 注册</h1>
                    <p className="brand-slogan">注册，开启美味人生</p>
                </div>
                {/* 错误提示 */}
                {error && <div className="error-message">{error}</div>}

                {/* 注册表单 */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">用户名</label>
                        <div className="input-icon">
                            <span className="icon">👤</span>
                            <input
                                type="username"
                                id="username"
                                placeholder="你的用户名"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                autoComplete="username"
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
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="rePassword">重复密码</label>
                        <div className="input-icon">
                            <span className="icon">🔒</span>
                            <input
                                type="repassword"
                                id="rePassword"
                                placeholder="至少6位字符"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                disabled={loading}
                                autoComplete="current-rePassword"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <span className="loader"></span>
                        ) : (
                            '注册 · 静待美味'
                        )}
                    </button>
                </form>
                <div className="register-prompt">
                    已有账号？{' '}
                    <a href="#" onClick={() => {
                        navigate('/login');
                    }}>
                        返回登录
                    </a>
                </div>

                {/* 装饰性食材元素 */}
                <div className="food-deco deco-1">🍕</div>
                <div className="food-deco deco-2">🍅</div>
                <div className="food-deco deco-3">🍄‍🟫</div>
            </div>
        </div>
    );
}