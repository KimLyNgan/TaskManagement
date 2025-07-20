// task_management/frontend/src/app/login/page.tsx
"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography, Flex } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore, LoginPayLoad } from "@/store/userStore";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
   const { loading, isAuthenticated, login, fetchProfile } = useUserStore();
   const router = useRouter();
   const [form] = Form.useForm<LoginPayLoad>();

   const onFinish = async (values: LoginPayLoad) => {
      const success = await login(values);
      if (success) {
         const profileFetched = await fetchProfile();
         if (profileFetched) {
            router.push("/profile");
         } else {
            router.push("/login");
         }
      }
   };
   // useEffect(() => {
   //    if (isAuthenticated) {
   //       router.push("/profile");
   //    }
   // }, [isAuthenticated, router]);

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
