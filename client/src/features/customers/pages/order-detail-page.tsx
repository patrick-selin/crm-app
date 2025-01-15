import { useParams } from "react-router";
import OrderDetailDrawer from "../components/order-detail-drawer";

const OrderDetailPage = () => {
  const { id: customerId, orderId } = useParams<{ id: string; orderId: string }>();

  if (!customerId || !orderId) {
    return <p>Error: Invalid route parameters.</p>;
  }

  return (
    <OrderDetailDrawer
      customerId={customerId}
      orderId={orderId}
      opened={true}
      onClose={() => window.history.back()}
    />
  );
};

export default OrderDetailPage;
