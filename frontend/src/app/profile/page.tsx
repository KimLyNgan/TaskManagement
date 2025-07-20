// task_management/frontend/src/app/profile/page.tsx
"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Spin, Result, Flex } from "antd";
import { UserOutlined, MailOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axios from "axios"; // Sẽ cài đặt axios
import { message } from "antd"; // Import message

const { Title, Text } = Typography;

// Định nghĩa interface cho dữ liệu người dùng nhận từ backend
interface UserProfile {
   _id: string;
   username: string;
   email: string;
   role: string;
   createdAt: string;
   updatedAt: string;
   // ... có thể thêm các trường khác nếu có
}

const ProfilePage: React.FC = () => {
   const [user, setUser] = useState<UserProfile | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   useEffect(() => {
      const fetchProfile = async () => {
         try {
            setLoading(true);
            // Gọi API profile từ backend
            const response = await axios.get<UserProfile>("http://localhost:8080/api/v1/auth/profile", {
               withCredentials: true, // Rất quan trọng để gửi cookies
            });
            setUser(response.data);
         } catch (err: any) {
            console.error("Fetch profile error:", err);
            setError(err.response?.data?.message || "Không thể tải thông tin profile. Vui lòng đăng nhập lại.");
            // Nếu lỗi 401 Unauthorized, chuyển hướng về trang đăng nhập
            if (err.response?.status === 401) {
               router.push("/login");
               message.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
            } else {
               message.error("Có lỗi xảy ra khi tải profile.");
            }
         } finally {
            setLoading(false);
         }
      };

      fetchProfile();
   }, [router]); // Thêm router vào dependencies để hook chạy lại khi router thay đổi (ít xảy ra nhưng tốt)

   const handleLogout = async () => {
      setLoading(true);
      try {
         await axios.post(
            "http://localhost:8080/api/v1/auth/logout",
            {},
            {
               withCredentials: true,
            }
         );
         message.success("Đăng xuất thành công!");
         router.push("/login"); // Chuyển hướng về trang đăng nhập
      } catch (err: any) {
         console.error("Logout error:", err);
         message.error(err.response?.data?.message || "Đăng xuất thất bại. Vui lòng thử lại.");
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return (
         <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
            {/* <Spin size="large" tip="Đang tải profile..." /> */}
            <h1>dang tai</h1>
         </Flex>
      );
   }

   if (error) {
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

   if (!user) {
      return (
         <Result
            status="warning"
            title="Không tìm thấy thông tin người dùng"
            extra={
               <Button type="primary" onClick={() => router.push("/login")}>
                  Đăng nhập
               </Button>
            }
         />
      );
   }

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
