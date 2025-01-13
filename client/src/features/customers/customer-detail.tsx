// features/customers/customer-detail.tsx

import { useParams } from "react-router";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>custromer detail page. id on {id}</h2>
    </div>
  );
};

export default CustomerDetail;
