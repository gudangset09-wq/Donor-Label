import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, User, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { DonorData } from '../types';

interface CalendarViewProps {
  data: DonorData[];
  onClose: () => void;
  onRestore: (data: DonorData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ data, onClose, onRestore }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper to get day of week for 1st of month (0 = Sunday)
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

  // Group data by date string (YYYY-MM-DD) for easy lookup
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
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50 border border-slate-100"></div>);
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
          className={`h-24 border p-2 cursor-pointer transition-colors relative flex flex-col justify-between
            ${isSelected ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 z-10' : 'bg-white border-slate-200 hover:bg-slate-50'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
              {i}
            </span>
          </div>
          
          {items.length > 0 && (
            <div className="mt-1">
               <div className="flex items-center gap-1 text-xs text-teal-700 font-medium bg-teal-100 px-1.5 py-0.5 rounded w-fit mb-1">
                  {items.length} Pasien
               </div>
               <div className="flex gap-0.5 overflow-hidden">
                  {items.slice(0, 5).map((_, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full ${items[idx].prioritas === 'Cito' ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                  ))}
               </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Get data for the selected day panel
  const selectedDayItems = dataByDate[selectedDate.toDateString()] || [];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
      
      {/* Left: Calendar Grid */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-20">
            <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-700" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Kalender Aktivitas</h2>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="w-32 text-center font-bold text-slate-700">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <button onClick={nextMonth} className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full md:hidden">
                    <X className="w-6 h-6 text-slate-500" />
                </button>
            </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4">
            <div className="grid grid-cols-7 mb-2">
                {dayNames.map(d => (
                    <div key={d} className="text-center text-sm font-bold text-slate-500 py-2">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-px border border-slate-200 bg-slate-200 shadow-sm rounded-lg overflow-hidden">
                {renderCalendarDays()}
            </div>
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className="w-full md:w-96 bg-white border-l border-slate-200 flex flex-col h-1/2 md:h-full shadow-xl z-30">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedDayItems.length} Permintaan Darah</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full hidden md:block">
                    <X className="w-5 h-5 text-slate-500" />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedDayItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Tidak ada aktivitas pada tanggal ini.</p>
                  </div>
              ) : (
                  selectedDayItems.map((item) => (
                      <div key={item.id} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-slate-800">{item.nama}</h4>
                              {item.prioritas === 'Cito' && (
                                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">CITO</span>
                              )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mb-2">{item.rekamMedis}</div>
                          <div className="flex justify-between items-center">
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{item.jenisPermintaan}</span>
                              <button 
                                onClick={() => {
                                    onRestore(item);
                                    onClose();
                                }}
                                className="text-teal-600 hover:text-teal-800 p-1.5 hover:bg-teal-50 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
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
  );
};
