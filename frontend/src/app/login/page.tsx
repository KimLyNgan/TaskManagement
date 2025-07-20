// task_management/frontend/src/app/login/page.tsx
"use client"; // <-- Đánh dấu là Client Component vì có tương tác người dùng và state
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Flex } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <-- Dùng next/navigation cho App Router
import axios from "axios"; // <-- Sẽ cài đặt axios sau

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const [form] = Form.useForm();

   const onFinish = async (values: any) => {
      // Tạm thời dùng any, sẽ tạo interface DTO sau
      setLoading(true);
      try {
         // Gọi API đăng nhập từ backend
         // Đảm bảo URL này khớp với cấu hình NestJS của bạn
         await axios.post(
            "http://localhost:8080/api/v1/auth/login",
            {
               email: values.email,
               password: values.password,
            },
            {
               withCredentials: true, // Rất quan trọng để gửi cookies (bao gồm HttpOnly cookie)
            }
         );
         message.success("Đăng nhập thành công! Đang chuyển hướng...");
         router.push("/profile"); // Chuyển hướng đến trang profile
      } catch (error: any) {
         // Xử lý lỗi từ backend
         const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
         message.error(errorMessage);
         console.error("Login error:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh", padding: "20px" }}>
         <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} hoverable>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
               <Title level={3}>Đăng nhập</Title>
               <Text type="secondary">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</Text>
            </div>
            <Form form={form} name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
               <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                     { required: true, message: "Vui lòng nhập email của bạn!" },
                     { type: "email", message: "Email không hợp lệ!" },
                  ]}
               >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
               </Form.Item>

               <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
               </Form.Item>

               <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">
                     Đăng nhập
                  </Button>
               </Form.Item>

               <Form.Item style={{ marginBottom: 0 }}>
                  <Text>
                     Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
                  </Text>
               </Form.Item>
            </Form>
         </Card>
      </Flex>
   );
};

export default LoginPage;
