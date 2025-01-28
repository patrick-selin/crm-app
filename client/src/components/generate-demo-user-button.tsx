import { Button, Notification, Text, CopyButton, Group } from "@mantine/core";
import { faker } from "@faker-js/faker";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const GenerateDemoUserButton: React.FC = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const demoUser = {
        username: faker.internet.username(),
        email: faker.internet.email({ provider: "test.fi" }),
        password: faker.internet.password({ length: 10 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: `040${faker.string.numeric(7)}`,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode("#####"),
        country: faker.location.country(),
      };

      const baseUrl = `${import.meta.env.VITE_BASE_URL}`;
      const response = await axios.post(`${baseUrl}/auth/register`, demoUser);

      return { ...response.data, ...demoUser };
    },
    onSuccess: () => {},
    onError: () => {},
  });

  const { mutate, isPending, isSuccess, isError, error, data, reset } =
    mutation;

  return (
    <div>
      <Button
        variant="gradient"
        gradient={{ from: "teal", to: "blue" }}
        onClick={() => {
          reset();
          mutate();
        }}
        loading={isPending}
      >
        Generate Demo User
      </Button>

      {isSuccess && data && (
        <Notification
          title="Demo User Created"
          color="green"
          onClose={() => reset()}
          style={{ marginTop: "1rem" }}
        >
          <Group
            justify="space-between"
            align="center"
            style={{ marginBottom: "0.5rem" }}
          >
            <div>
              <Text size="sm">
                <strong>Email:</strong> {data.email}
              </Text>
            </div>
            <CopyButton value={data.email}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  color={copied ? "green" : "blue"}
                  onClick={copy}
                  size="xs"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm">
                <strong>Password:</strong> {data.password}
              </Text>
            </div>
            <CopyButton value={data.password} >
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  color={copied ? "green" : "blue"}
                  onClick={copy}
                  size="xs"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Notification>
      )}

      {isError && error instanceof AxiosError && (
        <Notification
          title="Error"
          color="red"
          onClose={() => reset()}
          style={{ marginTop: "1rem" }}
        >
          {error.response?.data?.message || "Failed to generate demo user."}
        </Notification>
      )}
    </div>
  );
};

export default GenerateDemoUserButton;
