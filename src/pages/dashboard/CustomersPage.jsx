import { useState } from 'react';
import {
  Plus, Search, Filter, X, Eye, Pencil, Trash2,
  Briefcase, Clock, RefreshCw, CheckCircle2, Phone, MapPin, Calendar, ChevronDown,
  Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  WORK_TYPES, STATUSES, PRIORITIES, STATUS_STYLES, PRIORITY_STYLES, formatDate, formatCurrency, MONTHS, YEARS,
  getCurrentMonthYear, getMonthDateRange
} from "../../utils/constants";
import WorkItemModal from '../../components/modals/WorkItemModal';
import ViewModal from '../../components/modals/ViewModal';

function StatCard({ label, value, type, icon: Icon }) {
  const styles = {
    total: { bg: 'bg-indigo-50', icon: 'text-indigo-600 bg-indigo-100', num: 'text-indigo-900', sub: 'text-indigo-500' },
    new: { bg: 'bg-amber-50', icon: 'text-amber-600 bg-amber-100', num: 'text-amber-900', sub: 'text-amber-500' },
    pending: { bg: 'bg-red-50', icon: 'text-red-600 bg-red-100', num: 'text-red-900', sub: 'text-red-500' },
    inprocess: { bg: 'bg-orange-50', icon: 'text-orange-600 bg-orange-100', num: 'text-orange-900', sub: 'text-orange-500' },
    completed: { bg: 'bg-green-50', icon: 'text-green-600 bg-green-100', num: 'text-green-900', sub: 'text-green-500' },
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} rounded-2xl p-5 flex items-center justify-between`}>
      <div>
        <div className={`text-sm font-medium ${s.sub} mb-1`}>{label}</div>
        <div className={`font-display text-3xl font-bold ${s.num}`}>{value}</div>
      </div>
      <div className={`w-11 h-11 rounded-xl ${s.icon} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

// Mobile card for a customer
function CustomerCard({ item, onView, onEdit, onDelete }) {
  const statusClass = STATUS_STYLES[item.status] || 'badge-new';
  const priorityClass = PRIORITY_STYLES[item.priority] || 'priority-none';


  return (
    <div className="card p-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white font-display font-bold text-base flex-shrink-0">
            {item.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" /> {item.phone}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onView(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy-600 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={statusClass}>{item.status}</span>
        <span className={priorityClass}>{item.priority}</span>
        {item.workType && (
          <span className="badge bg-gray-100 text-gray-600">{item.workType}</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(item.date)}
        </div>
        {item.totalAmount && (
          <div className="font-semibold text-navy-800">{formatCurrency(item.totalAmount)}</div>
        )}
      </div>
    </div>
  );
}

export default function CustomersPage({ items, onSave, onDelete, filters, setFilters, page, setPage, totalRows }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    name,
    status,
    workType,
    priority,
    startDate,
    endDate,
    month,
    year
  } = filters;

  function updateMonth(month) {
    const range = getMonthDateRange(
      month,
      filters.year
    );
    setPage(1);
    setFilters(prev => ({
      ...prev,
      month,
      startDate: range.startDate,
      endDate: range.endDate
    }));
  }

  function updateYear(year) {
    const range = getMonthDateRange(
      filters.month,
      year
    );
    setPage(1);
    setFilters(prev => ({
      ...prev,
      year,
      startDate: range.startDate,
      endDate: range.endDate
    }));
  }

  const customDateSelected = (() => {
    if (!filters.month || !filters.year)
      return true;
    const range = getMonthDateRange(
      filters.month,
      filters.year
    );
    return (
      range.startDate !== filters.startDate ||
      range.endDate !== filters.endDate
    );

  })();

  const isCustomRange = customDateSelected;

  // Stats
  const total = items.length;
  const newwork = items.filter(i => i.status === 'New').length;
  const pending = items.filter(i => i.status === 'Pending').length;
  const inProcess = items.filter(i => i.status === 'InProcess').length;
  const completed = items.filter(i => i.status === 'Completed').length;
  const current = getCurrentMonthYear();

  const hasFilters = name || status || workType || priority || month !== current.month || year !== current.year || customDateSelected;




  function clearFilters() {
    const current = getCurrentMonthYear();

    const range = getMonthDateRange(
      current.month,
      current.year
    );
    setFilters({
      name: "",
      status: "",
      workType: "",
      priority: "",
      month: current.month,
      year: current.year,
      startDate: range.startDate,
      endDate: range.endDate
    });
    setPage(1);
  }

  function handleEdit(item) {
    setEditItem(item);
    setModalOpen(true);
  }

  function handleView(item) {
    setViewItem(item);
    setViewModalOpen(true);
  }

  function handleDelete(id) {
    setDeleteId(id);
    setDeleteModalOpen(true);
  }

  function confirmDelete() {
    if (deleteId) {
      onDelete(deleteId);
    }

    setDeleteModalOpen(false);
    setDeleteId(null);
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="hidden lg:block">
          <h1 className="font-display text-2xl font-semibold text-navy-900">Customers</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage all service work items.</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="btn-primary ml-auto"
        >
          <Plus className="w-4 h-4" />
          Add Work Item
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Jobs" value={total} type="total" icon={Briefcase} />
        <StatCard label="New" value={newwork} type="new" icon={Sparkles} />
        <StatCard label="Pending" value={pending} type="pending" icon={Clock} />
        <StatCard label="In Process" value={inProcess} type="inprocess" icon={RefreshCw} />
        <StatCard label="Completed" value={completed} type="completed" icon={CheckCircle2} />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {/* Name search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={e => {
                setPage(1);
                setFilters(prev => ({
                  ...prev,
                  name: e.target.value
                }));
              }}
              placeholder="Search name..."
              className="input-field pl-9 h-9 text-xs"
            />
          </div>

          {/* Status */}
          <select value={status}
            onChange={e => {
              setPage(1);
              setFilters(prev => ({
                ...prev,
                status: e.target.value
              }))
            }}
            className="input-field h-9 text-xs w-auto min-w-[130px]">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Custom Date Range */}
          <select
            disabled={isCustomRange}
            value={customDateSelected ? "" : filters.month}
            onChange={(e) => {
              if (!e.target.value) return;
              updateMonth(Number(e.target.value));
            }}
            className="input-field h-9 text-xs w-auto min-w-[130px]">

            <option value="">
              Custom
            </option>
            {MONTHS.map(m => (
              <option
                key={m.value}
                value={m.value}
              >
                {m.label}
              </option>
            ))
            }
          </select>

          <select
            disabled={isCustomRange}
            value={customDateSelected ? "" : filters.year}
            onChange={(e) => {
              if (!e.target.value) return;
              updateYear(Number(e.target.value));
            }}
            className="input-field h-9 text-xs w-auto min-w-[110px]">
            <option value="">
              —
            </option>
            {YEARS.map(year => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))
            }
          </select>

          {/* Date */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => {
                setPage(1);
                setFilters(prev => ({
                  ...prev,
                  startDate: e.target.value,
                  month: "",
                  year: ""
                }))
              }}
              className="input-field h-9 text-xs"
              title="Start Date"
            />

            <span className="text-gray-400 text-xs">to</span>

            <input
              type="date"
              value={endDate}
              onChange={e => {
                setPage(1);
                setFilters(prev => ({
                  ...prev,
                  endDate: e.target.value,
                  month: "",
                  year: ""
                }))
              }}
              className="input-field h-9 text-xs"
              title="End Date"
            />
          </div>

          {/* Work Type */}
          <select value={workType}
            onChange={e => {
              setPage(1);
              setFilters(prev => ({
                ...prev,
                workType: e.target.value
              }))
            }}
            className="input-field h-9 text-xs w-auto min-w-[140px]">
            <option value="">All Work Types</option>
            {WORK_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
          </select>

          {/* Priority */}
          <select value={priority}
            onChange={e => {
              setPage(1);
              setFilters(prev => ({
                ...prev,
                priority: e.target.value
              }))
            }}
            className="input-field h-9 text-xs w-auto min-w-[130px]">
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table – Desktop */}
      <div className="card hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone No</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Work Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <div className="font-medium">No work items found</div>
                    <div className="text-sm mt-1">
                      {hasFilters ? 'Try clearing your filters' : 'Add your first work item to get started'}
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="border-b border-gray-50 table-row-hover transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-navy-900 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                          {item.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
                          {item.city && <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{item.city}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 font-mono">{item.phone}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={STATUS_STYLES[item.status] || 'badge-new'}>{item.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{formatDate(item.date)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{item.workType || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={PRIORITY_STYLES[item.priority] || 'priority-none'}>{item.priority || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy-700 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {items.length > 0 && (
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Card grid – Mobile */}
      <div className="md:hidden space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="font-medium">No work items found</div>
            <div className="text-sm mt-1">
              {hasFilters ? 'Try clearing your filters' : 'Add your first work item to get started'}
            </div>
          </div>
        ) : (
          items.map(item => (
            <CustomerCard
              key={item.id}
              item={item}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-t">
        <span className="text-sm text-gray-500">
          Total: {totalRows}
        </span>

        <div className="flex items-center gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-40 hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm font-semibold min-w-[60px] text-center">
            {page}
          </span>

          <button
            disabled={page * 10 >= totalRows}
            onClick={() => setPage(page + 1)}
            className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-40 hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>

        </div>
      </div>

      {/* Modals */}
      <WorkItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSave={onSave}
        editItem={editItem}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewItem(null);
        }}
        item={viewItem}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center text-gray-900">
              Delete Work Item?
            </h3>

            <p className="text-sm text-gray-500 text-center mt-2">
              Are you sure you want to delete this work item? This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteId(null);
                }}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
