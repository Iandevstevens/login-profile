import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import streetMusic from "../../img/music_street.jpg";
import "../styles/Login.scss";

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
      <Title>Forgot Password</Title>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          shape="round"
        >
          Reset Password
        </Button>
        Back to <Link to="/">sign in</Link>
      </Form.Item>
    </Form>
  );
};

const ForgotPassword = () => {
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

export default ForgotPassword;
