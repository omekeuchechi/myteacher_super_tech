import { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Tag, Space, message, Select, Input, DatePicker } from 'antd';
import { DownloadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import '../../assets/styles/admin/jobRoom.css';
import { AuthContext } from "../../../context/Authcontext"; 

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const API_BASE = import.meta.env.VITE_BASEURL;

const JobRoom = () => {
  const { user } = useContext(AuthContext);    
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: null
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        status: filters.status || undefined,
        search: filters.search || undefined,
        startDate: filters.dateRange?.[0]?.toISOString(),
        endDate: filters.dateRange?.[1]?.toISOString()
      };

      const response = await axios.get(`${API_BASE}/instructor-applications`, { params, headers: { Authorization: `Bearer ${token}` } });
      setApplications(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.count,
      });
    } catch (error) {
      message.error('Failed to fetch applications');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [pagination.current, pagination.pageSize, filters]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleStatusChange = async () => {
    if (!selectedApp || !statusUpdate) return;

    try {
      setUpdating(true);
      await axios.patch(`${API_BASE}/instructor-applications/${selectedApp._id}/status`, {
        status: statusUpdate
      }, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Application status updated');
      setModalVisible(false);
      fetchApplications();
    } catch (error) {
      message.error('Failed to update status');
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const downloadResume = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/instructor-applications/${id}/resume`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Failed to download resume');
      console.error('Error:', error);
    }
  };

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`${API_BASE}/instructor-applications/deleteApplication/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      message.success('Application deleted');
      fetchApplications();
    } catch (error) {
      message.error('Failed to delete application');
      console.error('Error:', error);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Pending' },
      reviewed: { color: 'blue', text: 'Under Review' },
      accepted: { color: 'green', text: 'Accepted' },
      rejected: { color: 'red', text: 'Rejected' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

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
      title: 'Applied On',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Under Review', value: 'reviewed' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedApp(record);
              setModalVisible(true);
            }}
          >
            View
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadResume(record._id)}
          >
            Resume
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteApplication(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="job-room-container">
      <div className="job-room-header">
        <h1>Job Applications</h1>
        <div className="filters-container">
          <Search
            placeholder="Search by name or email"
            onSearch={(value) => setFilters({ ...filters, search: value })}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 200, marginLeft: 10 }}
            allowClear
            onChange={(value) => setFilters({ ...filters, status: value })}
          >
            <Option value="pending">Pending</Option>
            <Option value="reviewed">Under Review</Option>
            <Option value="accepted">Accepted</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <RangePicker
            style={{ marginLeft: 10 }}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={applications}
        rowKey="_id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Application Details"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedApp(null);
          setStatusUpdate('');
        }}
        footer={null}
        width={800}
      >
        {selectedApp && (
          <div className="application-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span>{selectedApp.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span>{selectedApp.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span>{selectedApp.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Position:</span>
              <span>{selectedApp.jobPosition}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span>
                {selectedApp.location?.city}, {selectedApp.location?.state}, {selectedApp.location?.country}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Applied On:</span>
              <span>{dayjs(selectedApp.appliedAt).format('MMM D, YYYY h:mm A')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              {getStatusTag(selectedApp.status)}
            </div>
            <div className="detail-row">
              <span className="detail-label">LinkedIn/Portfolio:</span>
              <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer">
                {selectedApp.linkedin}
              </a>
            </div>
            <div className="detail-row full-width">
              <span className="detail-label">Message:</span>
              <div className="message-content">{selectedApp.message}</div>
            </div>

            <div className="status-update-section">
              <h3>Update Status</h3>
              <div className="status-actions">
                <Select
                  style={{ width: 200 }}
                  placeholder="Select status"
                  value={statusUpdate}
                  onChange={setStatusUpdate}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="reviewed">Under Review</Option>
                  <Option value="accepted">
                    <Space>
                      <CheckCircleOutlined />
                      Accept
                    </Space>
                  </Option>
                  <Option value="rejected">
                    <Space>
                      <CloseCircleOutlined />
                      Reject
                    </Space>
                  </Option>
                </Select>
                <Button
                  type="primary"
                  onClick={handleStatusChange}
                  loading={updating}
                  disabled={!statusUpdate}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobRoom;