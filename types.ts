export interface DonorData {
  id: string;
  nama: string;
  rekamMedis: string; // Used for Barcode value
  jenisPermintaan: string;
  ruangan: string;
  volume: string;
  timestamp: number;
  // New fields for Request Form
  dokter: string;
  diagnosa: string;
  golonganDarah: string;
  rhesus: string;
  prioritas: 'Biasa' | 'Cito';
}

export interface LabelFormProps {
  onSubmit: (data: Omit<DonorData, 'id' | 'timestamp'>) => void;
  onClear: () => void;
  initialData?: Partial<DonorData>;
}