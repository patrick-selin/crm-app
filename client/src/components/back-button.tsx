import { useNavigate } from "react-router";
import { Button } from "@mantine/core";

interface BackButtonProps {
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <Button mt="sm" variant="light" onClick={() => navigate(-1)}>
      {label}
    </Button>
  );
};

export default BackButton;
