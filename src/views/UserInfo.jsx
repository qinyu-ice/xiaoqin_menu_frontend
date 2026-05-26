import './css/UserInfo.css'
import axios from 'axios';
import {Avatar, message, Table} from 'antd';
import React, {useState, useEffect} from "react";

export default function UserInfo() {

    const [userInfoData, setUserInfoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '权限',
            dataIndex: 'permissionName',
            key: 'permissionName',
        }
    ]

    const permissionMap = {
        1: '超级管理员',
        2: '普通管理员',
        3: '普通用户'
    }

    const verticalColumns = [
        {title: '属性', dataIndex: 'attr', key: 'attr'},
        {title: '值', dataIndex: 'value', key: 'value'},
    ];

    const getUserInfo = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            const response = await axios.get(`/user/info/${userId}`, {
                headers: {'Authorization': `Bearer ${token}`}
            })
            if (response.data.code === 200) {
                if (response.data.msg.includes('获取用户信息成功')) {
                    response.data.data.permissionName = permissionMap[response.data.data.permission];
                    setUserInfoData(response.data.data);
                    message.success(response.data.msg)
                } else {
                    message.error(response.data.msg);
                }
            }
        } catch (err) {
            console.log(err);
            message.error('获取用户信息失败，请检查网络或者稍后重试');
        } finally {
            setLoading(false);
        }
    }

    // 转换函数：根据原始 columns 和记录生成垂直表格数据源
    const getVerticalDataSource = (columns, record) => {
        if (!record) return [];
        return columns.map(col => ({
            key: col.key || col.dataIndex,
            attr: col.title,
            value: col.render
                ? col.render(record[col.dataIndex], record, 0)
                : record[col.dataIndex],
        }));
    };
    const verticalDataSource = getVerticalDataSource(columns, userInfoData);

    // 只在组件挂载时请求一次
    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div>
            <div className="info-container">
                <Avatar size={150} src={userInfoData?.avatar || '/default-avatar.png'} alt="头像"/>
                <Table className="table-container" showHeader={false} loading={loading} dataSource={verticalDataSource}
                       columns={verticalColumns} pagination={false}>
                </Table>
            </div>
        </div>
    );
}