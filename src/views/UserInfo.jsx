import './css/UserInfo.css'
import React, {useState} from "react";

export default function UserInfo() {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getUserInfo = async () => {
        setError('111111');
        setSuccess('222222222')
    }

    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button onClick={getUserInfo}>测试消息弹窗</button>
        </div>
    );
}