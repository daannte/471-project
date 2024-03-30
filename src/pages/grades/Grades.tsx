import "./Grades.css";
import Navbar from "@/components/navbar/Navbar";

function Grades() {
  return (
    <>
      <Navbar />
      <div className="grades-container">
        <div className="row">
          <div className="long-row">
            <span>Assignments</span>
            <button className="add">+</button>
            <span className="grade">F</span>
          </div>
        </div>
        <div className="row">
          <div className="long-row">
            <span>Exams</span>
            <button className="add">+</button>
            <span className="grade">F</span>
          </div>
        </div>
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
