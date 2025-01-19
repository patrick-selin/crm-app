// pages/sign-in.tsx

import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Button } from "@mantine/core";
import { z } from "zod";
import { useLogin } from "../features/auth/hooks/auth-queries";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: zodResolver(loginSchema),
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
        {...form.getInputProps("password")}
      />
      <Button type="submit" mt="md" loading={login.isLoading}>
        Login
      </Button>
    </form>
  );
};

export default SignIn;
