import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { WORK_TYPES, STATUSES, PRIORITIES, today, generateId } from '../utils/constants';

const defaultForm = {
  name: '',
  phone: '',
  city: 'Thoothukudi',
  status: 'New',
  workType: '',
  comments: '',
  date: today(),
  priority: 'No Priority',
  dueDate: '',
  reminder: '',
  totalAmount: '',
  advance: '',
  balance: '',
};

export default function WorkItemModal({ open, onClose, onSave, editItem }) {
  const [form, setForm] = useState(defaultForm);
  const [workTypeSearch, setWorkTypeSearch] = useState('');
  const [showWorkTypes, setShowWorkTypes] = useState(false);

  useEffect(() => {
    if (editItem) {
      setForm({ ...defaultForm, ...editItem });
      setWorkTypeSearch(editItem.workType || '');
    } else {
      setForm(defaultForm);
      setWorkTypeSearch('');
    }
  }, [editItem, open]);

  if (!open) return null;

  const filteredWorkTypes = WORK_TYPES.filter(w =>
    w.toLowerCase().includes(workTypeSearch.toLowerCase())
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'totalAmount' || name === 'advance') {
        const total = parseFloat(name === 'totalAmount' ? value : prev.totalAmount) || 0;
        const adv = parseFloat(name === 'advance' ? value : prev.advance) || 0;
        updated.balance = Math.max(0, total - adv).toString();
      }
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert('Please fill in Customer Name and Phone Number.');
      return;
    }
    const item = {
      ...form,
      id: editItem?.id || generateId(),
      createdAt: editItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(item);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-semibold text-navy-900">
              {editItem ? 'Edit Work Item' : 'Add Work Item'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">Fill in the details for the service job</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Customer & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Customer Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Raja Kumar"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Mobile Number *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* City & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Work Type (searchable) */}
          <div className="relative">
            <label className="label">Work Type</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                value={workTypeSearch}
                onChange={e => { setWorkTypeSearch(e.target.value); setShowWorkTypes(true); }}
                onFocus={() => setShowWorkTypes(true)}
                placeholder="Search or select work type..."
                className="input-field pl-10"
                autoComplete="off"
              />
            </div>
            {showWorkTypes && filteredWorkTypes.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-card-hover z-50 max-h-48 overflow-y-auto">
                {filteredWorkTypes.map(w => (
                  <button
                    key={w}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    onClick={() => {
                      setForm(prev => ({ ...prev, workType: w }));
                      setWorkTypeSearch(w);
                      setShowWorkTypes(false);
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date & Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Reminder Note</label>
              <input
                name="reminder"
                value={form.reminder}
                onChange={handleChange}
                placeholder="e.g. Call before visit"
                className="input-field"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="label">Comments</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              placeholder="Add any notes or details about the job..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Amount section */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Financial Details
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Total Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="totalAmount"
                    value={form.totalAmount}
                    onChange={handleChange}
                    placeholder="0"
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="label">Advance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="advance"
                    value={form.advance}
                    onChange={handleChange}
                    placeholder="0"
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="label">Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="balance"
                    value={form.balance}
                    readOnly
                    className="input-field pl-7 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editItem ? 'Save Changes' : 'Add Work Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
