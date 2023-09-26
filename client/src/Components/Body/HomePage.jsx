import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Form, Input, Modal, Select, Table, message, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Spinner from "../Spinner";
import moment from "moment";
import Analytics from "../Analytics";
import "../../index.css";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [editable, setEditable] = useState(null);
  const [viewData, setViewData] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);

  // Table Data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Tenants Name",
      dataIndex: "tenantsName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Types",
      dataIndex: "type",
      render: (text) => (
        <span
          style={{
            backgroundColor:
              text === "rentCollected"
                ? "green"
                : text === "rentRemaining"
                ? "red"
                : "transparent",
            color: "white",
            display: "block",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Advance Amount",
      dataIndex: "advanceAmount",
      render: (text) => (
        <span
          className={`custom-text-black`}
          style={{
            backgroundColor:
              text >= 1 ? "green" : text === 0 ? "transparent" : "white",
            color: text === 0 ? "black" : "white",
            display: "block",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Due Amount",
      dataIndex: "dueAmount",
      render: (text) => (
        <span
          className={`custom-text-black`}
          style={{
            backgroundColor:
              text >= 1 ? "red" : text === 0 ? "transparent" : "white",
            color: text === 0 ? "black" : "white",
            display: "block",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => handleEdit(record)} />
          <DeleteOutlined
            className="mx-2"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditable(record);
    setShowModal(true);
  };

  const handleRowClick = (record) => {
    setEditable(record);
    setShowModal(true);
  };

  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user,"user from local")
        setLoading(true);
        const res = await axios.post("transaction/get-transaction", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setAllTransaction(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue With Transaction");
      }
    };
    getAllTransaction();
  }, [frequency, selectedDate, type]);

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allTransaction.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("transaction/delete-transaction", {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted");
      setAllTransaction((prevTransaction) =>
        prevTransaction.filter((item) => item._id !== record._id)
      );
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("transaction/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("transaction/add-transaction", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null); // Reset 'editable' after editing or adding
      const updatedTransaction = await axios.post("transaction/get-transaction", {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });
      setAllTransaction(updatedTransaction.data);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add/update transaction");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select
            value={frequency}
            onChange={(values) => setFrequency(values)}
          >
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select
            value={type}
            onChange={(values) => {
              console.log("Selected Type:", values);
              setType(values);
            }}
          >
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="rentCollected">Rent Collected</Select.Option>
            <Select.Option value="rentRemaining">Rent Remaining</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditable(null);
              setShowModal(true);
            }}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table
            columns={columns}
            dataSource={currentItems}
            pagination={{
              current: currentPage,
              pageSize: itemsPerPage,
              total: allTransaction.length,
              onChange: handlePageChange,
            }}
            // Use onRow prop to specify the click handler for rows
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null);
        }}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Tenant Name" name="tenantsName">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="rentCollected">Rent Collected</Select.Option>
              <Select.Option value="rentRemaining">Rent Remaining</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Type of Room" name="roomTypes">
            <Select>
              <Select.Option></Select.Option>
              <Select.Option value="single-room">Single Room</Select.Option>
              <Select.Option value="multiple-room">Multiple Room</Select.Option>
              <Select.Option value="1bhk">1BHK</Select.Option>
              <Select.Option value="2bhk">2BHK</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Advance Amount" name="advanceAmount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Due Amount" name="dueAmount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {editable ? "Update" : "Save"}
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
