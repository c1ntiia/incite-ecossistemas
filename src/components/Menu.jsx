import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Users, 
  Map as MapIcon, 
  FileText 
} from "lucide-react";

// Array de rotas
const NAV_ITEMS = [
  { name: "Início", path: "/", icon: Home },
  { name: "Ações", path: "/acoes", icon: BookOpen },
  { name: "Pesquisadores", path: "/pesquisadores", icon: Users },
  { name: "Mapa", path: "/mapa", icon: MapIcon },
  { name: "Produções", path: "/producoes", icon: FileText },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="w-full px-6 lg:px-16">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img src="/logo.png" alt="Logo INCITE" className="h-14 w-auto object-contain"/>
            </Link>
          </div>  

          <nav className="hidden md:flex space-x-8 items-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600 focus:outline-none p-2"
              aria-label="Menu"
            >
              {isOpen ? (
                <X className="h-7 w-7 transition-transform" />
              ) : (
                <Menu className="h-7 w-7 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}