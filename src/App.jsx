import AppRoutes from "./routes/AppRoutes";
import UserLayout from "./components/UserLayout";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const App = () => {
   const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return (
    <UserLayout>
      <AppRoutes />
    </UserLayout>
  );
};

export default App;
