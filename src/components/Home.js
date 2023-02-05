import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
export default function Home(props) {
    document.title = 'Absentee';
    const [sections, setSections] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const showSections = async () => {
        props.setProgress(10);
        let url = props.apiServer + "api-home.php";
        let data = await fetch(url);
        props.setProgress(50);
        let parsedData = await data.json();
        props.setProgress(80);
        setSections(parsedData.sections)
        setTotalEmployees(parsedData.totalEmployees)
        props.setProgress(100);
    }
    useEffect(() => {
        showSections();
    }, [])
    return (
        <>
            <div className="bg-dark text-center h4 py-3" style={{ 'position': 'sticky', 'top': 0 }}>
                <a href='/' className='text-decoration-none text-light'>Absentee Portal</a>
            </div>
            <div className="container my-3 text-center">
                <h4><a href='/'>All Sections</a> </h4><br />
                <center>
                    <div className="container col-xs-8 col-md-3">
                        {sections.map((element) => {
                            return <div key={element.dirname}>
                                <Link to={`/fill-leaves?section=${element.dirname}`} className={`mb-3 btn ${element.btnClass} w-100`}>{element.dirname.toUpperCase()}</Link>
                            </div>
                        })}
                    </div>
                    Total Employees: {totalEmployees}
                </center>
            </div>
            <div className="text-center bg-dark text-light py-3">
                Developer: satishkushwahdigital@gmail.com
            </div>
        </>
    )
}
