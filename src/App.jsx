import AppRoutes from "./routes/AppRoutes";
import UserLayout from "./components/UserLayout";

const App = () => {
  return (
    <UserLayout>
      <AppRoutes />
    </UserLayout>
  );
};

export default App;
