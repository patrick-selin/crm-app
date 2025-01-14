// layouts/app-layout.tsx
import { Outlet } from "react-router";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { Container } from "@mantine/core";
import classes from "./app-layout.module.css";
const AppLayout = () => {

  return (
    <div className={classes.appLayout}>
      <Header />
      <main className={classes.mainContent}>
        <Container size="lg">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
