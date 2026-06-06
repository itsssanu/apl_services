import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import CustomersPage from './pages/CustomersPage';
import AccessoriesPage from './pages/AccessoriesPage';
import AmountPage from './pages/AmountPage';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [activePage, setActivePage] = useState('customers');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [workItems, setWorkItems] = useLocalStorage('apl_work_items', []);
  const [accessories, setAccessories] = useLocalStorage('apl_accessories', []);

  function handleSaveWorkItem(item) {
    setWorkItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [...prev, item];
    });
  }

  function handleDeleteWorkItem(id) {
    setWorkItems(prev => prev.filter(i => i.id !== id));
  }

  function handleSaveAccessory(item) {
    setAccessories(prev => [...prev, item]);
  }

  function handleDeleteAccessory(id) {
    setAccessories(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        active={activePage}
        onChange={setActivePage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
        <TopNav
          page={activePage}
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={workItems.filter(i => i.status === 'Pending').length}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'customers' && (
            <CustomersPage
              items={workItems}
              onSave={handleSaveWorkItem}
              onDelete={handleDeleteWorkItem}
            />
          )}
          {activePage === 'accessories' && (
            <AccessoriesPage
              accessories={accessories}
              onSave={handleSaveAccessory}
              onDelete={handleDeleteAccessory}
            />
          )}
          {activePage === 'amount' && (
            <AmountPage workItems={workItems} />
          )}
        </main>
      </div>
    </div>
  );
}
