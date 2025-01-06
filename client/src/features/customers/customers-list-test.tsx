import { useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const CustomersListTest = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("Base URL:", baseUrl);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customers`
        );
        setCustomers(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch customers");
      }
    };

    fetchCustomers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Customers List</h1>
      <ul>
        {customers.map((customer: any) => (
          <li key={customer.customerId}>
            {customer.firstName} {customer.lastName} - {customer.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersListTest;
