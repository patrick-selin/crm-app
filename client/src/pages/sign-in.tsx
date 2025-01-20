// pages/sign-in.tsx
import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Button, Box, Paper, Title } from "@mantine/core";
import { useLogin } from "../features/auth/hooks/auth-queries";
import { useNavigate } from "react-router";
import { LoginSchema } from "../schemas/user-and-auth-schemas";

const SignIn = () => {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: zodResolver(LoginSchema),
  });

  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (values: { email: string; password: string }) => {
    login.mutate(values, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            withAsterisk
            mt="sm"
            {...form.getInputProps("password")}
          />
          <Button fullWidth type="submit" mt="xl" loading={login.isPending}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignIn;