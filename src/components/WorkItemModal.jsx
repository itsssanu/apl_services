import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { WORK_TYPES, STATUSES, PRIORITIES, today } from '../utils/constants';

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
  serviceAmount: 0,
  servicePaid: 0,
  serviceBalance: 0,

  accessoriesAmount: 0,
  accessoriesPaid: 0,
  accessoriesBalance: 0,

  // Accessories
  accessories: [],
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

  const accessoriesTotal = form.accessories.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  const filteredWorkTypes = WORK_TYPES.filter(w =>
    w.toLowerCase().includes(workTypeSearch.toLowerCase())
  );

  function calculateAmounts(form) {

    const accessoriesAmount = form.accessories.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    const accessoriesPaid = parseFloat(form.accessoriesPaid) || 0;

    const serviceAmount = parseFloat(form.serviceAmount) || 0;

    const servicePaid = parseFloat(form.servicePaid) || 0;

    return {

      accessoriesAmount,

      accessoriesPaid,

      accessoriesBalance: Math.max(
        accessoriesAmount - accessoriesPaid,
        0
      ),

      serviceBalance: Math.max(
        serviceAmount - servicePaid,
        0
      )

    };
  }

  function handleChange(e) {

    const { name, value } = e.target;

    setForm(prev => {

      const updated = {

        ...prev,

        [name]: value

      };

      return {

        ...updated,

        ...calculateAmounts(updated)

      };

    });

  }

  function handleAccessoryChange(index, field, value) {

    setForm(prev => {

      const accessories = [...prev.accessories];

      accessories[index] = {

        ...accessories[index],

        [field]: value

      };

      const updated = {

        ...prev,

        accessories

      };

      return {

        ...updated,

        ...calculateAmounts(updated)

      };

    });

  }

  function addAccessory() {
    setForm(prev => ({
      ...prev,
      accessories: [
        ...prev.accessories,
        {
          name: '',
          amount: '',
        },
      ],
    }));
  }

  function removeAccessory(index) {

    setForm(prev => {

      const updated = {

        ...prev,

        accessories: prev.accessories.filter((_, i) => i !== index)

      };

      return {

        ...updated,

        ...calculateAmounts(updated)

      };

    });

  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please fill in Customer Name.');
      return;
    }
    console.log("Saving Item", form);
    const item = {
      ...form,
      id: editItem?.id,
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
              <label className="label">Mobile Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="input-field"
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

          {/* Accessories Details */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Accessories Details
              </div>

              <button
                type="button"
                onClick={addAccessory}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg"
              >
                + Add Product
              </button>
            </div>

            <div className="space-y-3">
              {form.accessories.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end"
                >
                  <div className="col-span-7">
                    <label className="label">
                      Product Name
                    </label>

                    <input
                      value={item.name}
                      onChange={(e) =>
                        handleAccessoryChange(
                          index,
                          'name',
                          e.target.value
                        )
                      }
                      placeholder="Product Name"
                      className="input-field"
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="label">
                      Amount
                    </label>

                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        handleAccessoryChange(
                          index,
                          'amount',
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className="input-field"
                    />
                  </div>

                  <div className="col-span-1">
                    {form.accessories.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeAccessory(index)
                        }
                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount section */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Financial Details
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Accessories
                </h3>

                <div> <label className="label">Accessories Total</label>
                  <div className="mb-4 p-3 bg-white rounded-xl border">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        ₹{accessoriesTotal}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label"> Accessories Paid</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      name="accessoriesPaid"
                      value={form.accessoriesPaid}
                      onChange={handleChange}
                      className="input-field  pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Accessories Balance</label>
                    <input
                      value={form.accessoriesBalance}
                      readOnly
                      className="input-field bg-gray-100"
                    />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Service
                </h3>
                <div>
                  <label className="label">Service Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      name="serviceAmount"
                      value={form.serviceAmount}
                      onChange={handleChange}
                      className="input-field  pl-7"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Service Paid</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      name="servicePaid"
                      value={form.servicePaid}
                      onChange={handleChange}
                      placeholder="0"
                      className="input-field pl-7"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Service Balance</label>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    value={form.serviceBalance}
                    readOnly
                    className="input-field bg-gray-100"
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
