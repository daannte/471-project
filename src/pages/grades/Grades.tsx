import React, { useState } from "react";
import "./Grades.css";
import Navbar from "@/components/navbar/Navbar";

function Grades() {
  // State variables to track the rows of assignments and exams
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  // Function to handle adding a new component row
  const handleAddComponent = (componentType) => {
    // Create a new component object with default values
    const newComponent = {
      name: "",
      points: "",
      weight: ""
    };
    // Add the new component to the corresponding array based on component type
    if (componentType === "assignment") {
      setAssignments([...assignments, newComponent]);
    } else if (componentType === "exam") {
      setExams([...exams, newComponent]);
    }
  };

  // Function to handle input change for component properties
  const handleInputChange = (e, index, componentType, property) => {
    const value = e.target.value;
    if (componentType === "assignment") {
      const updatedAssignments = [...assignments];
      updatedAssignments[index][property] = value;
      setAssignments(updatedAssignments);
    } else if (componentType === "exam") {
      const updatedExams = [...exams];
      updatedExams[index][property] = value;
      setExams(updatedExams);
    }
  };

  // Function to handle submitting component data
  const handleSubmit = (index, componentType) => {
    // Set the corresponding property to 'submitted' in the component object
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

  return (
    <>
      <Navbar />
      <div className="grades-container">
        <div className="row">
          <div className="long-row">
            <span>Assignments</span>
            <button className="add" onClick={() => handleAddComponent("assignment")}>+</button>
            <span className="grade">F</span>
          </div>
        </div>
        {/* Render assignment rows */}
        {assignments.map((assignment, index) => (
          <div className="row" key={index} style={{ backgroundColor: 'white' }}>
            <div className={assignment.submitted ? "long-row submitted" : "long-row"} style={{ backgroundColor: 'white' }}>
              {assignment.submitted ? (
                <>
                  <span>{assignment.name}</span>
                  <span>{assignment.points}</span>
                  <span>{assignment.weight}</span>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={assignment.name}
                    onChange={(e) => handleInputChange(e, index, "assignment", "name")}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={assignment.points}
                    onChange={(e) => handleInputChange(e, index, "assignment", "points")}
                    placeholder="Points"
                  />
                  <input
                    type="text"
                    value={assignment.weight}
                    onChange={(e) => handleInputChange(e, index, "assignment", "weight")}
                    placeholder="Weight"
                  />
                  <button onClick={() => handleSubmit(index, "assignment")}>Submit</button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="row">
          <div className="long-row">
            <span>Exams</span>
            <button className="add" onClick={() => handleAddComponent("exam")}>+</button>
            <span className="grade">F</span>
          </div>
        </div>
        {/* Render exam rows */}
        {exams.map((exam, index) => (
          <div className="row" key={index} style={{ backgroundColor: 'white' }}>
            <div className={exam.submitted ? "long-row submitted" : "long-row"} style={{ backgroundColor: 'white' }}>
              {exam.submitted ? (
                <>
                  <span>{exam.name}</span>
                  <span>{exam.points}</span>
                  <span>{exam.weight}</span>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) => handleInputChange(e, index, "exam", "name")}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={exam.points}
                    onChange={(e) => handleInputChange(e, index, "exam", "points")}
                    placeholder="Points"
                  />
                  <input
                    type="text"
                    value={exam.weight}
                    onChange={(e) => handleInputChange(e, index, "exam", "weight")}
                    placeholder="Weight"
                  />
                  <button onClick={() => handleSubmit(index, "exam")}>Submit</button>
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
