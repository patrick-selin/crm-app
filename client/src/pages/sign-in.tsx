// pages/sign-in.tsx
import { Box, Paper, Title } from "@mantine/core";
import SignInForm from "../components/sign-in-form";

const SignIn = () => {
  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        shadow="md"
        p="lg"
        radius="md"
        withBorder
        style={{
          minWidth: "25rem",
        }}
      >
        <Title order={2} mb="md">
          Sign In
        </Title>
        <SignInForm />
      </Paper>
    </Box>
  );
};

export default SignIn;
