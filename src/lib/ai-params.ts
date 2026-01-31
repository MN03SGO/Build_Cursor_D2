export type StudyParams = {
  topic: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  goals: string;
  weeks: number;
  hoursPerWeek: number;
};

export const defaultStudyParams: StudyParams = {
  topic: '',
  level: 'principiante',
  goals: 'Mejorar comprensión y práctica',
  weeks: 4,
  hoursPerWeek: 4
};
