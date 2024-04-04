import Navbar from "@/components/navbar/Navbar";
import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Course {
  name: string;
  number: number;
  title: string;
}

function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses_res = await axios.get("/api/courses");

        if (courses_res.data) setCourses(courses_res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="courses__container">
        <h1 className="courses__title">Courses</h1>
        <div className="courses">
          {courses.map((course, index) => (
            <Link
              key={index}
              to={`/courses/${course.name}${course.number}`}
              className="course__link"
            >
              <div className="inner-box">
                <div>
                  {course.name} {course.number}
                </div>
                <p>{course.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
