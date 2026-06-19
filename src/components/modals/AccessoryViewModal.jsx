import { X, Package, Calendar, Tag } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/constants';

export default function AccessoryViewModal({
  open,
  onClose,
  item
}) {
  if (!open || !item) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) =>
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-lg">
            Product Details
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          <div>
            <div className="text-xs text-gray-400">
              Product Name
            </div>
            <div className="font-medium">
              {item.productName}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">
              Work Type
            </div>
            <div>
              {item.workType || '—'}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">
              Buy Date
            </div>
            <div>
              {formatDate(item.buyDate)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">
              Amount
            </div>
            <div className="font-semibold text-lg">
              {formatCurrency(item.amount)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}