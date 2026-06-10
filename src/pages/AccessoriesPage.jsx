import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Package, Search, X, Calendar, Tag, IndianRupee, Eye, Pencil, AlertTriangle } from 'lucide-react';
import { WORK_TYPES, formatDate, formatCurrency, generateId, today } from '../utils/constants';
import AccessoryViewModal from '../components/AccessoryViewModal';

/* ── Add Product Modal ───────────────────────────────────────────── */
function AddProductModal({ open, onClose, onSave, editItem }) {
  const [form, setForm] = useState({ workType: '', buyDate: today(), productName: '', amount: '' });

  useEffect(() => {
    if (editItem) {
      setForm(editItem);
    } else {
      setForm({
        workType: '',
        buyDate: today(),
        productName: '',
        amount: ''
      });
    }
  }, [editItem, open]);

  if (!open) return null;

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.productName.trim()) return;
    onSave({ ...form, id: editItem?.id || generateId() });
    setForm({ workType: '', buyDate: today(), productName: '', amount: '' });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-900">Add Product</h2>
            <p className="text-xs text-gray-400 mt-0.5">Track accessories bought for a job</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Work Type</label>
            <select name="workType" value={form.workType} onChange={handleChange} className="input-field">
              <option value="">Select Work Type</option>
              {WORK_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Buy Date</label>
            <input type="date" name="buyDate" value={form.buyDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Product Name *</label>
            <input
              name="productName" value={form.productName} onChange={handleChange}
              placeholder="e.g. PVC Pipe, Copper Wire..." className="input-field" required
            />
          </div>
          <div>
            <label className="label">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0" className="input-field pl-7" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ────────────────────────────────────────── */
function DeleteModal({ open, item, onConfirm, onCancel }) {
  if (!open || !item) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-sm animate-scale-in">
        {/* Icon header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="font-display text-lg font-semibold text-gray-900 text-center">Delete Product?</h2>
          <p className="text-sm text-gray-400 text-center mt-1.5 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-gray-700">"{item.productName}"</span>? This action cannot be undone.
          </p>
        </div>

        {/* Product info strip */}
        <div className="mx-6 mb-5 bg-gray-50 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{item.productName}</div>
              {item.workType && <div className="text-xs text-gray-400">{item.workType}</div>}
            </div>
          </div>
          {item.amount && (
            <span className="text-sm font-bold text-navy-800">{formatCurrency(item.amount)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Accessory Card (mobile) ─────────────────────────────────────── */
function AccessoryCard({ item, onView, onEdit, onDelete }) {
  return (
    <div className="card p-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-800 text-sm truncate">{item.productName}</div>
            {item.workType && (
              <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                {item.workType}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-1">

          <button
            onClick={() => onView(item)}
            className="p-1.5 rounded-lg hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(item.buyDate)}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-display font-bold text-navy-800 text-base">{formatCurrency(item.amount)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function AccessoriesPage({ accessories, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const [workTypeFilter, setWorkTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const filtered = useMemo(() => {
    return accessories.filter(a => {
      if (workTypeFilter && a.workType !== workTypeFilter) return false;
      if (startDate && a.buyDate < startDate) return false;
      if (endDate && a.buyDate > endDate) return false;
      if (nameFilter && !a.productName?.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      return true;
    });
  }, [accessories, workTypeFilter, startDate, endDate, nameFilter]);

  const filteredTotal = filtered.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);
  const hasFilters = workTypeFilter || startDate || endDate || nameFilter;

  function askDelete(item) {
    setDeleteModal({ open: true, item });
  }
  function confirmDelete() {
    onDelete(deleteModal.item.id);
    setDeleteModal({ open: false, item: null });
  }

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="hidden lg:block">
          <h1 className="font-display text-2xl font-semibold text-navy-900">Accessories</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track products bought per work type.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary ml-auto">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters + filtered total */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={workTypeFilter} onChange={e => setWorkTypeFilter(e.target.value)}
            className="input-field h-9 text-xs w-auto min-w-[150px]"
          >
            <option value="">All Work Types</option>
            {WORK_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
          </select>

          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field h-9 text-xs w-auto" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field h-9 text-xs w-auto" />

          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text" value={nameFilter} onChange={e => setNameFilter(e.target.value)}
              placeholder="Search product..." className="input-field pl-9 h-9 text-xs"
            />
          </div>

          {hasFilters && (
            <button
              onClick={() => { setWorkTypeFilter(''); setNameFilter(''); setStartDate(''); setEndDate(''); }}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}

          <div className="ml-auto bg-blue-50 rounded-xl px-4 py-2 text-center">
            <div className="text-xs text-blue-500 font-medium">Filtered Total</div>
            <div className="font-display font-bold text-blue-900 text-lg leading-tight">{formatCurrency(filteredTotal)}</div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Work Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product Name</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <div className="font-medium">No accessories found</div>
                    <div className="text-sm mt-1">{hasFilters ? 'Try clearing your filters' : 'Add your first product to get started'}</div>
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-50 table-row-hover transition-colors">
                    <td className="px-5 py-4"><span className="text-sm text-gray-600">{formatDate(item.buyDate)}</span></td>
                    <td className="px-5 py-4">
                      {item.workType
                        ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">{item.workType}</span>
                        : '—'}
                    </td>
                    <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-800">{item.productName}</span></td>
                    <td className="px-5 py-4 text-right"><span className="text-sm font-bold text-navy-800">{formatCurrency(item.amount)}</span></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">

                        <button
                          onClick={() => {
                            setViewItem(item);
                            setViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setEditItem(item);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => askDelete(item)}
                          className="p-1.5 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-100">
                  <td colSpan={3} className="px-5 py-3 text-xs text-gray-400">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-3 text-right"><span className="text-sm font-bold text-navy-900">{formatCurrency(filteredTotal)}</span></td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Mobile Card Grid */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="font-medium">No accessories found</div>
            <div className="text-sm mt-1">{hasFilters ? 'Try clearing your filters' : 'Add your first product to get started'}</div>
          </div>
        ) : (
          <>
            {filtered.map(item => (
              <AccessoryCard
                key={item.id}
                item={item}
                onView={(item) => {
                  setViewItem(item);
                  setViewModalOpen(true);
                }}
                onEdit={(item) => {
                  setEditItem(item);
                  setModalOpen(true);
                }}
                onDelete={askDelete}
              />
            ))}
            {/* Mobile total footer */}
            <div className="card px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
              <span className="font-display font-bold text-navy-900">{formatCurrency(filteredTotal)}</span>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSave={onSave}
        editItem={editItem}
      />
      <AccessoryViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewItem(null);
        }}
        item={viewItem}
      />
      <DeleteModal
        open={deleteModal.open}
        item={deleteModal.item}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, item: null })}
      />
    </div>
  );
}
