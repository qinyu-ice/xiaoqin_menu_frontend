import './css/UserInfo.css';
import axios from 'axios';
import {
    Avatar, Button, message, Descriptions, Card, Modal, Form, Input, Upload, Row, Col, Tag, Skeleton
} from 'antd';
import {UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, UploadOutlined, HomeOutlined} from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";

export default function UserInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const navigate = useNavigate();

    // 权限映射
    const permissionMap = {
        1: {name: '超级管理员', color: 'red'},
        2: {name: '普通管理员', color: 'orange'},
        3: {name: '普通用户', color: 'blue'},
    };

    const goHome = () => {
        navigate('/');
    };

    // 获取用户信息
    const getUserInfo = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            const response = await axios.get(`/user/info/${userId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (response.data.code === 200) {
                const data = response.data.data;
                // 格式化数据
                data.permissionInfo = permissionMap[data.permission] || {name: '未知', color: 'default'};
                data.createTime = data.createTime?.substring(0, 10) || '未知';
                setUserInfo(data);
                message.success(response.data.msg);
            } else {
                message.error(response.data.msg);
            }
        } catch (err) {
            console.error(err);
            message.error('获取用户信息失败，请检查网络或稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 切换头像 - 上传新头像
    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setAvatarLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const response = info.file.response;
            if (response && response.code === 200) {
                const uploadedUrl = response.data;
                setNewAvatarUrl(uploadedUrl);
                // 实时更新界面预览，但不提交到后端
                setUserInfo(prev => ({...prev, avatar: uploadedUrl}));
                message.success('头像上传成功，请点击“保存”生效');
            } else {
                message.error(response?.message || '上传失败');
            }
            setAvatarLoading(false);
        } else if (info.file.status === 'error') {
            message.error('头像上传失败');
            setAvatarLoading(false);
        }
    };

    // 补全信息 - 打开编辑弹窗
    const openEditModal = () => {
        editForm.setFieldsValue(userInfo);
        setNewAvatarUrl('');
        setEditModalVisible(true);
    };

    // 提交编辑信息
    const handleEditSubmit = async () => {
        try {
            const values = await editForm.validateFields();
            // 头像：若上传了新头像则用新 URL，否则保留原头像
            const finalAvatar = newAvatarUrl || userInfo.avatar;
            const formData = {
                ...values,
                id: userInfo.id,               // 使用 state 中的 id，更可靠
                avatar: finalAvatar,
            };
            const token = localStorage.getItem('token');
            const response = await axios.post(`/user/update`, formData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (response.data.code === 200) {
                message.success('信息更新成功');
                setUserInfo(prev => ({...prev, ...values, avatar: finalAvatar}));
                setEditModalVisible(false);
                setNewAvatarUrl('');            // 清理临时头像 URL
                editForm.resetFields();         // 重置表单
            } else {
                message.error(response.data.msg || '更新失败');
            }
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    if (loading && !userInfo) {
        return (
            <div style={{padding: 48, maxWidth: 1000, margin: '0 auto'}}>
                <Skeleton active avatar paragraph={{rows: 6}}/>
            </div>
        );
    }

    return (
        <div className="user-info-wrapper">
            <Card className="user-info-card" bordered={false} extra={  // 新增 extra 属性，按钮显示在卡片右上角
                <Button type="primary" icon={<HomeOutlined/>} onClick={goHome}>
                    返回主页
                </Button>
            }>
                <Row gutter={[32, 24]}>
                    {/* 左侧头像区域 */}
                    <Col xs={24} md={8} style={{textAlign: 'center'}}>
                        <Upload
                            name="file"
                            showUploadList={false}
                            action="/user/upload/avatar"
                            headers={{Authorization: `Bearer ${localStorage.getItem('token')}`}}
                            onChange={handleAvatarChange}
                            accept="image/*"
                        >
                            <Avatar
                                size={140}
                                src={userInfo?.avatar || '/default-avatar.png'}
                                icon={<UserOutlined/>}
                                style={{cursor: 'pointer', marginBottom: 16}}
                                className="avatar-hover"
                            />
                        </Upload>
                        <div className="permission-badge">
                            <Button
                                icon={<UploadOutlined/>}
                                onClick={() => document.querySelector('.ant-upload input')?.click()}
                                loading={avatarLoading}
                            >
                                切换头像
                            </Button>
                            <Tag className="permission-tag" color={userInfo?.permissionInfo?.color}
                                 style={{marginTop: 20}}>
                                {userInfo?.permissionInfo?.name}
                            </Tag>
                            <Button className="action-buttons" onClick={handleEditSubmit}>保存</Button>
                        </div>
                    </Col>

                    {/* 右侧信息区域 */}
                    <Col xs={24} md={16}>
                        <Descriptions
                            title="个人信息"
                            bordered
                            column={1}
                            labelStyle={{fontWeight: 500, width: '30%'}}
                            contentStyle={{width: '70%'}}
                        >
                            <Descriptions.Item label="昵称">{userInfo?.nickname || '未设置'}</Descriptions.Item>
                            <Descriptions.Item label="用户名">{userInfo?.name}</Descriptions.Item>
                            <Descriptions.Item label="真实姓名">{userInfo?.realName || '未填写'}</Descriptions.Item>
                            <Descriptions.Item label="邮箱">{userInfo?.email}</Descriptions.Item>
                            <Descriptions.Item label="联系电话">{userInfo?.phone || '未填写'}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{userInfo?.createTime}</Descriptions.Item>
                        </Descriptions>

                        <div className="action-buttons">
                            <Button type="primary" icon={<EditOutlined/>} onClick={openEditModal}>
                                补全 / 编辑信息
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* 编辑信息 Modal */}
            <Modal
                title="编辑个人信息"
                open={editModalVisible}
                onOk={handleEditSubmit}
                onCancel={() => setEditModalVisible(false)}
                okText="保存"
                cancelText="取消"
                width={500}
            >
                <Form form={editForm} layout="vertical" name="editUserForm">
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{max: 20, message: '昵称不能超过20个字符'}]}
                    >
                        <Input placeholder="请输入昵称"/>
                    </Form.Item>
                    <Form.Item
                        name="realName"
                        label="真实姓名"
                        rules={[{max: 50, message: '真实姓名不能超过50个字符'}]}
                    >
                        <Input placeholder="请输入真实姓名"/>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {type: 'email', message: '请输入有效的邮箱地址'},
                            {required: true, message: '邮箱不能为空'}
                        ]}
                    >
                        <Input placeholder="example@domain.com"/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="手机号"
                        rules={[
                            {pattern: /^1[3-9]\d{9}$/, message: '请输入11位有效手机号'}
                        ]}
                    >
                        <Input placeholder="请输入手机号"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}