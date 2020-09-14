import React, { useState, useEffect } from "react";
import streetMusic from "../../img/music_street.jpg";
import useLogin from "../../hooks/useLogin";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Radio } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "../styles/Login.scss";

const url =
  "https://accounts.spotify.com/authorize?response_type=code&client_id=4dfa491df34b4668b014dcb06d34e0ca&scope=streaming%20user-read-email%20user-read-private&redirect_uri=http://localhost:3000/spotify/callback";

const { Text } = Typography;

interface ILoginForm {
  email: String;
  password: String;
  remember: boolean;
}

const initialValues = {
  error: false,
  errorMessage: "",
  loading: false,
};

// const LoginForm = () => {
//   const history = useHistory();
//   const login = useLogin();
//   const [loginState, setLoginState] = useState(initialValues);

//   const onFinish = async (values: ILoginForm) => {
//     setLoginState({
//       error: false,
//       errorMessage: "",
//       loading: true,
//     });
//     const loginResult = await login(values);
//     if (loginResult.errors) {
//       if (loginResult.errors[0].code === 401) {
//         setLoginState({
//           error: true,
//           errorMessage: loginResult.errors[0].message,
//           loading: false,
//         });
//       } else {
//         setLoginState({
//           error: true,
//           errorMessage: "Something went wrong, please try again later",
//           loading: false,
//         });
//       }
//     } else {
//       history.push("/home");
//     }
//   };

//   return (
//     <Form
//       name="normal_login"
//       className="login-form"
//       initialValues={{ remember: true }}
//       onFinish={onFinish}
//       layout="vertical"
//     >
//       <div className="toggle-button">
//         <Link to="/" className="left-button">
//           Sign in
//         </Link>
//         <Link to="/register" className="right-button">
//           Sign up
//         </Link>
//       </div>
//       <Form.Item
//         label="Email"
//         name="email"
//         rules={[
//           {
//             type: "email",
//             message: "The input is not valid E- mail!",
//           },
//           {
//             required: true,
//             message: "Please input your E-mail!",
//           },
//         ]}
//       >
//         <Input
//           prefix={<MailOutlined className="site-form-item-icon" />}
//           placeholder="email"
//         />
//       </Form.Item>
//       <Form.Item
//         label="Password"
//         name="password"
//         rules={[{ required: true, message: "Please input your Password!" }]}
//       >
//         <Input
//           prefix={<LockOutlined className="site-form-item-icon" />}
//           type="password"
//           placeholder="Password"
//         />
//       </Form.Item>
//       <Form.Item>
//         <Form.Item name="remember" valuePropName="checked" noStyle>
//           <Checkbox>Remember me</Checkbox>
//         </Form.Item>

//         <Link className="login-form-forgot" to="/forgot-password">
//           Forgot password
//         </Link>
//       </Form.Item>
//       <Text type="danger">{loginState.errorMessage}</Text>
//       <button>
//         <a href={url}>Spotify</a>
//       </button>
//       <Form.Item>
//         <Button
//           type="primary"
//           htmlType="submit"
//           className="login-form-button"
//           loading={loginState.loading}
//           shape="round"
//         >
//           Log in
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

const Login = () => {
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
          <button>
            <a href={url}>Spotify</a>
          </button>
          {/* <LoginForm></LoginForm> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
