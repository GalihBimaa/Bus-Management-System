import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

export interface SeatItem {
  id: string;
  number: string;
  deck: 'lower' | 'upper';
  row: number;
  col: number;
  status: 'available' | 'occupied';
  passengerName?: string;
  passengerGender?: 'Pria' | 'Wanita';
  isSoloTraveler?: boolean;
  ticketCode?: string;
  boardingPoint?: string;
  dropPoint?: string;
  boarded?: boolean;
  boardedAt?: string;
  baggageCodes?: string[];
}

export interface CheckpointItem {
  id: string;
  order: number;
  name: string;
  city: string;
  category: 'Terminal' | 'Agen' | 'Rumah Makan' | 'Pelabuhan' | 'Rest Area';
  scheduledTime: string;
  durationMinutes: number;
  status: 'completed' | 'current' | 'upcoming';
  notes: string;
  lat: number;
  lng: number;
  progressPercent: number;
}

const initialState = {
  company: 'PO NUSANTARA HIJAU TRANS',
  updatedAt: new Date().toISOString(),
  fleetSummary: {
    totalActiveBuses: 6,
    totalSchedulesToday: 4,
  },
};

app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Server API Sistem Manajemen Keberangkatan Bus Aktif',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', (_req: Request, res: Response) => {
  res.json(initialState);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
