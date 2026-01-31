export type StudyParams = {
  topic: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  goals: string;
  weeks: number;
  hoursPerWeek: number;
};

export type UserPlan = 'free' | 'premium';

export const defaultStudyParams: StudyParams = {
  topic: '',
  level: 'principiante',
  goals: 'Mejorar comprensión y práctica',
  weeks: 4,
  hoursPerWeek: 4
};

export type SubjectKey =
  | 'matematicas'
  | 'historia'
  | 'programacion'
  | 'ingles'
  | 'fisica'
  | 'quimica'
  | 'biologia';

export const studyParamsBySubject: Record<SubjectKey, Omit<StudyParams, 'topic'>> = {
  matematicas: {
    level: 'intermedio',
    goals: 'Dominar conceptos clave y resolver ejercicios tipo examen',
    weeks: 6,
    hoursPerWeek: 6
  },
  historia: {
    level: 'principiante',
    goals: 'Comprender procesos históricos y practicar análisis de fuentes',
    weeks: 5,
    hoursPerWeek: 4
  },
  programacion: {
    level: 'intermedio',
    goals: 'Practicar fundamentos, proyectos pequeños y resolución de problemas',
    weeks: 6,
    hoursPerWeek: 5
  },
  ingles: {
    level: 'principiante',
    goals: 'Mejorar vocabulario, gramática y comprensión lectora',
    weeks: 8,
    hoursPerWeek: 4
  },
  fisica: {
    level: 'intermedio',
    goals: 'Dominar fórmulas y aplicar en ejercicios y problemas',
    weeks: 6,
    hoursPerWeek: 5
  },
  quimica: {
    level: 'intermedio',
    goals: 'Aprender conceptos base y practicar estequiometría',
    weeks: 6,
    hoursPerWeek: 5
  },
  biologia: {
    level: 'principiante',
    goals: 'Comprender procesos biológicos y practicar resúmenes',
    weeks: 5,
    hoursPerWeek: 4
  }
};

export function getStudyDefaultsForSubject(subject?: string) {
  if (!subject) return defaultStudyParams;
  const key = subject.toLowerCase().trim() as SubjectKey;
  const preset = studyParamsBySubject[key];
  if (!preset) return defaultStudyParams;

  return {
    topic: subject,
    ...preset
  };
}
