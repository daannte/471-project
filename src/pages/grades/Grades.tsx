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
  date: string;
  time: string;
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
  const [showStudentsMap, setShowStudentsMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [gradeNeeded, setGradeNeeded] = useState<number | null>(null);
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
  const [lastId, setLastId] = useState<number>(() => {
    const storedId = localStorage.getItem("lastId");
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
            (component: Component) => {
              const date = new Date(component.date).toLocaleDateString();

              let time = new Date(component.date).toLocaleTimeString();

              // Convert the time to 24-hour format
              const [timePart, period] = time.split(" ");
              let [hours, minutes] = timePart.split(":");
              hours = (
                (parseInt(hours) + (period.toLowerCase() === "p.m." ? 12 : 0)) %
                24
              ).toString();
              time = `${hours.padStart(2, "0")}:${minutes}`;
              return {
                ...component,
                date,
                time,
                submitted: true,
              };
            },
          );
          setComponents(allComponents);
        }

        const gradeScale_res = await axios.get(
          `/api/gradescale?sectionId=${section_id}`,
        );
        setGradeScale(gradeScale_res.data);

        const grades_res = await axios.get(`/api/grades`);
        setGrades(grades_res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // Function to handle adding a new component row
  const handleAddComponent = (componentType: string) => {
    const newComponent: Component = {
      id: lastId,
      name: "",
      points: null,
      weight: null,
      type: componentType,
      sectionId,
      date: "",
      time: "",
    };

    setLastId((prevId) => prevId + 1);
    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };

  useEffect(() => {
    localStorage.setItem("lastId", lastId.toString());
  }, [lastId]);

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

    const { name, points, weight, type, date, time } = updatedComponent;

    if (
      name &&
      points &&
      !isNaN(points) &&
      weight &&
      !isNaN(weight) &&
      date &&
      time
    ) {
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
    const res = await axios.delete(`/api/components/${id}`);

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
      (grade) => component?.id === grade.component_id && ucid === grade.ucid,
    )?.points;

    if (
      given_grade === undefined ||
      component.points === null ||
      component.weight === null
    ) {
      return `- / ${component.weight}`;
    }

    const weight = (given_grade / component.points) * component.weight;
    return `${weight.toFixed(2)} / ${component.weight}`;
  };

  const calculateTentativeGrade = () => {
    let tentativeGrade = 0;
    let totalWeight: number = 0;

    components.forEach((component) => {
      if (component.points && component.weight) {
        const grade =
          grades.find(
            (grade) =>
              component.id === grade.component_id && ucid === grade.ucid,
          )?.points || component.points;

        totalWeight += parseFloat(component.weight.toString());
        tentativeGrade += (grade / component.points) * component.weight;
      }
    });

    const remainingWeight = 100 - totalWeight;
    return (tentativeGrade + remainingWeight).toFixed(2);
  };

  const calculateCurrentGrade = () => {
    let weightAchieved = 0;
    let totalWeight: number = 0;

    components.forEach((component) => {
      if (component.points && component.weight) {
        const grade = grades.find(
          (grade) => component.id === grade.component_id && ucid === grade.ucid,
        )?.points;

        if (grade !== undefined) {
          weightAchieved += (grade / component.points) * component.weight;
          totalWeight += parseFloat(component.weight.toString());
        }
      }
    });
    const currentGrade =
      totalWeight === 0
        ? ""
        : ((weightAchieved / totalWeight) * 100).toFixed(2);
    return { currentGrade, weightAchieved, totalWeight };
  };

  const getLetterGrade = (percentage: number): string => {
    const grade = gradeScale.find(
      (letter) =>
        percentage >= letter.min_perc && percentage <= letter.max_perc,
    );
    return grade ? grade.letter : "";
  };

  const toggleShowStudents = (id: number) => {
    setShowStudentsMap((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  function handleGradeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const grade = (event.target as any).elements.grade.value;
    const totalWeight = calculateCurrentGrade().totalWeight;
    const weightAchieved = calculateCurrentGrade().weightAchieved;

    let gradeNeeded = ((grade - weightAchieved) / (100 - totalWeight)) * 100;

    // round to 2 without rounding
    gradeNeeded = Math.trunc(gradeNeeded * Math.pow(10, 2)) / Math.pow(10, 2);
    setGradeNeeded(gradeNeeded);
  }

  function calculatePercentage(component: Component) {
    const componentGrade = grades.find(
      (grade) => component.id === grade.component_id && ucid === grade.ucid,
    )?.points;

    if (componentGrade === undefined || component.points === null) {
      return <span>-%</span>;
    }
    const calcGrade = (componentGrade / component.points) * 100;
    const grade = calcGrade % 1 !== 0 ? calcGrade.toFixed(2) : calcGrade;

    return <span>{grade}%</span>;
  }

  return (
    <>
      <Navbar />
      <div className="grades-container">
        {/* Assignments Section */}
        <div className="row">
          <div className="long-row">
            <div className="outer">
              <div className="component__admin">
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
            <div className="outer">Points</div>
            <div className="outer">Weight</div>
            {role !== "admin" && <div className="outer">Percentage</div>}
            <div className="outer">Due Date</div>
          </div>
        </div>
        {/* Render assignment rows */}
        {components
          .filter((component) => component.type === "assignment")
          .map((assignment, index) => (
            <div className="row" key={index}>
              <div className="component__row">
                <div className="component">
                  {assignment.submitted ? (
                    <>
                      <div className="outer">{assignment.name}</div>
                      <div className="outer">
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
                      </div>
                      <div className="outer">
                        {role === "admin"
                          ? assignment.weight
                          : calculateWeight(assignment)}
                      </div>
                      {role !== "admin" && (
                        <div className="outer">
                          {calculatePercentage(assignment)}
                        </div>
                      )}
                      <div className="outer">
                        {new Date(assignment.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        ,{" "}
                        {new Date(
                          "1970-01-01T" + assignment.time + "Z",
                        ).toLocaleTimeString("en-US", {
                          timeZone: "UTC",
                          hour12: true,
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </div>
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
                      <input
                        type="date"
                        value={assignment.date}
                        onChange={(e) =>
                          handleInputChange(e, assignment.id, "date")
                        }
                      />
                      <input
                        type="time"
                        value={assignment.time}
                        onChange={(e) =>
                          handleInputChange(e, assignment.id, "time")
                        }
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
                {role === "admin" && (
                  <button
                    className="show__student-button"
                    onClick={() => toggleShowStudents(assignment.id)}
                  >
                    {showStudentsMap[assignment.id]
                      ? `Hide Students`
                      : "Show Students"}
                  </button>
                )}
                {showStudentsMap[assignment.id] && (
                  <div className="student__table">
                    {students.map((student, index) => (
                      <div key={index} className="student">
                        {student.student_id}
                        <div className="student__component-grade">
                          {
                            grades.find(
                              (grade) =>
                                assignment.id === grade.component_id &&
                                grade.ucid === student.student_id,
                            )?.points
                          }
                        </div>
                        <button
                          onClick={() =>
                            handleAddGrade(assignment, student.student_id)
                          }
                        >
                          Edit Grade
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        {/* Exams Section */}
        <div className="row">
          <div className="long-row">
            <div className="outer">
              <div className="component__admin">
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
            <div className="outer">Points</div>
            <div className="outer">Weight</div>
            {role !== "admin" && <div className="outer">Percentage</div>}
            <div className="outer">Due Date</div>
          </div>
        </div>
        {/* Render exam rows */}
        {components
          .filter((component) => component.type === "exam")
          .map((exam, index) => (
            <div className="row" key={index}>
              <div className="component__row">
                <div className="component">
                  {exam.submitted ? (
                    <>
                      <div className="outer">{exam.name}</div>
                      <div className="outer">
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
                      </div>
                      <div className="outer">
                        {role === "admin" ? exam.weight : calculateWeight(exam)}
                      </div>
                      {role !== "admin" && (
                        <div className="outer">{calculatePercentage(exam)}</div>
                      )}
                      <div className="outer">
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        ,{" "}
                        {new Date(
                          "1970-01-01T" + exam.time + "Z",
                        ).toLocaleTimeString("en-US", {
                          timeZone: "UTC",
                          hour12: true,
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </div>
                      {role === "admin" && (
                        <button onClick={() => handleEdit(exam.id)}>
                          Edit
                        </button>
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
                        onChange={(e) =>
                          handleInputChange(e, exam.id, "points")
                        }
                        placeholder="Points"
                      />
                      <input
                        type="text"
                        value={exam.weight ? exam.weight.toString() : ""}
                        onChange={(e) =>
                          handleInputChange(e, exam.id, "weight")
                        }
                        placeholder="Weight"
                      />
                      <input
                        type="date"
                        value={exam.date}
                        onChange={(e) => handleInputChange(e, exam.id, "date")}
                      />
                      <input
                        type="time"
                        value={exam.time}
                        onChange={(e) => handleInputChange(e, exam.id, "time")}
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
                {role === "admin" && (
                  <button
                    className="show__student-button"
                    onClick={() => toggleShowStudents(exam.id)}
                  >
                    {showStudentsMap[exam.id]
                      ? `Hide Students`
                      : "Show Students"}
                  </button>
                )}
                {showStudentsMap[exam.id] && (
                  <div className="student__table">
                    {students.map((student, index) => (
                      <div key={index} className="student">
                        {student.student_id}
                        <div className="student__component-grade">
                          {
                            grades.find(
                              (grade) =>
                                exam.id === grade.component_id &&
                                grade.ucid === student.student_id,
                            )?.points
                          }
                        </div>
                        <button
                          onClick={() =>
                            handleAddGrade(exam, student.student_id)
                          }
                        >
                          Edit Grade
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        {role !== "admin" && (
          <>
            <div className="row">
              <div className="long-row">
                <span>Current Grade</span>
                <span className="grade">
                  {calculateCurrentGrade().currentGrade
                    ? calculateCurrentGrade().currentGrade
                    : 0}
                </span>
                <span className="letter">
                  {getLetterGrade(
                    parseFloat(calculateCurrentGrade().currentGrade),
                  )}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="long-row">
                <span>Tentative Grade</span>
                <span className="grade">{calculateTentativeGrade()}</span>
                <span className="letter">
                  {getLetterGrade(parseFloat(calculateTentativeGrade()))}
                </span>
              </div>
            </div>
          </>
        )}
        {role !== "admin" && (
          <div className="wanted">
            <h3>Wanted Grade Calculator</h3>
            <form className="grade__form" onSubmit={handleGradeSubmit}>
              <input
                className="grade__input"
                name="grade"
                type="number"
                autoComplete="off"
                required
              />
              <button className="grade__submit-button" type="submit">
                Calculate
              </button>
            </form>
            {gradeNeeded !== null && <div>Grade Needed: {gradeNeeded}</div>}
          </div>
        )}
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
