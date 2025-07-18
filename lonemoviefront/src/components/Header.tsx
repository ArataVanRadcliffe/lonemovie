import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const menu = [
    { label: "Home", path: "/" },
    { label: "Login", path: "/login" },
  ];

  return (
    <header className="bg-zinc-950 text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-md shadow-black/20 sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"
      >
        LoneMovie
      </Link>

      {/* Menu */}
      <nav className="flex items-center gap-5 text-sm sm:text-base">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`transition-colors duration-200 hover:text-violet-400 ${
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/")
                ? "text-violet-500 font-semibold"
                : "text-gray-300"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
