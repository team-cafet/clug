// @ts-nocheck
import { Breadcrumb, Button, Divider, Form, Input, PageHeader, Space } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrganisationService from "../../services/OrganisationService";

type Props = {};

export const CreateOrganisation: React.FC<Props> = () => {
  const [withNewUser, setWithNewUser] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const createNewOrganisation = async () => {
    const validationResult = await form.validateFields();
    if(! validationResult) {
      return;
    }
    
    try {
      await (new OrganisationService).createNewOrganisationAndUser(
        form.getFieldsValue(['organisation']).organisation,
        form.getFieldsValue(['user']).user
      );

      navigate('/backoffice/organisations');
    } catch(err) {
    }
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Organisations and users</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/backoffice/organisations">Organisations</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Create new organisation</Breadcrumb.Item>
      </Breadcrumb>

      <Space style={{ marginTop: '25px' }}>
        {/* With a new user <Switch defaultChecked={true} onChange={checked => setWithNewUser(checked)} /> */}
      </Space>


      <div style={{ marginTop: '25px' }}>
        <Form form={form} name="new-org-with-new-user" onSubmitCapture={createNewOrganisation} >
          <Form.Item name={['organisation', 'name']} label="Organisation Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Divider />


          <Form.Item name={['user', 'username']} label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'firstname']} label="Firstname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'lastname']} label="Lastname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'email']} label="Email" rules={[{ required:true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name={['user', 'password']} rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['user', 'password']}
            hasFeedback
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue(['user', 'password']) === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default CreateOrganisation;
