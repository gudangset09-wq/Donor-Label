import React, { useState, useEffect } from 'react';
import { Printer, History, Droplet, FileText, Sticker, X, BarChart3, ZoomIn, ZoomOut, RefreshCw, FileDown, Calendar as CalendarIcon, Search } from 'lucide-react';
import { DonorData } from './types';
import { InputForm } from './components/InputForm';
import { BarcodeLabel } from './components/BarcodeLabel';
import { RequestForm } from './components/RequestForm';
import { MonthlyReport } from './components/MonthlyReport';
import { CalendarView } from './components/CalendarView';
import { PrintSettingsModal } from './components/PrintSettingsModal';

type PrintMode = 'label' | 'form';

const App: React.FC = () => {
  // Persistence: Load from localStorage on init
  const [history, setHistory] = useState<DonorData[]>(() => {
    try {
        const saved = localStorage.getItem('donorHistory');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
  });

  const [currentEntry, setCurrentEntry] = useState<Partial<DonorData>>({
    jenisPermintaan: '',
    ruangan: '',
    volume: '',
    dokter: '',
    diagnosa: '',
    golonganDarah: '',
    rhesus: '',
    prioritas: 'Biasa'
  });
  
  // Feature toggles
  const [showHistory, setShowHistory] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [autoPrint, setAutoPrint] = useState(false);
  const [printMode, setPrintMode] = useState<PrintMode>('label');
  
  // UI State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPrintSettings, setShowPrintSettings] = useState(false);
  const [printCopies, setPrintCopies] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 'print' | 'pdf' determines the modal UI and instructions
  const [printIntent, setPrintIntent] = useState<'print' | 'pdf'>('print');

  // State to hold data specifically for the print window. 
  // If null, it prints the current preview. If set, it prints that specific data.
  const [printOverride, setPrintOverride] = useState<DonorData | null>(null);

  // Persistence: Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('donorHistory', JSON.stringify(history));
  }, [history]);

  // Generate a temporary preview object based on current input
  const previewData: DonorData = {
    id: 'preview',
    nama: currentEntry.nama || '',
    rekamMedis: currentEntry.rekamMedis || '',
    jenisPermintaan: currentEntry.jenisPermintaan || '',
    ruangan: currentEntry.ruangan || '',
    volume: currentEntry.volume || '',
    dokter: currentEntry.dokter || '',
    diagnosa: currentEntry.diagnosa || '',
    golonganDarah: currentEntry.golonganDarah || '',
    rhesus: currentEntry.rhesus || '',
    prioritas: currentEntry.prioritas || 'Biasa',
    timestamp: Date.now(),
  };

  const handleUpdate = (data: Partial<DonorData>) => {
    setCurrentEntry(prev => ({ ...prev, ...data }));
  };

  // Triggered when user clicks the main "Cetak" or "PDF" button
  const initiatePrintProcess = (dataToPrint?: DonorData, intent: 'print' | 'pdf' = 'print') => {
    if (dataToPrint) {
      setPrintOverride(dataToPrint);
    } else {
      setPrintOverride(null);
    }
    setPrintIntent(intent);
    setShowPrintSettings(true);
  };

  // Triggered from the Settings Modal
  const executePrint = (copies: number) => {
    setPrintCopies(copies);
    // Wait for state update and DOM render of the print area
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      if (direction === 'in') return Math.min(prev + 0.1, 2.0);
      return Math.max(prev - 0.1, 0.5);
    });
  };

  const handleResetZoom = () => setZoomLevel(1);

  const handleAdd = () => {
    if (!currentEntry.nama || !currentEntry.rekamMedis) return;

    const newEntry: DonorData = {
      id: crypto.randomUUID(),
      nama: currentEntry.nama,
      rekamMedis: currentEntry.rekamMedis,
      jenisPermintaan: currentEntry.jenisPermintaan || '-',
      ruangan: currentEntry.ruangan || '-',
      volume: currentEntry.volume || '-',
      dokter: currentEntry.dokter || '-',
      diagnosa: currentEntry.diagnosa || '-',
      golonganDarah: currentEntry.golonganDarah || '-',
      rhesus: currentEntry.rhesus || '-',
      prioritas: currentEntry.prioritas || 'Biasa',
      timestamp: Date.now(),
    };

    setHistory(prev => [newEntry, ...prev]);
    
    // Auto Print Logic: bypass settings modal for speed
    if (autoPrint) {
      setPrintOverride(newEntry);
      setPrintCopies(1); // Default to 1 for auto print
      setTimeout(() => window.print(), 100);
    }

    setCurrentEntry(prev => ({ 
        ...prev, 
        rekamMedis: '',
        nama: '' 
    })); 
  };

  const handleClear = () => {
    setCurrentEntry({
      nama: '',
      rekamMedis: '',
      jenisPermintaan: '',
      ruangan: '',
      volume: '',
      dokter: '',
      diagnosa: '',
      golonganDarah: '',
      rhesus: '',
      prioritas: 'Biasa'
    });
  };

  const handleRestore = (data: DonorData) => {
    setCurrentEntry({
        nama: data.nama,
        rekamMedis: data.rekamMedis,
        jenisPermintaan: data.jenisPermintaan,
        ruangan: data.ruangan,
        volume: data.volume,
        dokter: data.dokter,
        diagnosa: data.diagnosa,
        golonganDarah: data.golonganDarah,
        rhesus: data.rhesus,
        prioritas: data.prioritas
    });
    setShowHistory(false);
    // Optional: Switch to preview mode to see it immediately
  };

  // Filter history based on search query
  const filteredHistory = history.filter(item => {
    const search = searchQuery.toLowerCase();
    return (
        item.nama.toLowerCase().includes(search) || 
        item.rekamMedis.includes(search)
    );
  });

  // Calculate Base Scale for Preview
  const baseScale = printMode === 'label' ? 1.2 : 0.45;
  const currentScale = baseScale * zoomLevel;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navigation Bar - Hidden on Print */}
      <nav className="bg-teal-700 text-white shadow-md print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-full">
                <Droplet className="h-6 w-6 text-teal-700" fill="currentColor" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">DonorLabel Pro</h1>
            </div>

            {/* Print Mode Toggle */}
            <div className="hidden md:flex bg-teal-800 p-1 rounded-lg">
                <button
                    onClick={() => setPrintMode('label')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                        printMode === 'label' ? 'bg-white text-teal-800 shadow-sm' : 'text-teal-200 hover:text-white'
                    }`}
                >
                    <Sticker className="w-4 h-4" />
                    Mode Stiker
                </button>
                <button
                    onClick={() => setPrintMode('form')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                        printMode === 'form' ? 'bg-white text-teal-800 shadow-sm' : 'text-teal-200 hover:text-white'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    Mode Formulir
                </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCalendar(true)}
                className="p-2 rounded-full hover:bg-teal-600 transition-colors relative"
                title="Kalender"
              >
                <CalendarIcon className="w-6 h-6" />
              </button>

              <button 
                onClick={() => setShowReport(true)}
                className="p-2 rounded-full hover:bg-teal-600 transition-colors relative"
                title="Laporan Bulanan"
              >
                <BarChart3 className="w-6 h-6" />
              </button>

              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-full hover:bg-teal-600 transition-colors relative ${showHistory ? 'bg-teal-800 shadow-inner' : ''}`}
                title="Riwayat & Pencarian"
              >
                <History className="w-6 h-6" />
                {history.length > 0 && !showHistory && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full border border-teal-700"></span>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Print Mode Toggle */}
          <div className="md:hidden pb-3 pt-1 flex justify-center">
             <div className="bg-teal-800 p-1 rounded-lg flex">
                <button
                    onClick={() => setPrintMode('label')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${
                        printMode === 'label' ? 'bg-white text-teal-800 shadow-sm' : 'text-teal-200 hover:text-white'
                    }`}
                >
                    <Sticker className="w-3 h-3" />
                    Stiker
                </button>
                <button
                    onClick={() => setPrintMode('form')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${
                        printMode === 'form' ? 'bg-white text-teal-800 shadow-sm' : 'text-teal-200 hover:text-white'
                    }`}
                >
                    <FileText className="w-3 h-3" />
                    Formulir
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Hidden on Print */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden h-[calc(100vh-80px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 h-full overflow-hidden flex flex-col">
            <InputForm 
              currentData={currentEntry} 
              onUpdate={handleUpdate} 
              onAdd={handleAdd} 
              onClear={handleClear}
              autoPrint={autoPrint}
              onToggleAutoPrint={() => setAutoPrint(!autoPrint)}
            />
          </div>

          {/* Right Column: Preview & Action */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full overflow-y-auto pb-20">
            
            {/* Live Preview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        Live Preview
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded hidden sm:inline-block">
                        {printMode === 'label' ? '350x200px' : 'A4'}
                    </span>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1">
                    <button 
                        onClick={() => handleZoom('out')} 
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono w-12 text-center select-none">
                        {Math.round(zoomLevel * 100)}%
                    </span>
                    <button 
                        onClick={() => handleZoom('in')} 
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button 
                        onClick={handleResetZoom}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Reset Zoom"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                </div>
              </div>
              
              <div className="p-8 flex justify-center items-start bg-slate-50 border-b border-slate-200 min-h-[400px] overflow-auto">
                {/* Zoom Wrapper */}
                <div 
                    className="shadow-2xl transition-transform duration-200 ease-out origin-top border border-slate-100 bg-white"
                    style={{ 
                        transform: `scale(${currentScale})`,
                        marginBottom: printMode === 'form' ? `${297 * 0.5 * zoomLevel}mm` : '0px' // Compensate for space when zoomed
                    }}
                >
                   {printMode === 'label' ? (
                       <BarcodeLabel data={previewData} scale={1} />
                   ) : (
                       <RequestForm data={previewData} scale={1} /> 
                   )}
                </div>
              </div>

              <div className="p-6 bg-white flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
                 <button 
                   onClick={() => initiatePrintProcess(undefined, 'pdf')}
                   className="inline-flex items-center justify-center px-4 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all sm:w-auto w-full"
                 >
                   <FileDown className="w-5 h-5 mr-2" />
                   Simpan PDF
                 </button>
                 <button 
                   onClick={() => initiatePrintProcess(undefined, 'print')}
                   className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all sm:w-auto w-full"
                 >
                   <Printer className="w-5 h-5 mr-2" />
                   {printMode === 'label' ? 'Cetak Label' : 'Cetak Formulir'}
                 </button>
              </div>
            </div>
            
            {/* Instruction Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex justify-between items-center">
                <div>
                    <p className="font-semibold mb-1">Info:</p>
                    <p>Gunakan tombol di pojok kanan atas (Mode Stiker / Formulir) untuk mengubah jenis dokumen.</p>
                </div>
                <div className="text-right text-xs opacity-75">
                   <p>Zoom: {zoomLevel.toFixed(1)}x</p>
                </div>
             </div>

            {/* Recent History Sidebar with Search */}
            {showHistory && (
               <div className="bg-white rounded-xl shadow-lg border border-slate-200 fixed right-0 top-16 bottom-0 w-80 z-40 overflow-hidden transform transition-transform duration-300 flex flex-col">
                  {/* Header & Search */}
                  <div className="p-4 border-b border-slate-100 bg-white z-10 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <History className="w-4 h-4" /> Riwayat
                        </h3>
                        <button onClick={() => setShowHistory(false)}><X className="w-5 h-5 text-slate-500" /></button>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Cari Nama atau RM..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                          />
                      </div>
                  </div>

                  {/* List */}
                  <div className="p-2 space-y-2 overflow-y-auto flex-1 bg-slate-50">
                      {history.length === 0 ? (
                          <p className="text-center text-slate-400 py-8 text-sm">Belum ada riwayat.</p>
                      ) : filteredHistory.length === 0 ? (
                          <p className="text-center text-slate-400 py-8 text-sm">Data tidak ditemukan.</p>
                      ) : (
                          filteredHistory.map((item) => (
                              <div key={item.id} className="group relative p-3 bg-white rounded border border-slate-200 hover:border-teal-400 hover:shadow-sm transition-all">
                                  <div className="cursor-pointer" onClick={() => handleRestore(item)}>
                                    <div className="font-bold text-sm text-slate-800 pr-8">{item.nama}</div>
                                    <div className="text-xs text-slate-500 font-mono mb-1">{item.rekamMedis}</div>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.jenisPermintaan}</span>
                                      <span className="text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Quick Print Button in History */}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      initiatePrintProcess(item, 'print');
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 hover:text-teal-600 hover:border-teal-300 shadow-sm transition-colors"
                                    title="Cetak Ulang"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
               </div>
            )}

          </div>
        </div>
      </main>

      {/* Modals */}
      {showReport && (
        <MonthlyReport data={history} onClose={() => setShowReport(false)} />
      )}

      {showCalendar && (
        <CalendarView 
            data={history} 
            onClose={() => setShowCalendar(false)} 
            onRestore={handleRestore}
        />
      )}

      <PrintSettingsModal 
        isOpen={showPrintSettings}
        onClose={() => setShowPrintSettings(false)}
        onPrint={executePrint}
        mode={printMode}
        intent={printIntent}
      />

      {/* PRINT AREA - Visible ONLY when printing */}
      <div className="hidden print:flex print:flex-col print:items-center print:justify-start print:w-full print:min-h-screen bg-white absolute top-0 left-0 z-[9999]">
        
        {/* If report is open, allow it to handle print content (it covers screen) */}
        {showReport ? (
             <div className="w-full h-full p-0 m-0">
                 <MonthlyReport data={history} onClose={() => {}} />
             </div>
        ) : (
            <div className="print-content w-full h-auto">
                {/* 
                    Render Multiple Copies Loop 
                    We iterate printCopies times to render the component.
                    We add page-break-after to split them onto pages (important for A4 forms).
                */}
                {Array.from({ length: printCopies }).map((_, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            pageBreakAfter: index < printCopies - 1 ? 'always' : 'auto',
                            // For labels, we usually want them centered on the sticker paper
                            // For forms, we want natural flow
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: printMode === 'label' ? '100%' : 'auto', 
                            paddingTop: printMode === 'form' ? '20px' : '0px',
                            width: '100%'
                        }}
                    >
                        {printMode === 'label' ? (
                            <BarcodeLabel data={printOverride || previewData} scale={1} />
                        ) : (
                            <RequestForm data={printOverride || previewData} scale={1} />
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default App;