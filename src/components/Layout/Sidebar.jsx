import { Users, Package, CreditCard, Wrench, X, Settings } from 'lucide-react';
import { useAuth } from "../../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    path: "/",
    label: "Customers",
    icon: Users,
  },
  {
    path: "/accessories",
    label: "Accessories",
    icon: Package,
  },
  {
    path: "/amount",
    label: "Amount",
    icon: CreditCard,
  },
];
export default function Sidebar({ open, onClose }) {
  const { company } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 z-40 flex flex-col
          bg-navy-950 transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              {company?.logo_url ? (
                <img
                  src={company.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Wrench className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="text-white font-display font-semibold text-base leading-none tracking-tight">
                {company?.company_name || "Velvit"}
              </div>
              <div className="text-white/40 text-xs mt-0.5 font-body">
                Work Management
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <div className="px-3 mb-3">
            <span className="text-white/30 text-xs uppercase tracking-widest font-semibold">
              Main Menu
            </span>
          </div>
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                onClose();
              }}
              className={`sidebar-link w-full text-left ${location.pathname === path ? "active" : ""
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>

              {location.pathname === path && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </button>
          ))}
        </nav>

        {/* Settings */}
<div className="px-3 pb-4 border-t border-white/10 pt-4">
  <button
    onClick={() => {
      navigate("/settings");
      onClose();
    }}
    className={`sidebar-link w-full text-left ${
      location.pathname.startsWith("/settings")
        ? "active"
        : ""
    }`}
  >
    <Settings className="w-4 h-4 flex-shrink-0" />
    <span>Settings</span>

    {location.pathname.startsWith("/settings") && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
    )}
  </button>
</div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {company?.company_name?.charAt(0)?.toUpperCase() || "V"}
            </div>
            <div>
              <div className="text-white text-sm font-medium">{company?.company_name || "Velvit"}</div>
              <div className="text-white/40 text-xs">Business</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
