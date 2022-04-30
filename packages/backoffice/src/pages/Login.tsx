import { Button, Form, Input, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/user";

type Props = {}

export const Login: React.FC<Props> = props => {

  const navigate = useNavigate();
  const userStore = useUserStore();
  const [loginError, setLoginError] = useState(false);
  
  const [form] = Form.useForm();

  const login = async () => {
    const validationResult = await form.validateFields();
    if(! validationResult) {
      return;
    }

    try {
      await userStore.login(form.getFieldValue('username'), form.getFieldValue('password'));
      navigate('/backoffice');

    } catch(err) {
      setLoginError(true);
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Content style={{minHeight: '500px', paddingTop: '5%'}}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onSubmitCapture={login}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
                    
          {loginError ?? <Form.Item>
            Unauthorized
          </Form.Item>}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

      </Content>
      <Footer style={{ textAlign: 'center' }}>Clug Backoffice</Footer>
    </Layout>
  )
};
