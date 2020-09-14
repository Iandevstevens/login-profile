import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import streetMusic from "../../img/music_street.jpg";
import "../styles/Login.scss";

import useRegister from "../../hooks/useRegister";

const { Title, Text } = Typography;

interface IRegisterForm {
  email: String;
  displayName: String;
  password: String;
  remember: boolean;
}

const initialValues = {
  error: false,
  errorMessage: "",
  loading: false,
};

const RegisterForm = () => {
  const history = useHistory();
  const register = useRegister();
  const [registerState, setRegisterState] = useState(initialValues);

  const onFinish = async (values: IRegisterForm) => {
    setRegisterState({
      error: false,
      errorMessage: "",
      loading: true,
    });
    const registerResults = await register(values);
    if (registerResults.errors) {
      setRegisterState({
        error: true,
        errorMessage: "Something went wrong, please try again later",
        loading: false,
      });
    } else {
      history.push("/home");
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <div className="toggle-button">
        <Link to="/" className="left-button">
          Sign in
        </Link>
        <Link to="/register" className="right-button">
          Sign up
        </Link>
      </div>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E- mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        label="Display Name"
        name="displayName"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Display name" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
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
      <Text>{registerState.errorMessage}</Text>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={registerState.loading}
          shape="round"
        >
          Register
        </Button>
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
          <RegisterForm></RegisterForm>
        </div>
      </div>
    </div>
  );
};

export default Register;
