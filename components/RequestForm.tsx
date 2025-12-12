import React from 'react';
import { DonorData } from '../types';

interface RequestFormProps {
  data: DonorData;
  scale?: number;
}

export const RequestForm: React.FC<RequestFormProps> = ({ data, scale = 1 }) => {
  const safeName = data.nama || '................................';
  const safeMRN = data.rekamMedis || '000000';
  const safeDOB = new Date().toLocaleDateString('id-ID'); // Placeholder for DOB if not in data

  return (
    <div 
      className="bg-white text-black p-8 box-border font-serif relative"
      style={{
        width: '210mm', // A4 Width
        minHeight: '297mm', // A4 Height
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        margin: '0 auto'
      }}
    >
      {/* Header / Kop Surat */}
      <div className="border-b-4 border-double border-black pb-4 mb-6 flex items-center justify-between">
         {/* Logo placeholder if needed, currently centered text */}
         <div className="flex-1 text-center">
            <h1 className="text-lg font-bold uppercase tracking-wide leading-tight">
                Rumah Sakit Umum Pusat Nasional <br/> dr. Cipto Mangunkusumo
            </h1>
            <h2 className="text-sm font-bold uppercase mt-1 tracking-wider">Unit Pengelola Darah</h2>
            <div className="text-xs mt-1 leading-relaxed">
                <p>Jl. Pangeran Diponegoro No. 71, Kenari, Senen, Jakarta Pusat</p>
                <p>Telepon: 021-1500135</p>
            </div>
         </div>
      </div>

      <div className="text-center mb-6">
          <h3 className="text-lg font-bold underline decoration-2 underline-offset-4">FORMULIR PERMINTAAN DARAH</h3>
          <div className="flex justify-center items-center gap-4 mt-2">
             <div className="flex items-center gap-1">
                <div className={`w-4 h-4 border border-black ${data.prioritas !== 'Cito' ? 'bg-black' : ''}`}></div>
                <span className="text-sm">Biasa</span>
             </div>
             <div className="flex items-center gap-1">
                <div className={`w-4 h-4 border border-black ${data.prioritas === 'Cito' ? 'bg-black' : ''}`}></div>
                <span className="text-sm font-bold">Cito / Urgent</span>
             </div>
          </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Left Column: Patient Identity */}
          <div className="border border-black p-4">
              <h4 className="font-bold border-b border-black mb-2 pb-1">Identitas Pasien</h4>
              <table className="w-full text-sm">
                  <tbody>
                      <tr>
                          <td className="py-1 w-24 align-top">Nama</td>
                          <td className="py-1 w-2 align-top">:</td>
                          <td className="py-1 font-bold">{safeName}</td>
                      </tr>
                      <tr>
                          <td className="py-1 align-top">No. RM</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 font-mono font-bold text-lg">{safeMRN}</td>
                      </tr>
                      <tr>
                          <td className="py-1 align-top">Ruangan</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1">{data.ruangan || '-'}</td>
                      </tr>
                      <tr>
                          <td className="py-1 align-top">Diagnosa</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1">{data.diagnosa || '-'}</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          {/* Right Column: Blood Data */}
          <div className="border border-black p-4">
               <h4 className="font-bold border-b border-black mb-2 pb-1">Data Permintaan</h4>
               <table className="w-full text-sm">
                  <tbody>
                      <tr>
                          <td className="py-1 w-32 align-top">Dokter Pengirim</td>
                          <td className="py-1 w-2 align-top">:</td>
                          <td className="py-1 font-bold">{data.dokter || '-'}</td>
                      </tr>
                      <tr>
                          <td className="py-1 align-top">Jenis Komponen</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 font-bold">{data.jenisPermintaan || '-'}</td>
                      </tr>
                      <tr>
                          <td className="py-1 align-top">Volume / Jumlah</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1">{data.volume || '-'}</td>
                      </tr>
                      <tr>
                          <td className="py-1 align-top">Golongan Darah</td>
                          <td className="py-1 align-top">:</td>
                          <td className="py-1 font-bold text-lg">
                              {data.golonganDarah || '-'} 
                              <span className="text-sm ml-1 font-normal">
                                  ({data.rhesus || '?'})
                              </span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      {/* Aftap Details Table Area - UPDATED COLUMNS */}
      <div className="mb-6">
          <h4 className="font-bold text-sm mb-2">Diisi oleh Petugas:</h4>
          <table className="w-full border-collapse border border-black text-xs text-center">
              <thead>
                  <tr className="bg-gray-100">
                      <th className="border border-black p-2 w-1/4">Nomor Kantong</th>
                      <th className="border border-black p-2 w-1/4">Petugas Aftap</th>
                      <th className="border border-black p-2 w-1/4">Tanggal Pengambilan</th>
                      <th className="border border-black p-2 w-1/4">Paraf</th>
                  </tr>
              </thead>
              <tbody>
                  {[1, 2, 3, 4].map((i) => (
                      <tr key={i} className="h-10">
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Signature Section - UPDATED (Removed Doctor Title) */}
      <div className="flex justify-end mt-12 pr-12">
          <div className="text-center w-56">
              <p className="text-sm mb-20">Jakarta, {new Date(data.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
              
              <div className="border-b border-black mb-1"></div>
              <p className="text-xs text-gray-500 text-left pl-1">( Tanda Tangan & Nama Jelas )</p>
          </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 left-8 right-8 text-xs text-gray-500 border-t pt-2 flex justify-between">
          <span>Dicetak melalui DonorLabel Pro</span>
          <span>Lembar 1: Bank Darah | Lembar 2: Rekam Medis</span>
      </div>
    </div>
  );
};