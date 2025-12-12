import React, { useState, useMemo } from 'react';
import { DonorData } from '../types';
import { Printer, X, Calendar, PieChart, FileText } from 'lucide-react';

interface MonthlyReportProps {
  data: DonorData[];
  onClose: () => void;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ data, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Filter data based on selection
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const date = new Date(item.timestamp);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    }).sort((a, b) => a.timestamp - b.timestamp);
  }, [data, selectedMonth, selectedYear]);

  // Calculate Statistics
  const stats = useMemo(() => {
    const initial = {
      total: 0,
      cito: 0,
      biasa: 0,
      bloodType: {} as Record<string, number>,
      component: {} as Record<string, number>,
    };

    return filteredData.reduce((acc, curr) => {
      acc.total++;
      
      // Urgency
      if (curr.prioritas === 'Cito') acc.cito++;
      else acc.biasa++;

      // Blood Type
      const blood = curr.golonganDarah || 'N/A';
      acc.bloodType[blood] = (acc.bloodType[blood] || 0) + 1;

      // Component
      const comp = curr.jenisPermintaan || 'Lainnya';
      acc.component[comp] = (acc.component[comp] || 0) + 1;

      return acc;
    }, initial);
  }, [filteredData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header / Controls - Hidden on Print */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-teal-100 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-teal-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Bulanan</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border-slate-300 rounded-md text-sm py-2"
          >
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border-slate-300 rounded-md text-sm py-2"
          >
            {[...Array(5)].map((_, i) => {
               const y = new Date().getFullYear() - i;
               return <option key={y} value={y}>{y}</option>
            })}
          </select>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan
          </button>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-5xl mx-auto p-8 print:p-0 print:w-full">
        
        {/* Report Header */}
        <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Laporan Rekapitulasi Bank Darah</h1>
          <p className="text-slate-600 mt-1">Periode: {months[selectedMonth]} {selectedYear}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg print:border-black">
            <p className="text-sm text-slate-500 uppercase">Total Permintaan</p>
            <p className="text-3xl font-bold text-teal-700 print:text-black">{stats.total}</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg print:border-black">
            <p className="text-sm text-slate-500 uppercase">Cito / Urgent</p>
            <p className="text-3xl font-bold text-red-600 print:text-black">{stats.cito}</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg print:border-black">
            <p className="text-sm text-slate-500 uppercase">Biasa / Elektif</p>
            <p className="text-3xl font-bold text-slate-700 print:text-black">{stats.biasa}</p>
          </div>
           <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg print:border-black">
            <p className="text-sm text-slate-500 uppercase">Rata-rata / Hari</p>
            <p className="text-3xl font-bold text-blue-600 print:text-black">
                {(stats.total / 30).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Distribution Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Blood Type Distribution */}
            <div>
                <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Golongan Darah</h3>
                <div className="space-y-2">
                    {Object.entries(stats.bloodType).map(([type, count]) => (
                        <div key={type} className="flex items-center text-sm">
                            <span className="w-12 font-bold">{type}</span>
                            <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden print:border print:border-slate-300">
                                <div 
                                    className="h-full bg-teal-500 print:bg-slate-600" 
                                    style={{ width: `${stats.total > 0 ? (Number(count) / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="w-12 text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

             {/* Component Distribution */}
             <div>
                <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Komponen Darah</h3>
                <div className="space-y-2">
                    {Object.entries(stats.component).map(([comp, count]) => (
                        <div key={comp} className="flex items-center text-sm">
                            <span className="w-32 truncate pr-2">{comp}</span>
                            <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden print:border print:border-slate-300">
                                <div 
                                    className="h-full bg-blue-500 print:bg-slate-600" 
                                    style={{ width: `${stats.total > 0 ? (Number(count) / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="w-12 text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Detailed Table */}
        <div>
            <h3 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Rincian Data</h3>
            <table className="w-full text-xs text-left border-collapse">
                <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 print:bg-white print:border-black border-y-2">
                        <th className="py-2 px-1">Tgl</th>
                        <th className="py-2 px-1">No. RM</th>
                        <th className="py-2 px-1">Nama Pasien</th>
                        <th className="py-2 px-1">Gol.</th>
                        <th className="py-2 px-1">Komponen</th>
                        <th className="py-2 px-1">Vol</th>
                        <th className="py-2 px-1">Dokter</th>
                        <th className="py-2 px-1">Ket</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-4 text-slate-500">Tidak ada data untuk periode ini.</td></tr>
                    ) : (
                        filteredData.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 print:border-slate-300">
                                <td className="py-1 px-1">{new Date(item.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}</td>
                                <td className="py-1 px-1 font-mono">{item.rekamMedis}</td>
                                <td className="py-1 px-1 truncate max-w-[150px]">{item.nama}</td>
                                <td className="py-1 px-1 font-bold">{item.golonganDarah} ({item.rhesus === 'Positif (+)' ? '+' : '-'})</td>
                                <td className="py-1 px-1">{item.jenisPermintaan}</td>
                                <td className="py-1 px-1">{item.volume}</td>
                                <td className="py-1 px-1 truncate max-w-[100px]">{item.dokter}</td>
                                <td className="py-1 px-1">
                                    {item.prioritas === 'Cito' && <span className="font-bold">CITO</span>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-end print:mt-8">
            <div className="text-center w-48">
                <p className="text-xs mb-16">Dicetak oleh,</p>
                <div className="border-b border-black mb-1"></div>
                <p className="font-bold text-xs">Petugas Bank Darah</p>
            </div>
        </div>

      </div>
    </div>
  );
};