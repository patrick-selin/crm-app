import { useParams } from "react-router";
import OrderDetailDrawer from "../components/order-detail-drawer";

const OrderDetailPage = () => {
  const { id: customerId, orderId } = useParams<{ id: string; orderId: string }>();

  return (
    <OrderDetailDrawer
      orderId={orderId!}
      customerId={customerId!}
      opened={true}
      onClose={() => window.history.back()}
    />
  );
};

export default OrderDetailPage;