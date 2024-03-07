import Navbar from '../Components/Navbar';
import './Home.css';

function Home() {
  return (
    <div className="home">
        <Navbar />
        <div className="main-container">
            <div className="course-box">
                <h2>Courses</h2>
                <div className="inner-box">
                    <h3>CPSC471</h3>
                </div>
            </div>
        </div>
    </div>
  );  
}

export default Home;