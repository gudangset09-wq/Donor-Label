import React, { useState } from 'react';
import { X, Printer, Copy, FileDown } from 'lucide-react';

interface PrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (copies: number) => void;
  mode: 'label' | 'form';
  intent?: 'print' | 'pdf';
}

export const PrintSettingsModal: React.FC<PrintSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onPrint,
  mode,
  intent = 'print'
}) => {
  const [copies, setCopies] = useState(1);

  if (!isOpen) return null;

  const handleAction = () => {
    onPrint(copies);
    onClose();
  };

  const isPdf = intent === 'pdf';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            {isPdf ? (
                <>
                    <FileDown className="w-5 h-5 text-red-600" />
                    Simpan sebagai PDF
                </>
            ) : (
                <>
                    <Printer className="w-5 h-5 text-teal-600" />
                    Pengaturan Cetak
                </>
            )}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Jumlah Salinan (Copies)</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden w-full max-w-[200px]">
                <button 
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border-r border-slate-300 text-slate-600 font-bold"
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max="50"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 w-full text-center py-2 focus:outline-none text-slate-800 font-bold"
                />
                <button 
                  onClick={() => setCopies(copies + 1)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border-l border-slate-300 text-slate-600 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-slate-500">
                {mode === 'label' ? 'Lembar Stiker' : 'Lembar Dokumen'}
              </span>
            </div>
          </div>

          <div className={`border rounded-lg p-4 flex items-start gap-3 ${isPdf ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
             {isPdf ? <FileDown className="w-5 h-5 text-red-600 mt-0.5" /> : <Copy className="w-5 h-5 text-blue-600 mt-0.5" />}
             <div className={`text-sm ${isPdf ? 'text-red-800' : 'text-blue-800'}`}>
                <p className="font-semibold mb-1">Panduan:</p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  {isPdf ? (
                      <li>Saat dialog muncul, ubah <b>Destination</b> menjadi <b>"Save as PDF"</b>.</li>
                  ) : (
                      <li>Pilih printer fisik Anda untuk mencetak.</li>
                  )}
                  {mode === 'label' && (
                    <li>Pastikan ukuran kertas printer diset ke Custom (350x200px).</li>
                  )}
                </ul>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors text-sm sm:text-base"
          >
            Batal
          </button>
          
          <button 
            onClick={handleAction}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm text-white ${isPdf ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {isPdf ? <FileDown className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
            {isPdf ? 'Lanjut ke PDF' : 'Cetak Sekarang'}
          </button>
        </div>

      </div>
    </div>
  );
};