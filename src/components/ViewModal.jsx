import { X, Phone, MapPin, Calendar, Clock, AlertCircle, MessageSquare, DollarSign } from 'lucide-react';
import { STATUS_STYLES, PRIORITY_STYLES, formatDate, formatCurrency } from '../utils/constants';

export default function ViewModal({ open, onClose, item }) {
  if (!open || !item) return null;

  const statusClass = STATUS_STYLES[item.status] || 'badge-new';
  const priorityClass = PRIORITY_STYLES[item.priority] || 'priority-none';
  const accessoriesTotal =
    item.accessories?.reduce(
      (sum, accessory) =>
        sum + (parseFloat(accessory.amount) || 0),
      0
    ) || 0;
  console.log("item view", item);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white font-display font-bold text-lg shadow-sm">
              {item.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-900">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={statusClass}>{item.status}</span>
                <span className={priorityClass}>{item.priority}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem icon={Phone} label="Phone" value={item.phone} />
            <DetailItem icon={MapPin} label="City" value={item.city || '—'} />
            <DetailItem icon={Calendar} label="Date" value={formatDate(item.date)} />
            <DetailItem icon={Clock} label="Due Date" value={item.dueDate ? formatDate(item.dueDate) : '—'} />
            <DetailItem icon={AlertCircle} label="Work Type" value={item.workType || '—'} />
            {item.reminder && <DetailItem icon={MessageSquare} label="Reminder" value={item.reminder} />}
          </div>

          {/* Comments */}
          {item.comments && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Comments</div>
              <p className="text-sm text-gray-700 leading-relaxed">{item.comments}</p>
            </div>
          )}

          {item.accessories?.some(a => a.name || a.amount) && (
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
                Accessories Products
              </div>

              <div className="space-y-2">
                {item.accessories.map((accessory, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">
                      {accessory.name || 'Unnamed Product'}
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatCurrency(accessory.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Accessories Total
                </span>

                <span className="font-semibold text-blue-700">
                  {formatCurrency(accessoriesTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Financial summary */}
          {(
            item.serviceAmount ||
            item.servicePaid ||
            item.serviceBalance ||
            accessoriesTotal ||
            item.accessoriesPaid ||
            item.accessoriesBalance
          ) && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Accessories */}

                <div className="bg-blue-50 rounded-xl p-4">

                  <h3 className="font-semibold text-blue-700 mb-4">
                    Accessories Details
                  </h3>

                  <div className="space-y-3">

                    <InfoRow
                      label="Total Amount"
                      value={formatCurrency(accessoriesTotal)}
                    />

                    <InfoRow
                      label="Paid"
                      value={formatCurrency(item.accessoriesPaid)}
                    />

                    <InfoRow
                      label="Balance"
                      value={formatCurrency(item.accessoriesBalance)}
                      highlight
                    />

                  </div>

                </div>

                {/* Service */}

                <div className="bg-green-50 rounded-xl p-4">

                  <h3 className="font-semibold text-green-700 mb-4">
                    Service Details
                  </h3>

                  <div className="space-y-3">

                    <InfoRow
                      label="Service Amount"
                      value={formatCurrency(item.serviceAmount)}
                    />

                    <InfoRow
                      label="Paid"
                      value={formatCurrency(item.servicePaid)}
                    />

                    <InfoRow
                      label="Balance"
                      value={formatCurrency(item.serviceBalance)}
                      highlight
                    />

                  </div>

                </div>

              </div>

            )}
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <button onClick={onClose} className="btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight = false }) {

  return (

    <div className="flex justify-between items-center bg-white rounded-lg px-3 py-3">

      <span className="text-sm text-gray-600">
        {label}
      </span>

      <span
        className={`font-semibold ${
          highlight
            ? "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </span>

    </div>

  );

}