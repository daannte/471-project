import React, { useEffect, useState } from "react";
import "./Grades.css";
import Navbar from "@/components/navbar/Navbar";
import GradeModal from "@/components/gradeModal/GradeModal";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Component {
  id: number;
  name: string;
  points: number | null;
  weight: number | null;
  sectionId: number | null;
  type: string;
  date: Date | null;
  submitted?: boolean;
}

interface Student {
  student_id: number;
}

interface Grades {
  component_id: number;
  points: number;
  ucid: number;
}

interface GradeScale {
  letter: string;
  min_perc: number;
  max_perc: number;
}

function Grades() {
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grades[]>([]);
  const [gradeModalOpen, setGradeModalOpen] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null,
  );
  const [selectedUcid, setSelectedUcid] = useState<number | null>(null);

  const storedUcid = localStorage.getItem("ucid");
  const [ucid, _] = useState<number | null>(
    storedUcid ? parseInt(storedUcid) : null,
  );
  const [lastComponentId, setLastComponentId] = useState<number>(() => {
    const storedId = localStorage.getItem("lastComponentId");
    return storedId ? parseInt(storedId) : 0;
  });
  const { course } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cname = course?.slice(0, 4);
        const cnum = course?.slice(4);

        const section_res = await axios.get(
          `/api/sections?cname=${cname}&cnum=${cnum}`,
        );

        const section_id = section_res.data[0].id;
        if (section_id) setSectionId(section_id);

        const perm_res = await axios.get(
          `/api/users?cname=${cname}&cnum=${cnum}&ucid=${ucid}`,
        );
        if (perm_res.data.length !== 0) {
          setRole("admin");

          const students_res = await axios.get(
            `/api/grades?sectionId=${section_id}`,
          );
          setStudents(students_res.data);
        }

        const components_res = await axios.get(
          `/api/components?sectionId=${section_id}`,
        );

        if (components_res.data.length > 0) {
          const allComponents = components_res.data.map(
            (component: Component) => ({
              ...component,
              submitted: true,
            }),
          );
          setComponents(allComponents);
        }

        const grades_res = await axios.get("/api/grades");
        if (grades_res.data.length !== 0) setGrades(grades_res.data);

        const gradeScale_res = await axios.get(
          `/api/grade_scale?sectionId=${section_id}`,
        );
        setGradeScale(gradeScale_res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // Function to handle adding a new component row
  const handleAddComponent = (componentType: string) => {
    const newComponent: Component = {
      id: lastComponentId,
      name: "",
      points: null,
      weight: null,
      type: componentType,
      sectionId,
      date: null,
    };

    setLastComponentId((prevId) => prevId + 1);
    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };

  useEffect(() => {
    localStorage.setItem("lastComponentId", lastComponentId.toString());
  }, [lastComponentId]);

  // Function to handle input change for component properties
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    property: string,
  ) => {
    const value = e.target.value;
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, [property]: value } : component,
    );
    setComponents(updatedComponents);
  };

  // Function to handle submitting component data
  const handleSubmit = async (id: number) => {
    const updatedComponent = components.find(
      (component) => component.id === id,
    );
    if (!updatedComponent) return;

    const { name, points, weight, type } = updatedComponent;

    if (name && points && !isNaN(points) && weight && !isNaN(weight)) {
      const res = await axios.post("/api/components", {
        component: updatedComponent,
        type,
      });

      if (!res.data.success) {
        const res1 = await axios.put("/api/components", {
          component: updatedComponent,
        });

        if (res1) {
          const updatedComponents = components.map((component) =>
            component.id === id ? { ...component, submitted: true } : component,
          );
          setComponents(updatedComponents);
        }
      } else {
        const updatedComponents = components.map((component) =>
          component.id === id ? { ...component, submitted: true } : component,
        );
        setComponents(updatedComponents);
      }
    }
  };

  const handleEdit = (id: number) => {
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, submitted: false } : component,
    );
    setComponents(updatedComponents);
  };

  // Function to handle deleting a row
  const handleDelete = async (id: number) => {
    const res = await axios.delete("/api/components", {
      data: { id },
    });

    if (res.data.success) {
      const updatedComponents = components.filter(
        (component) => component.id !== id,
      );
      setComponents(updatedComponents);
    }
  };

  const handleAddGrade = (component: Component, ucid: number) => {
    setSelectedComponent(component);
    setSelectedUcid(ucid);
    setGradeModalOpen(true);
  };

  const calculateWeight = (component: Component) => {
    const given_grade = grades.find(
      (grade) =>
        component?.id === grade.component_id &&
        ucid === grade.ucid,
    )?.points

    if (given_grade === undefined || component.points === null || component.weight === null) {
      return `- / ${component.weight}`
    }
   
    const weight = (given_grade / component.points) * component.weight
    return `${weight.toFixed(2)} / ${component.weight}`
  }

  const calculateTentativeGrade = () => {
    let tentativeGrade = 0;
    let totalWeight: number = 0;

    components.forEach((component) => {
      if (component.points && component.weight) {
        const grade = grades.find(
          (grade) => component.id === grade.component_id && ucid === grade.ucid
        )?.points || component.points;
        
        totalWeight += parseFloat(component.weight.toString())
        tentativeGrade += (grade / component.points) * component.weight;
      }
    });

    const remainingWeight = 100 - totalWeight
    return (tentativeGrade + remainingWeight).toFixed(2);
  }

  const calculateCurrentGrade = () => {
    let weightAchieved = 0;
    let totalWeight: number = 0;

    components.forEach((component) => {
      if (component.points && component.weight) {
        const grade = grades.find(
          (grade) => component.id === grade.component_id && ucid === grade.ucid
        )?.points;

        if (grade !== undefined) {
          weightAchieved += (grade / component.points) * component.weight;
          totalWeight += parseFloat(component.weight.toString())
        }
      }
    });
    const currentGrade = totalWeight === 0 ? 0.00 : ((weightAchieved / totalWeight) * 100).toFixed(2)
    return currentGrade
  }

  const getLetterGrade = (percentage: number): string => {
    const grade = gradeScale.find(
      (letter) => percentage >= letter.min_perc && percentage <= letter.max_perc
    );
    return grade ? grade.letter : '';
  };

  return (
    <>
      <Navbar />
      <div className="grades-container">
        {/* Assignments Section */}
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
          </div>
        </div>
        {/* Render assignment rows */}
        {components
          .filter((component) => component.type === "assignment")
          .map((assignment, index) => (
            <div
              className="row"
              key={index}
              style={{ backgroundColor: "white" }}
            >
              <div
                className={
                  assignment.submitted ? "long-row submitted" : "long-row"
                }
                style={{ backgroundColor: "white" }}
              >
                {assignment.submitted ? (
                  <>
                    <span>{assignment.name}</span>
                    <span>
                      {role !== "admin" &&
                        (grades.find(
                          (grade) =>
                            assignment?.id === grade.component_id &&
                            ucid === grade.ucid,
                        )?.points !== undefined
                          ? `${
                              grades.find(
                                (grade) =>
                                  assignment?.id === grade.component_id &&
                                  ucid === grade.ucid,
                              )?.points
                            } / `
                          : "- / ")}
                      {assignment.points}
                    </span>
                    <span>{role === "admin" ? assignment.weight : calculateWeight(assignment)}</span>
                    {role === "admin" && (
                      <button onClick={() => handleEdit(assignment.id)}>
                        Edit
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={assignment.name}
                      onChange={(e) =>
                        handleInputChange(e, assignment.id, "name")
                      }
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={
                        assignment.points ? assignment.points.toString() : ""
                      }
                      onChange={(e) =>
                        handleInputChange(e, assignment.id, "points")
                      }
                      placeholder="Points"
                    />
                    <input
                      type="text"
                      value={
                        assignment.weight ? assignment.weight.toString() : ""
                      }
                      onChange={(e) =>
                        handleInputChange(e, assignment.id, "weight")
                      }
                      placeholder="Weight"
                    />
                    <button onClick={() => handleSubmit(assignment.id)}>
                      Submit
                    </button>
                    <button onClick={() => handleDelete(assignment.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

        {/* Exams Section */}
        <div className="row">
          <div className="long-row">
            <span>Exams</span>
            {role === "admin" && (
              <button
                className="add"
                onClick={() => handleAddComponent("exam")}
              >
                +
              </button>
            )}
          </div>
        </div>
        {/* Render exam rows */}
        {components
          .filter((component) => component.type === "exam")
          .map((exam, index) => (
            <div
              className="row"
              key={index}
              style={{ backgroundColor: "white" }}
            >
              <div
                className={exam.submitted ? "long-row submitted" : "long-row"}
                style={{ backgroundColor: "white" }}
              >
                {exam.submitted ? (
                  <>
                    <span>{exam.name}</span>
                    <span>
                      {role !== "admin" &&
                        (grades.find(
                          (grade) =>
                            exam?.id === grade.component_id &&
                            ucid === grade.ucid,
                        )?.points !== undefined
                          ? `${
                              grades.find(
                                (grade) =>
                                  exam?.id === grade.component_id &&
                                  ucid === grade.ucid,
                              )?.points
                            } / `
                          : "- / ")}
                      {exam.points}
                    </span>
                    <span>{role === "admin" ? exam.weight : calculateWeight(exam)}</span>
                    {role === "admin" && (
                      <button onClick={() => handleEdit(exam.id)}>Edit</button>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={exam.name}
                      onChange={(e) => handleInputChange(e, exam.id, "name")}
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={exam.points ? exam.points.toString() : ""}
                      onChange={(e) => handleInputChange(e, exam.id, "points")}
                      placeholder="Points"
                    />
                    <input
                      type="text"
                      value={exam.weight ? exam.weight.toString() : ""}
                      onChange={(e) => handleInputChange(e, exam.id, "weight")}
                      placeholder="Weight"
                    />
                    <button onClick={() => handleSubmit(exam.id)}>
                      Submit
                    </button>
                    <button onClick={() => handleDelete(exam.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        {role !== "admin" && (
          <>
            <div className="row">
              <div className="long-row">
                <span>Current Grade</span>
                <span className="grade">{calculateCurrentGrade()}</span>
              </div>
            </div>
            <div className="row">
              <div className="long-row">
                <span>Tentative Grade</span>
                <span className="grade">{calculateTentativeGrade()}</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="student__table">
        {students.map((student, index) => (
          <div className="student__container" key={index}>
            {student.student_id}
            <div className="student__components">
              {components.map((component, index) => (
                <div key={index} className="student__component">
                  <div className="student__component-name">
                    {component.name}
                  </div>
                  <div className="student__component-grade">
                    {
                      grades.find(
                        (grade) => component.id === grade.component_id,
                      )?.points
                    }
                  </div>
                  <button
                    onClick={() =>
                      handleAddGrade(component, student.student_id)
                    }
                  >
                    Edit Grade
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <GradeModal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        component={selectedComponent}
        ucid={selectedUcid}
        setGrades={setGrades}
        grades={grades}
      />
    </>
  );
}

export default Grades;
