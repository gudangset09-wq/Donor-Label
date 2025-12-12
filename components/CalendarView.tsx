import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Printer, Clock, User, FileText } from 'lucide-react';
import { DonorData } from '../types';

interface CalendarViewProps {
  data: DonorData[];
  onClose: () => void;
  onRestore: (data: DonorData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ data, onClose, onRestore }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Group data by date string (YYYY-MM-DD)
  const dataByDate = useMemo(() => {
    const map: Record<string, DonorData[]> = {};
    data.forEach(item => {
      const dateKey = new Date(item.timestamp).toDateString();
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(item);
    });
    return map;
  }, [data]);

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50 border-b border-r border-slate-100"></div>);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateKey = date.toDateString();
      const items = dataByDate[dateKey] || [];
      const isSelected = selectedDate.toDateString() === dateKey;
      const isToday = new Date().toDateString() === dateKey;

      days.push(
        <div 
          key={i} 
          onClick={() => setSelectedDate(date)}
          className={`h-24 border-b border-r p-2 cursor-pointer transition-colors relative flex flex-col justify-between group
            ${isSelected ? 'bg-teal-50 ring-inset ring-2 ring-teal-500 z-10' : 'bg-white border-slate-200 hover:bg-slate-50'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-teal-600 text-white' : 'text-slate-700'}`}>
              {i}
            </span>
          </div>
          
          {items.length > 0 && (
            <div className="mt-1">
               <div className="flex items-center gap-1 text-[10px] text-teal-700 font-bold bg-teal-100 px-1.5 py-0.5 rounded-md w-fit mb-1 shadow-sm">
                  {items.length} Pasien
               </div>
               <div className="flex gap-0.5 overflow-hidden px-0.5">
                  {items.slice(0, 6).map((item, idx) => (
                      <div 
                        key={idx} 
                        title={item.prioritas}
                        className={`w-1.5 h-1.5 rounded-full ${item.prioritas === 'Cito' ? 'bg-red-500' : 'bg-blue-400'}`}
                      ></div>
                  ))}
               </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDayItems = dataByDate[selectedDate.toDateString()] || [];

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Left: Calendar Grid */}
        <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-xl">
                      <CalendarIcon className="w-6 h-6 text-teal-700" />
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-slate-800">Kalender Aktivitas</h2>
                      <p className="text-sm text-slate-500">Pantau jadwal dan riwayat donor</p>
                  </div>
              </div>
              
              <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                  <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="w-40 text-center font-bold text-slate-700 select-none">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                  <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"><ChevronRight className="w-5 h-5" /></button>
              </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
              <div className="grid grid-cols-7 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
                  {dayNames.map(d => (
                      <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-3">{d}</div>
                  ))}
              </div>
              <div className="grid grid-cols-7 border-l border-t border-slate-200">
                  {renderCalendarDays()}
              </div>
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="w-full md:w-[400px] bg-slate-50 flex flex-col h-1/2 md:h-full z-30">
            <div className="p-5 border-b border-slate-200 flex justify-between items-start bg-white shadow-sm">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedDayItems.length} Permintaan Terdaftar</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedDayItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <CalendarIcon className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-sm font-medium">Tidak ada aktivitas</p>
                        <p className="text-xs">Pilih tanggal lain yang memiliki tanda titik.</p>
                    </div>
                ) : (
                    selectedDayItems.map((item) => (
                        <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-teal-400 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                   <div className="bg-slate-100 p-1.5 rounded-full">
                                      <User className="w-4 h-4 text-slate-600" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-slate-800 text-sm">{item.nama}</h4>
                                       <p className="text-xs text-slate-500 font-mono tracking-tight">{item.rekamMedis}</p>
                                   </div>
                                </div>
                                {item.prioritas === 'Cito' && (
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">CITO</span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <FileText className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-600 font-medium truncate">{item.jenisPermintaan}</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                   <Clock className="w-3 h-3" />
                                   {new Date(item.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                <button 
                                  onClick={() => {
                                      onRestore(item);
                                      onClose();
                                  }}
                                  className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm"
                                >
                                    <Printer className="w-3 h-3" />
                                    Cetak
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};