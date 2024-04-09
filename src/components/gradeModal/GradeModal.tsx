import React, { useState } from "react";
import "./GradeModal.css";
import axios from "axios";

interface Component {
  id: number;
  name: string;
  points: number | null;
  weight: number | null;
  sectionId: number | null;
  date: string;
  time: string;
  submitted?: boolean;
}

interface Grades {
  component_id: number;
  points: number;
  ucid: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  component: Component | null;
  ucid: number | null;
  setGrades: React.Dispatch<React.SetStateAction<Grades[]>>;
  grades: Grades[];
}

const GradeModal = ({
  isOpen,
  onClose,
  component,
  ucid,
  setGrades,
  grades,
}: Props) => {
  const [grade, setGrade] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(Number(e.target.value));
  };

  const handleSubmit = async () => {
    if (grade !== null && !isNaN(grade)) {
      const res = await axios.post("/api/grades", {
        ucid,
        id: component?.id,
        grade,
      });

      if (res.data.success) {
        setGrades((prevGrades) => [
          ...prevGrades,
          {
            component_id: component?.id || 0,
            points: grade,
            ucid: ucid || 0,
          },
        ]);

        onClose();
      } else {
        const res1 = await axios.put("/api/grades", {
          ucid,
          id: component?.id,
          grade,
        });

        if (res1.data.success) {
          setGrades((prevGrades) => {
            const updatedGrades = prevGrades.map((g) => {
              if (g.component_id === component?.id) {
                return {
                  ...g,
                  points: grade,
                };
              }
              return g;
            });
            return updatedGrades;
          });
          onClose();
        }
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Grade for {component?.name}</h2>
            <input
              type="number"
              value={grade !== null ? String(grade) : ""}
              onChange={handleChange}
              placeholder={
                grades.find((grade) => grade.component_id === component?.id)
                  ? `Points: ${grades.find((grade) => grade.component_id === component?.id)?.points}`
                  : "Enter grade"
              }
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default GradeModal;
