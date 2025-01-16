// components/Footer.tsx
import { Text } from "@mantine/core";
const Footer = () => {
  return (
    <footer>
      <Text ta="center" size="sm" c="dimmed">
        © {new Date().getFullYear()} CRM App. Contact:{" "}
        <a
          href="https://github.com/patrick-selin"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </Text>
    </footer>
  );
};

export default Footer;
