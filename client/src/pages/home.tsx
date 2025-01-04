// pages/home.tsx
import { Title, Text } from "@mantine/core";
import TestItemsList from "../utils/constants/TestItemsList";

// poista tama ku oikeet testit on kirjoitettu
// test
function Home() {
  return (
    <div>
      <Title order={1}>Home</Title>
      <div>
        <Title order={2}>home h2</Title>
        <Text size="md">Welcome to your Dashboard!</Text>
      </div>
      <TestItemsList />
    </div>
  );
}

export default Home;
