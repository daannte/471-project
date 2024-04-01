import React, { useState } from "react";
import "./Grades.css";
import Navbar from "@/components/navbar/Navbar";

interface Component {
  name: string;
  points: number | null;
  weight: number | null;
  submitted?: boolean;
}

function Grades() {
  const [assignments, setAssignments] = useState<Component[]>([]);
  const [exams, setExams] = useState<Component[]>([]);

  // Function to handle adding a new component row
  const handleAddComponent = (componentType: string) => {
    const newComponent: Component = {
      name: "",
      points: null,
      weight: null,
    };

    if (componentType === "assignment") {
      setAssignments((prevAssignments) => [...prevAssignments, newComponent]);
    } else if (componentType === "exam") {
      setExams((prevExams) => [...prevExams, newComponent]);
    }
  };

  // Function to handle input change for component properties
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    componentType: string,
    property: string,
  ) => {
    const value = e.target.value;
    if (componentType === "assignment") {
      const updatedAssignments = [...assignments];
      updatedAssignments[index] = {
        ...updatedAssignments[index],
        [property]: value,
      };
      setAssignments(updatedAssignments);
    } else if (componentType === "exam") {
      const updatedExams = [...exams];
      updatedExams[index] = { ...updatedExams[index], [property]: value };
      setExams(updatedExams);
    }
  };

  // Function to handle submitting component data
  const handleSubmit = (index: number, componentType: string) => {
    if (componentType === "assignment") {
      const updatedAssignments = [...assignments];
      updatedAssignments[index].submitted = true;
      setAssignments(updatedAssignments);
    } else if (componentType === "exam") {
      const updatedExams = [...exams];
      updatedExams[index].submitted = true;
      setExams(updatedExams);
    }
  };

  // Function to handle editing a submitted row
  const handleEdit = (index: number, componentType: string) => {
    // Set the 'submitted' property to false to allow editing
    if (componentType === "assignment") {
      const updatedAssignments = [...assignments];
      updatedAssignments[index].submitted = false;
      setAssignments(updatedAssignments);
    } else if (componentType === "exam") {
      const updatedExams = [...exams];
      updatedExams[index].submitted = false;
      setExams(updatedExams);
    }
  };

  return (
    <>
      <Navbar />
      <div className="grades-container">
        <div className="row">
          <div className="long-row">
            <span>Assignments</span>
            <button
              className="add"
              onClick={() => handleAddComponent("assignment")}
            >
              +
            </button>
            <span className="grade">F</span>
          </div>
        </div>
        {/* Render assignment rows */}
        {assignments.map((assignment, index) => (
          <div className="row" key={index} style={{ backgroundColor: "white" }}>
            <div
              className={
                assignment.submitted ? "long-row submitted" : "long-row"
              }
              style={{ backgroundColor: "white" }}
            >
              {assignment.submitted ? (
                <>
                  <span>{assignment.name}</span>
                  <span>{assignment.points}</span>
                  <span>{assignment.weight}</span>
                  <button onClick={() => handleEdit(index, "assignment")}>
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={assignment.name}
                    onChange={(e) =>
                      handleInputChange(e, index, "assignment", "name")
                    }
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={
                      assignment.points ? assignment.points.toString() : ""
                    }
                    onChange={(e) =>
                      handleInputChange(e, index, "assignment", "points")
                    }
                    placeholder="Points"
                  />
                  <input
                    type="text"
                    value={
                      assignment.weight ? assignment.weight.toString() : ""
                    }
                    onChange={(e) =>
                      handleInputChange(e, index, "assignment", "weight")
                    }
                    placeholder="Weight"
                  />
                  <button onClick={() => handleSubmit(index, "assignment")}>
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="row">
          <div className="long-row">
            <span>Exams</span>
            <button className="add" onClick={() => handleAddComponent("exam")}>
              +
            </button>
            <span className="grade">F</span>
          </div>
        </div>
        {/* Render exam rows */}
        {exams.map((exam, index) => (
          <div className="row" key={index} style={{ backgroundColor: "white" }}>
            <div
              className={exam.submitted ? "long-row submitted" : "long-row"}
              style={{ backgroundColor: "white" }}
            >
              {exam.submitted ? (
                <>
                  <span>{exam.name}</span>
                  <span>{exam.points}</span>
                  <span>{exam.weight}</span>
                  <button onClick={() => handleEdit(index, "exam")}>
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) =>
                      handleInputChange(e, index, "exam", "name")
                    }
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={exam.points ? exam.points.toString() : ""}
                    onChange={(e) =>
                      handleInputChange(e, index, "exam", "points")
                    }
                    placeholder="Points"
                  />
                  <input
                    type="text"
                    value={exam.weight ? exam.weight.toString() : ""}
                    onChange={(e) =>
                      handleInputChange(e, index, "exam", "weight")
                    }
                    placeholder="Weight"
                  />
                  <button onClick={() => handleSubmit(index, "exam")}>
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="row">
          <div className="long-row">
            <span>Achieved Grades</span>
            <span className="grade">F</span>
          </div>
        </div>
        <div className="row">
          <div className="long-row">
            <span>Tentative Grades</span>
            <span className="grade">F</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Grades;
