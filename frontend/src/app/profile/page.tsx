// task_management/frontend/src/app/profile/page.tsx
"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useEffect } from "react";
import { Card, Typography, Button, Spin, Result, Flex } from "antd";
import { UserOutlined, MailOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
   const { user, loading, error, isAuthenticated, fetchProfile, logout, resetState } = useUserStore();
   const router = useRouter();

   useEffect(() => {
      if (!isAuthenticated && !loading && !user) {
         fetchProfile();
      }
   }, [isAuthenticated, loading, user, fetchProfile]);

   useEffect(() => {
      if (!isAuthenticated && !loading && !user && error) {
         router.push("/login");
      }
   }, [isAuthenticated, loading, user, error, router]);

   const handleLogout = async () => {
      await logout();
      router.push("/login");
      resetState();
   };
   if (loading) {
      return (
         <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
            <Spin size="large" tip="Đang tải profile...">
               <div style={{ minHeight: 100 }} />
            </Spin>
         </Flex>
      );
   }

   if (error && !isAuthenticated) {
      return (
         <Result
            status="error"
            title="Lỗi"
            subTitle={error}
            extra={
               <Button type="primary" onClick={() => router.push("/login")}>
                  Đăng nhập lại
               </Button>
            }
         />
      );
   }

   if (!user && !isAuthenticated && !loading) {
      return (
         <Result
            status="warning"
            title="Không tìm thấy thông tin người dùng"
            subTitle="Phiên đăng nhập đã hết hạn, vui lòng đằng nhập lại"
            extra={
               <Button type="primary" onClick={() => router.push("/login")}>
                  Đăng nhập
               </Button>
            }
         />
      );
   }
   if (!user) return null;

   return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh", padding: "20px" }}>
         <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} hoverable>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
               <Title level={3}>Thông tin Profile</Title>
               <Text type="secondary">Chào mừng, {user.username}!</Text>
            </div>
            <div>
               <Text strong>
                  <UserOutlined /> Tên người dùng:
               </Text>{" "}
               <Text>{user.username}</Text>
               <br />
               <Text strong>
                  <MailOutlined /> Email:
               </Text>{" "}
               <Text>{user.email}</Text>
               <br />
               <Text strong>
                  <SettingOutlined /> Vai trò:
               </Text>{" "}
               <Text>{user.role}</Text>
               <br />
               <Text strong>Ngày tham gia:</Text> <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
               <br />
            </div>
            <Flex justify="end" style={{ marginTop: "24px" }}>
               <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout} loading={loading}>
                  Đăng xuất
               </Button>
            </Flex>
         </Card>
      </Flex>
   );
};

export default ProfilePage;
