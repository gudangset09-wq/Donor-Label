import React from 'react';
import { User, FileText, Activity, Layout, Plus, Trash2, Droplet, Printer, Stethoscope, FileHeart, AlertCircle } from 'lucide-react';
import { DonorData } from '../types';

interface InputFormProps {
  onUpdate: (data: Partial<DonorData>) => void;
  onAdd: () => void;
  onClear: () => void;
  currentData: Partial<DonorData>;
  autoPrint: boolean;
  onToggleAutoPrint: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ 
  onUpdate, 
  onAdd, 
  onClear, 
  currentData,
  autoPrint,
  onToggleAutoPrint
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const isFormValid = currentData.nama && currentData.rekamMedis;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2">
        <Activity className="w-5 h-5 text-teal-600" />
        Input Data Permintaan
      </h2>
      
      <div className="space-y-6">
        
        {/* Section 1: Identitas Pasien */}
        <div className="space-y-3">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Identitas Pasien</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Nama */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nama Pasien</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        name="nama"
                        value={currentData.nama || ''}
                        onChange={handleChange}
                        placeholder="Nama lengkap pasien"
                        className="pl-9 block w-full rounded-md border-slate-300 border p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Rekam Medis */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">No. RM (MRN)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        name="rekamMedis"
                        value={currentData.rekamMedis || ''}
                        onChange={handleChange}
                        placeholder="123456"
                        className="pl-9 block w-full rounded-md border-slate-300 border p-2 text-sm font-mono focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Ruangan */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Ruangan</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Layout className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        name="ruangan"
                        value={currentData.ruangan || ''}
                        onChange={handleChange}
                        placeholder="ICU / Mawar"
                        className="pl-9 block w-full rounded-md border-slate-300 border p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>
             </div>
        </div>

        {/* Section 2: Data Klinis */}
        <div className="space-y-3 pt-2 border-t border-dashed border-slate-200">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data Klinis</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {/* Dokter */}
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Dokter Pengirim</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Stethoscope className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        name="dokter"
                        value={currentData.dokter || ''}
                        onChange={handleChange}
                        placeholder="dr. Pengirim, Sp.PD"
                        className="pl-9 block w-full rounded-md border-slate-300 border p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                 </div>

                 {/* Diagnosa */}
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosa Klinis</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileHeart className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        name="diagnosa"
                        value={currentData.diagnosa || ''}
                        onChange={handleChange}
                        placeholder="Anemia Gravis, dll"
                        className="pl-9 block w-full rounded-md border-slate-300 border p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                 </div>

                 {/* Golongan Darah */}
                 <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Golongan Darah</label>
                    <select
                        name="golonganDarah"
                        value={currentData.golonganDarah || ''}
                        onChange={handleChange}
                        className="block w-full rounded-md border-slate-300 border p-2 text-sm bg-white"
                    >
                        <option value="">- Pilih -</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                    </select>
                 </div>

                 {/* Rhesus */}
                 <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Rhesus</label>
                    <select
                        name="rhesus"
                        value={currentData.rhesus || ''}
                        onChange={handleChange}
                        className="block w-full rounded-md border-slate-300 border p-2 text-sm bg-white"
                    >
                        <option value="">- Pilih -</option>
                        <option value="Positif (+)">Positif (+)</option>
                        <option value="Negatif (-)">Negatif (-)</option>
                    </select>
                 </div>
             </div>
        </div>

        {/* Section 3: Detail Permintaan */}
        <div className="space-y-3 pt-2 border-t border-dashed border-slate-200">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detail Permintaan</h3>
             
             {/* Prioritas */}
             <div className="flex gap-4 mb-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                       type="radio" 
                       name="prioritas" 
                       value="Biasa" 
                       checked={currentData.prioritas !== 'Cito'}
                       onChange={handleChange}
                       className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Biasa</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                       type="radio" 
                       name="prioritas" 
                       value="Cito" 
                       checked={currentData.prioritas === 'Cito'}
                       onChange={handleChange}
                       className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-bold text-red-600">Cito / Urgent</span>
                 </label>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Jenis Permintaan */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Komponen Darah</label>
                    <select
                        name="jenisPermintaan"
                        value={currentData.jenisPermintaan || ''}
                        onChange={handleChange}
                        className="block w-full rounded-md border-slate-300 border p-2 text-sm bg-white"
                    >
                        <option value="">Pilih Komponen...</option>
                        <option value="Darah Lengkap (WB)">Darah Lengkap (WB)</option>
                        <option value="Packed Red Cell (PRC)">Packed Red Cell (PRC)</option>
                        <option value="Thrombocyte Concentrate (TC)">Thrombocyte Concentrate (TC)</option>
                        <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                        <option value="Cryoprecipitate">Cryoprecipitate</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>

                {/* Volume */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Jumlah Labu / Volume</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Droplet className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                        type="text"
                        name="volume"
                        value={currentData.volume || ''}
                        onChange={handleChange}
                        placeholder="Contoh: 2 Labu / 350 cc"
                        className="pl-9 block w-full rounded-md border-slate-300 border p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>
             </div>
        </div>

        {/* Auto Print Toggle */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
            <input 
                type="checkbox" 
                id="autoPrintToggle" 
                checked={autoPrint} 
                onChange={onToggleAutoPrint}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="autoPrintToggle" className="text-xs text-slate-600 select-none flex items-center gap-1 cursor-pointer">
                <Printer className="w-3 h-3" />
                Cetak otomatis setelah ditambah
            </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
            <button
                onClick={onClear}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                <Trash2 className="w-4 h-4" />
                Reset
            </button>
            <button
                onClick={onAdd}
                disabled={!isFormValid}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isFormValid 
                    ? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500' 
                    : 'bg-slate-300 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
                <Plus className="w-4 h-4" />
                Tambah
            </button>
        </div>
      </div>
    </div>
  );
};