const Footer = () => {
  return (
    <footer className="bg-white border-gray-100 shadow-sm border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Image Gallery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
