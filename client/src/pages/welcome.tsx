import {
    Container,
    Paper,
    Title,
    Text,
    Button,
    Group,
    CopyButton,
    Flex,
  } from "@mantine/core";
  import { Link } from "react-router";
  import SignInForm from "../components/sign-in-form";

  const Welcome: React.FC = () => {
    const demoCredentials = {
      email: "demo@example.com",
      password: "password123",
    };
  
    const handleGenerateUser = () => {
      console.log("Generate user clicked");
    };
  
    return (
    <Container size="md" style={{ padding: "2rem" }}>
      {/* Welcome and Demo User Section */}
      <Paper withBorder shadow="md" p="lg" radius="md" style={{ marginBottom: "2rem" }}>
        <Flex
          gap="xl"
          align="flex-start"
          style={{
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* Demo User Section */}
          <div style={{ flex: 1, minWidth: "300px", marginBottom: "1rem" }}>
            <Title order={2} style={{ marginBottom: "1rem" }}>
              Welcome to the CRM Appi
            </Title>
            <Text size="md" style={{ marginBottom: "1.5rem" }}>
              Explore the app features, manage customers, and see what's in store
              for future updates.
            </Text>

            <Group align="center" style={{ marginBottom: "1rem" }}>
              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue" }}
                onClick={handleGenerateUser}
              >
                Generate Demo User
              </Button>
              <CopyButton
                value={`Email: ${demoCredentials.email}\nPassword: ${demoCredentials.password}`}
              >
                {({ copied, copy }) => (
                  <Button onClick={copy} color={copied ? "green" : "blue"}>
                    {copied ? "Copied!" : "Copy Login Credentials"}
                  </Button>
                )}
              </CopyButton>
            </Group>
          </div>

          {/* Sign-In Form Section */}
          <div style={{ flex: 1, minWidth: "300px", padding: "1rem" }}>
            <Paper
              shadow="sm"
              p="md"
              radius="md"
              withBorder
              style={{ minWidth: "100%", maxWidth: "400px" }}
            >
              <Title order={3} style={{ marginBottom: "1rem" }}>
                Sign In
              </Title>
              <SignInForm onSuccessRedirect="/dashboard" />
            </Paper>
          </div>
        </Flex>
      </Paper>

      {/* App Features Progress Section */}
      <Paper withBorder shadow="md" p="lg" radius="md">
        <Title order={3} style={{ marginBottom: "1rem" }}>
          App features progress:
        </Title>

        <Flex direction="column" gap="md">
          <div>
            <Title order={4}>Customers</Title>
            <Text size="sm">
              Backend: Node.js. Manage customers with full CRUD functionality.
            </Text>
            <Link
              to="/customers"
              style={{
                textDecoration: "none",
                marginTop: "0.5rem",
                display: "inline-block",
              }}
            >
              <Button variant="light" style={{ margin: "0.5rem" }}>
                Go to Customers
              </Button>
            </Link>
          </div>

          <div>
            <Title order={4}>Orders</Title>
            <Text size="sm">Backend: Node.js. Manage customer orders.</Text>
            <Button variant="light" disabled style={{ margin: "0.5rem" }}>
              Orders Coming Soon
            </Button>
          </div>

          <div>
            <Title order={4}>Products</Title>
            <Text size="sm">
              Backend: Spring Boot. Manage the product catalog.
            </Text>
            <Button variant="light" disabled style={{ margin: "0.5rem" }}>
              Products Coming Soon
            </Button>
          </div>

          <div>
            <Title order={4}>Dashboard</Title>
            <Text size="sm">
              Backend: Node.js. View a summary of app features and metrics.
            </Text>
            <Button variant="light" disabled style={{ margin: "0.5rem" }}>
              Dashboard Coming Soon
            </Button>
          </div>
        </Flex>
      </Paper>
    </Container>
  );
};

export default Welcome;