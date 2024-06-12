import { Participante } from './Participante';

export interface Evento {
  id?: number;
  name: string;
  date: string;  
  description?: string;
  location?: string;
  participants: Participante[];
}
