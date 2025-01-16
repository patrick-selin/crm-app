import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  ActionIcon,
  Avatar,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLink } from "react-router";
import ThemeSwitcher from "../theme-switcher/theme-switcher";
import { BellIcon, QueueListIcon } from "@heroicons/react/24/outline";
import classes from "./header.module.css";
import { NAV_LINKS } from "../../utils/constants/constants";

const Header = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const theme = useMantineTheme();

  const isAuthenticated = true;

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* Logo */}
          <NavLink to="/" className={classes.logo}>
            <QueueListIcon
              className={classes.logoicon}
              style={{ width: 24, height: 24 }}
            />
            CRM App
          </NavLink>

          {/* Desktop navigation */}
          <nav className={classes.nav}>
            <Group h="100%" visibleFrom="sm">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.link} ${classes.linkactive}`
                      : classes.link
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </Group>
          </nav>

          {/* Right-side actions */}
          <Group visibleFrom="sm" gap="sm">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <>
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  size="lg"
                  color="pink"
                  style={{
                    borderColor: isDark
                      ? theme.colors.dark[4]
                      : theme.colors.gray[4],
                  }}
                >
                  <BellIcon
                    className="h-1 w-1"
                    style={{
                      color: isDark
                        ? theme.colors.dark[0]
                        : theme.colors.gray[7],
                    }}
                  />
                </ActionIcon>
                <Avatar alt="User Avatar" radius="xl" name="PS" />
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  component={NavLink}
                  to="/sign-in"
                  className={classes.linkButton}
                >
                  Log in
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  className={classes.linkButton}
                >
                  Sign up
                </Button>
              </>
            )}
          </Group>

          {/* Burger menu for mobile */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      {/* Mobile menu */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <nav className={classes.drawerNav}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? `${classes.link} ${classes.active}` : classes.link
                }
                onClick={closeDrawer}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {isAuthenticated ? (
              <>
                <ActionIcon variant="light" radius="xl">
                  <BellIcon style={{ width: 20, height: 20 }} />
                </ActionIcon>
                <Avatar alt="User Avatar" radius="xl" />
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  component={NavLink}
                  to="/sign-in"
                  className={classes.linkButton}
                >
                  Log in
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  className={classes.linkButton}
                >
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
