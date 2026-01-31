export interface Materia {
  id: string;
  nombre: string;
  fechaExamen: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface TareaPlan {
  id: string;
  hora: string;
  materia: string;
  completada: boolean;
}

export const materiasMock: Materia[] = [
  { id: '1', nombre: 'Matemáticas', fechaExamen: '2025-02-15', prioridad: 'alta' },
  { id: '2', nombre: 'Historia', fechaExamen: '2025-02-20', prioridad: 'media' },
  { id: '3', nombre: 'Programación', fechaExamen: '2025-02-18', prioridad: 'alta' },
  { id: '4', nombre: 'Inglés', fechaExamen: '2025-02-25', prioridad: 'baja' },
];

export const planDiaMock: TareaPlan[] = [
  { id: 't1', hora: '09:00 - 10:30', materia: 'Matemáticas', completada: false },
  { id: 't2', hora: '11:00 - 12:00', materia: 'Historia', completada: false },
  { id: 't3', hora: '14:00 - 15:30', materia: 'Programación', completada: false },
  { id: 't4', hora: '16:00 - 17:00', materia: 'Inglés', completada: false },
];
