import { createContext, useContext, useState, type ReactNode } from "react";
import {
  initialBank,
  initialAssessments,
  type Question,
  type Assessment,
} from "./academic";
export type Classroom = {
  id: string;
  name: string;
  section: string;
  period: string;
  shift: string;
  group: string;
  students: string[];
  studentGroups?: Record<string, string>;
  color: string;
};
export type Review = {
  text: string;
  formula: string;
  status: number;
  loaded: boolean;
};
type DemoState = {
  bank: Question[];
  setBank: React.Dispatch<React.SetStateAction<Question[]>>;
  assessments: Assessment[];
  setAssessments: React.Dispatch<React.SetStateAction<Assessment[]>>;
  concentration: boolean;
  setConcentration: React.Dispatch<React.SetStateAction<boolean>>;
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  review: Review;
  setReview: React.Dispatch<React.SetStateAction<Review>>;
  dark: boolean;
  toggleTheme: () => void;
};
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [bank, setBank] = useState(initialBank);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [concentration, setConcentration] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "calculo",
      name: "Cálculo diferencial",
      section: "A",
      period: "2026-II",
      shift: "Mañana",
      group: "Grupo 1",
      students: [
        "Estudiante demo 01",
        "Estudiante demo 02",
        "Estudiante demo 03",
      ],
      color: "blue",
    },
    {
      id: "algebra",
      name: "Álgebra lineal",
      section: "B",
      period: "2026-II",
      shift: "Tarde",
      group: "",
      students: [],
      color: "green",
    },
    {
      id: "matematica",
      name: "Matemática básica",
      section: "C",
      period: "2026-II",
      shift: "Mañana",
      group: "",
      students: [],
      color: "sand",
    },
  ]);
  const [review, setReview] = useState<Review>({
    text: "Determina la derivada de la siguiente función y explica el procedimiento.",
    formula: "f(x) = x^3 - 3x + 2",
    status: 0,
    loaded: false,
  });
  const [dark, setDark] = useState(false);
  function toggleTheme() {
    setDark((value) => !value);
  }
  return (
    <Context.Provider
      value={{
        bank,
        setBank,
        assessments,
        setAssessments,
        concentration,
        setConcentration,
        classrooms,
        setClassrooms,
        review,
        setReview,
        dark,
        toggleTheme,
      }}
    >
      <div data-theme={dark ? "dark" : "light"} className="theme-root">
        {children}
      </div>
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("Falta el contexto de demostración");
  return value;
}
