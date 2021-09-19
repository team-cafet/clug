// @ts-nocheck
import { Breadcrumb, Button, Space, Table } from "antd";
import { useQuery } from "react-query";
import UserService from "../../services/UserService";

type Props = {};

export const Users: React.FC<Props> = () => {
  const query = useQuery('users', async () => (new UserService).getAll());

  let data = [];

  if (!query.isLoading && !query.isError) {
    data = query.data?.data.map((user: any) => (
      {
        key: user.id,
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        groupName: user.group?.name ?? 'No Group',
      })
    );
  }

  const columns: any = [
    { title: 'Id', dataIndex: 'id', key: 'id'},
    { title: 'Firstname', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Lastname', dataIndex: 'lastname', key: 'lastname' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Group', dataIndex: 'groupName', key: 'groupName' },
  ];

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Organisations and users</Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>

      <Space style={{ marginTop: '25px' }}>
      </Space>


      <div style={{ marginTop: '25px' }}>
        <Table loading={query.isLoading} dataSource={data} columns={columns}></Table>
      </div>
    </>
  )
}

export default Users;
