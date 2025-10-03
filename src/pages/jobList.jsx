import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, message, Modal } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Nav from '../components/nav';

const API_BASE = import.meta.env.VITE_BASEURL;

const JobList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState(null);
const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/instructor-applications/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setApplications(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.count || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Position',
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      filters: [
        ...new Set(applications.map(app => app.jobPosition))
      ].map(pos => ({ text: pos, value: pos })),
      onFilter: (value, record) => record.jobPosition === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: 'Pending' },
          reviewed: { color: 'blue', text: 'Under Review' },
          accepted: { color: 'green', text: 'Accepted' },
          rejected: { color: 'red', text: 'Rejected' }
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Under Review', value: 'reviewed' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Applied On',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
                setSelectedApplication(record);
                setIsModalVisible(true);
              }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const ApplicationModal = ({ visible, onClose, application }) => {
    if (!application) return null;
    
    return (
      <Modal
        title="Application Details"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ]}
        width={700}
      >
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3>Applicant Information</h3>
            <p><strong>Name:</strong> {application.name}</p>
            <p><strong>Email:</strong> {application.email}</p>
            <p><strong>Phone:</strong> {application.phone || 'N/A'}</p>
            <p><strong>Position:</strong> {application.jobPosition}</p>
            <p>
              <strong>Status:</strong>{' '}
              <Tag color={
                application.status === 'accepted' ? 'green' : 
                application.status === 'rejected' ? 'red' : 
                application.status === 'reviewed' ? 'blue' : 'orange'
              }>
                {application.status?.toUpperCase()}
              </Tag>
            </p>
          </div>
          
          {application.message && (
            <div style={{ marginBottom: '16px' }}>
              <h4>Cover Letter</h4>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                whiteSpace: 'pre-line'
              }}>
                {application.message}
              </div>
            </div>
          )}
          
          {application.skills && (
            <div style={{ marginBottom: '16px' }}>
              <h4>Skills</h4>
              <div>
                {application.skills.map((skill, index) => (
                  <Tag key={index} style={{ marginBottom: '4px' }}>{skill}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <>
    <Nav />
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '84px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Job Applications</h1>
        <Button 
          type="primary" 
          onClick={() => navigate('/instructor-form')}
          style={{ marginBottom: '16px' }}
        >
          Apply for Instructor
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={applications}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} applications`
        }}
        onChange={(pagination) => {
          setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        }}
        scroll={{ x: 'max-content' }}
      />
      <ApplicationModal 
      visible={isModalVisible} 
      onClose={() => setIsModalVisible(false)} 
      application={selectedApplication} 
    />
    </div>
    </>
  );
};

export default JobList;