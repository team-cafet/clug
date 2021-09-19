// @ts-nocheck
import { Breadcrumb, Button, Space, Table } from "antd";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import OrganisationService from "../../services/OrganisationService";

type Props = {};

export const Organisations: React.FC<Props> = () => {
  const query = useQuery('organisations', async () => (new OrganisationService).getAll());

  let data = [];

  if (!query.isLoading && !query.isError) {
    data = query.data?.data.map((organisation: any) => (
      {
        key: organisation.id,
        id: organisation.id,
        name: organisation.name,
        staffs: organisation.staffs.map((staff: any) => ({
          key: staff.id,
          id: staff.id,
          lastname: staff.user.lastname,
          firstname: staff.user.firstname,
          phone: staff.user.phone,
          email: staff.user.email,
        })),
      })
    );
  }

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }
  ];

  const staffExpanded = (record: any) => {
    const expandedColumns: any = [
      { title: 'id', dataIndex: 'id', key: 'id' },
      { title: 'firstname', dataIndex: 'firstname', key: 'firstname' },
      { title: 'lastname', dataIndex: 'lastname', key: 'lastname' },
      { title: 'phone', dataIndex: 'phone', key: 'phone' },
      { title: 'email', dataIndex: 'email', key: 'email' },
    ];

    return <Table columns={expandedColumns} dataSource={record.staffs} pagination={false} />
  };


  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Organisations and users</Breadcrumb.Item>
        <Breadcrumb.Item>Organisations</Breadcrumb.Item>
      </Breadcrumb>

      <Space style={{ marginTop: '25px' }}>
        <Button type="primary"><Link to="/backoffice/organisations/new">Create new Organisation</Link></Button>
      </Space>


      <div style={{ marginTop: '25px' }}>
        <Table loading={query.isLoading} dataSource={data} expandable={{ expandedRowRender: staffExpanded }} columns={columns}></Table>
      </div>
    </>
  )
}

export default Organisations;
