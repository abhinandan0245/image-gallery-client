import Navbar from "./Navbar";
import Footer from "./Footer";

const UserLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
