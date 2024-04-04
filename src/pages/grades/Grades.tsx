import React, { useEffect, useState } from "react";
import "./Grades.css";
import Navbar from "@/components/navbar/Navbar";
import axios from "axios";

interface Component {
  name: string;
  points: number | null;
  weight: number | null;
  submitted?: boolean;
}

function Grades() {
  const [assignments, setAssignments] = useState<Component[]>([]);
  const [exams, setExams] = useState<Component[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignments_res = await axios.get(
          "/api/components?type=assignment",
        );
        const exams_res = await axios.get("/api/components?type=exam");

        if (assignments_res.data.length > 0) {
          const assignments_submitted = assignments_res.data.map(
            (assignment: Component) => ({
              ...assignment,
              submitted: true,
            }),
          );
          setAssignments(assignments_submitted);
        }

        if (exams_res.data.length > 0) {
          const exams_submitted = exams_res.data.map((exam: Component) => ({
            ...exam,
            submitted: true,
          }));
          setExams(exams_submitted);
        }

        const name = localStorage.getItem("name");
        const role_res = await axios.get(`/api/users?name=${name}`);
        setRole(role_res.data[0].role_type);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

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
  const handleSubmit = async (index: number, componentType: string) => {
    if (componentType === "assignment") {
      const updatedAssignments = [...assignments];
      const { name, points, weight } = updatedAssignments[index];

      if (name && points && !isNaN(points) && weight && !isNaN(weight)) {
        updatedAssignments[index].submitted = true;
        const res = await axios.post("/api/components", {
          component: updatedAssignments[index],
          type: componentType,
        });

        if (!res.data.success) {
          const res1 = await axios.put("/api/components", {
            component: updatedAssignments[index],
          });

          if (res1) {
            setAssignments(updatedAssignments);
          }
        } else {
          setAssignments(updatedAssignments);
        }
      }
    } else if (componentType === "exam") {
      const updatedExams = [...exams];
      const { name, points, weight } = updatedExams[index];

      if (name && points && !isNaN(points) && weight && !isNaN(weight)) {
        updatedExams[index].submitted = true;
        const res = await axios.post("/api/components", {
          component: updatedExams[index],
          type: componentType,
        });

        if (!res.data.success) {
          const res1 = await axios.put("/api/components", {
            component: updatedExams[index],
          });

          if (res1) {
            setExams(updatedExams);
          }
        } else {
          setExams(updatedExams);
        }
      }
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

  // Function to handle deleting a row
  const handleDelete = async (index: number, componentType: string) => {
    if (componentType === "assignment") {
      const updatedAssignments = [...assignments];
      const res = await axios.delete("/api/components", {
        data: { name: updatedAssignments[index].name },
      });

      if (res.data.success) {
        updatedAssignments.splice(index, 1);
        setAssignments(updatedAssignments);
      }
    } else if (componentType === "exam") {
      const updatedExams = [...exams];
      const res = await axios.delete("/api/components", {
        data: { name: updatedExams[index].name },
      });

      if (res.data.success) {
        updatedExams.splice(index, 1);
        setExams(updatedExams);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="grades-container">
        <div className="row">
          <div className="long-row">
            <span>Assignments</span>
            {role === "admin" && (
            <button
              className="add"
              onClick={() => handleAddComponent("assignment")}
            >
              +
            </button>
            )}
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
                  <button onClick={() => handleDelete(index, "assignment")}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="row">
          <div className="long-row">
            <span>Exams</span>
            {role === "admin" && (
              <button className="add" onClick={() => handleAddComponent("exam")}>
                +
              </button>
            )}
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
                  <button onClick={() => handleDelete(index, "exam")}>
                    Delete
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
