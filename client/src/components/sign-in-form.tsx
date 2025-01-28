import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Button} from "@mantine/core";
import { useLogin } from "../features/auth/hooks/auth-queries";
import { useNavigate } from "react-router";
import { LoginSchema } from "../schemas/user-and-auth-schemas";

interface SignInFormProps {
  onSuccessRedirect?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccessRedirect = "/dashboard" }) => {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: zodResolver(LoginSchema),
  });

  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (values: { email: string; password: string }) => {
    login.mutate(values, {
      onSuccess: () => {
        navigate(onSuccessRedirect); 
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
        mt="sm"
        {...form.getInputProps("password")}
      />
      <Button fullWidth type="submit" mt="xl" loading={login.isPending}>
        Login
      </Button>
    </form>
  );
};

export default SignInForm;
