import { useState } from 'react';
import { Bell, Menu, ChevronDown, LogOut, Settings, User } from 'lucide-react';

const PAGE_TITLES = {
  customers: { title: 'Customers', subtitle: 'Manage all service work items.' },
  accessories: { title: 'Accessories', subtitle: 'Track products bought per work type.' },
  amount: { title: 'Amount Summary', subtitle: 'Overall and per-customer financials.' },
};

export default function TopNav({ page, onMenuClick, notifCount = 0 }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const info = PAGE_TITLES[page] || PAGE_TITLES.customers;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Page title shown in nav on mobile */}
          <div className="lg:hidden">
            <h1 className="font-display font-semibold text-navy-900 text-lg leading-none">
              {info.title}
            </h1>
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <Bell className="w-5 h-5" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                AP
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-800 leading-none">Admin</div>
                <div className="text-xs text-gray-400 mt-0.5">APL Services</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-modal border border-gray-100 z-20 overflow-hidden animate-scale-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-800">Admin</div>
                    <div className="text-xs text-gray-400">admin@aplservices.in</div>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
