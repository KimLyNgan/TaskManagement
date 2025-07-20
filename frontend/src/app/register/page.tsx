"use client";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Form, Input, Button, Card, Typography, Flex } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore, RegisterPayLoad } from "@/store/userStore";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
   const { loading, register } = useUserStore();
   const router = useRouter();
   const [form] = Form.useForm<RegisterPayLoad>();

   const onFinish = async (values: RegisterPayLoad) => {
      const success = await register(values);
      if (success) {
         form.resetFields();
         router.push("/login");
      }
   };

   return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh", padding: "20px" }}>
         <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} hoverable>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
               <Title level={3}>Đăng ký tài khoản mới</Title>
               <Text type="secondary">Tham gia cùng chúng tôi để quản lý công việc hiệu quả hơn.</Text>
            </div>
            <Form form={form} name="register" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
               <Form.Item label="Tên người dùng" name="username" rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}>
                  <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
               </Form.Item>

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

               <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                     { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
                     { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                  hasFeedback
               >
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
               </Form.Item>

               <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                     { required: true, message: "Vui lòng xác nhận mật khẩu của bạn!" },
                     ({ getFieldValue }) => ({
                        validator(_, value) {
                           if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                           }
                           return Promise.reject(new Error("Hai mật khẩu bạn đã nhập không khớp!"));
                        },
                     }),
                  ]}
               >
                  <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
               </Form.Item>

               <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">
                     Đăng ký
                  </Button>
               </Form.Item>

               <Form.Item style={{ marginBottom: 0 }}>
                  <Text>
                     Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
                  </Text>
               </Form.Item>
            </Form>
         </Card>
      </Flex>
   );
};

export default RegisterPage;
