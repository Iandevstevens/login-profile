import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Row, Col, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import streetMusic from "../img/music_street.jpg";
import "./styles/Login.scss";
// import { ValidateErrorEntity } from "../../node_modules/rc-field-form/lib/interface";

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginForm = () => {
  const history = useHistory();
  const onFinish = (values: string) => {
    console.log("Success:", values);
    history.push("/home");
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Title>Register</Title>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item name="remember" valuePropName="checked" noStyle>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="/">sign in!</Link>
      </Form.Item>
    </Form>
  );
};

const Register = () => {
  return (
    <div className="full-background">
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img className="left-card" src={streetMusic} alt="" height="100%" />
        <div className="right-card">
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
};

export default Register;
