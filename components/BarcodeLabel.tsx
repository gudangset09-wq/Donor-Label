import React from 'react';
import { DonorData } from '../types';

interface BarcodeLabelProps {
  data: DonorData;
  scale?: number;
}

export const BarcodeLabel: React.FC<BarcodeLabelProps> = ({ data, scale = 1 }) => {
  // Safe defaults if data is missing during typing
  const safeName = data.nama || 'Nama Pasien';
  const safeMRN = data.rekamMedis || '000000';
  const safeRequest = data.jenisPermintaan || '-';
  const safeRoom = data.ruangan || '-';
  const safeVolume = data.volume || '-';

  return (
    <div 
      className="bg-white border-2 border-gray-800 flex flex-col items-center justify-between p-2 overflow-hidden box-border select-none"
      style={{
        width: '350px',
        height: '200px',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Header Info */}
      <div className="w-full flex justify-between items-end border-b border-gray-300 pb-1 mb-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Unit Pengelola Darah - RSCM
        </span>
        <span className="text-[10px] text-gray-400">
          {new Date(data.timestamp).toLocaleDateString('id-ID')}
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="w-full flex-grow flex flex-col justify-center items-center relative p-2">
        
        {/* Patient Details - Centered and larger since barcode is gone */}
        <div className="w-full text-left space-y-1">
          <div className="flex border-b border-gray-100 pb-1 mb-1">
            <span className="w-20 text-xs font-semibold text-gray-500">No. RM:</span>
            <span className="flex-1 text-lg font-mono font-bold text-gray-900">{safeMRN}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-xs font-semibold text-gray-500">Nama:</span>
            <span className="flex-1 text-sm font-bold text-gray-900 truncate">{safeName}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-xs font-semibold text-gray-500">Permintaan:</span>
            <span className="flex-1 text-xs font-medium text-gray-800 truncate">{safeRequest}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-xs font-semibold text-gray-500">Ruangan:</span>
            <span className="flex-1 text-xs font-medium text-gray-800 truncate">{safeRoom}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-xs font-semibold text-gray-500">Volume:</span>
            <span className="flex-1 text-xs font-medium text-gray-800 truncate">{safeVolume}</span>
          </div>
        </div>
      </div>
    </div>
  );
};