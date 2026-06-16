import { useState, useMemo } from 'react';
import { Search, X, Wallet, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/constants';

function SummaryCard({ label, value, type, icon: Icon }) {
  const styles = {
    total: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'bg-slate-100 text-slate-600', val: 'text-slate-900', lbl: 'text-slate-500' },
    paid: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-600', val: 'text-green-900', lbl: 'text-green-600' },
    due: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100 text-red-600', val: 'text-red-900', lbl: 'text-red-600' },
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center justify-between`}>
      <div>
        <div className={`text-sm font-medium ${s.lbl} mb-1`}>{label}</div>
        <div className={`font-display text-3xl font-bold ${s.val}`}>{value}</div>
      </div>
      <div className={`w-11 h-11 rounded-xl ${s.icon} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export default function AmountPage({ amountSummary, filters, setFilters, page, setPage, totalRows }) {
  const {
    name,
    startDate,
    endDate
  } = filters;

  const overallService = amountSummary.reduce((s, c) => s + c.serviceAmount, 0);
  const overallPaid = amountSummary.reduce((s, c) => s + c.servicePaid, 0);
  const overallBalance = amountSummary.reduce((s, c) => s + c.serviceBalance, 0);

  const hasFilters = name || startDate || endDate;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="hidden lg:block mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy-900">Amount Summary</h1>
        <p className="text-gray-400 text-sm mt-0.5">Overall and per-customer financials.</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setPage(1);

                setFilters(prev => ({
                  ...prev,
                  name: e.target.value
                }));
              }}
              placeholder="Search customer name..."
              className="input-field pl-9 h-9 text-xs"
            />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setPage(1);

              setFilters(prev => ({
                ...prev,
                startDate: e.target.value
              }));
            }}
            className="input-field h-9 text-xs w-auto"
            title="Start Date"
          />

          <input
            type="date"
            value={endDate}

            onChange={(e) => {
              setPage(1);

              setFilters(prev => ({
                ...prev,
                endDate: e.target.value
              }));
            }} className="input-field h-9 text-xs w-auto"
            title="End Date"
          />
          {hasFilters && (
            <button
              onClick={() => {
                setFilters({
                  name: "",
                  startDate: "",
                  endDate: ""
                });

                setPage(1);
              }} className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryCard label="Service Amount" value={formatCurrency(overallService)} type="total" icon={Wallet} />
        <SummaryCard label="Service Paid" value={formatCurrency(overallPaid)} type="paid" icon={TrendingUp} />
        <SummaryCard label="Service Balance" value={formatCurrency(overallBalance)} type="due" icon={AlertCircle} />
      </div>

      {/* Per-customer table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <h3 className="font-display font-semibold text-gray-800">Per Customer</h3>
        </div>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Jobs</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service Amount</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Balance</th>
              </tr>
            </thead>
            <tbody>
              {amountSummary.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">                   
                     <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <div className="font-medium">No customers found</div>
                  </td>
                </tr>
              ) : (
                amountSummary.map(c => (
                  <tr key={c.name} className="border-b border-gray-50 table-row-hover transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-navy-900 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{c.name}</div>
                          <div className="text-xs text-gray-400">
                            {formatDate(c.latestDate)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {c.jobs} job{c.jobs !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy-100 text-navy-700 text-xs font-bold">{c.jobs}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(c.serviceAmount)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-green-700">{formatCurrency(c.servicePaid)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-sm font-bold ${c.serviceBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(c.serviceBalance)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {amountSummary.length > 0 && (
              <tfoot>
                <tr className="bg-navy-950 text-white">
                  <td className="px-5 py-4 font-semibold text-white/70 text-sm">
                    Total
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="text-white/60 text-sm">
                      {amountSummary.reduce((s, c) => s + c.jobs, 0)}
                    </span>
                  </td>

                  {/* <td className="px-5 py-4 text-center">
                    -
                  </td> */}

                  <td className="px-5 py-4 text-right font-display font-bold">
                    {formatCurrency(overallService)}
                  </td>

                  <td className="px-5 py-4 text-right font-display font-bold text-green-400">
                    {formatCurrency(overallPaid)}
                  </td>

                  <td className="px-5 py-4 text-right font-display font-bold text-amber-400">
                    {formatCurrency(overallBalance)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {amountSummary.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <div className="font-medium">No customers found</div>
            </div>
          ) : (
            amountSummary.map(c => (
              <div key={c.name} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-white font-display font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{c.name}</div>
                      <div className="text-xs text-gray-400">
                        {formatDate(c.latestDate)}
                      </div>
                      <div className="text-xs text-gray-400">{c.jobs} job{c.jobs !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className={`font-display font-bold text-lg ${c.serviceBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(c.serviceBalance)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <div className="text-xs text-gray-400 mb-0.5">Service</div>
                    <div className="text-sm font-bold text-gray-800">{formatCurrency(c.serviceAmount)}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2">
                    <div className="text-xs text-green-500 mb-0.5">Paid</div>
                    <div className="text-sm font-bold text-green-700">{formatCurrency(c.servicePaid)}</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-2">
                    <div className="text-xs text-red-400 mb-0.5">Balance</div>
                    <div className="text-sm font-bold text-red-600">{formatCurrency(c.serviceBalance)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center px-5 py-4 border-t">

          <div className="text-sm text-gray-500">
            Total Records: {totalRows}
          </div>

          <div className="flex gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {page}
            </span>

            <button
              disabled={page * 10 >= totalRows}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
