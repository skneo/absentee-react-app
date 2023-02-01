import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar'

export default function ViewScreenshot(props) {
    let url = new URL(window.location.href);
    let section = url.searchParams.get("section");
    let emp_num = url.searchParams.get("view_emp");
    document.title = "View Screenshot - " + section.toUpperCase();
    const navigate = useNavigate();
    const [empData, setEmpData] = useState(['NA', [], 'NA', 0])
    const [lock, setlock] = useState(0)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const getData = async () => {
        props.setProgress(10);
        let url = props.apiServer + `api-viewScreenshot.php?section=${section}&view_emp=${emp_num}`;
        let data = await fetch(url);
        props.setProgress(50);
        let parsedData = await data.json();
        props.setProgress(80);
        setEmpData(parsedData.emp_data)
        setlock(parsedData.lock)
        props.setProgress(100);
        // console.log(parsedData)
    }
    useEffect(() => {
        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "none";
        }
        if (props.logins.loggedinSection === 'none') {
            let loggedinSection = getCookie('loggedinSection')
            let adminKey = getCookie('adminKey')
            if (loggedinSection !== 'none') {
                props.setLogins({ 'loggedinSection': loggedinSection, 'adminKey': adminKey });
            }
        }
        getData();
    }, [])
    const handleVerify = async () => {
        if (window.confirm('Sure to verify ?')) {
            props.setProgress(10);
            let url = props.apiServer + `api-viewScreenshot.php?section=${section}&verify_data=${emp_num}`;
            let data = await fetch(url);
            props.setProgress(50);
            let parsedData = await data.json();
            props.setProgress(80);
            if (parsedData.verified === true) {
                navigate('/all-statements?section=' + section)
            }
            props.setProgress(100);
        }
        // console.log(parsedData)
    }
    const handleDelete = async () => {
        if (window.confirm('Sure to delete ?')) {
            props.setProgress(10);
            let url = props.apiServer + `api-viewScreenshot.php?section=${section}&delete=${emp_num}`;
            let data = await fetch(url);
            props.setProgress(50);
            let parsedData = await data.json();
            props.setProgress(80);
            if (parsedData.deleted === true) {
                navigate('/all-statements?section=' + section)
            }
            props.setProgress(100);
        }
        // console.log(parsedData)
    }
    let tableRows = empData[1].map((row, index) => {
        let date1 = new Date(row[0]);
        let date2 = new Date(row[1]);
        let Difference_In_Time = date2.getTime() - date1.getTime();
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
        let leaveDate = new Date(row[0])
        let leaveFrom = leaveDate.getDate() + '-' + months[leaveDate.getMonth()] + '-' + leaveDate.getFullYear().toString().substring(2);
        leaveDate = new Date(row[1])
        let leaveTo = leaveDate.getDate() + '-' + months[leaveDate.getMonth()] + '-' + leaveDate.getFullYear().toString().substring(2);
        return <tr key={index}>
            <td>{row[2]}</td>
            <td>{leaveFrom}</td>
            <td>{leaveTo}</td>
            <td>{Difference_In_Days}</td>
        </tr>
    })
    if (empData[1].length == 0)
        tableRows = <tr>
            <td>NIL</td>
            <td>NIL</td>
            <td>NIL</td>
            <td>NIL</td>
        </tr>
    return (
        <>
            <Navbar section={section} loggedinSection={props.logins.loggedinSection} setLogins={props.setLogins} />
            <div className='container mb-5'>
                {(props.logins.loggedinSection === 'none') && <Link to={`/fill-leaves?section=${section}`} className='btn btn-primary btn-sm mt-2'>&larr; Back</Link>}
                {(props.logins.loggedinSection === section || props.logins.loggedinSection === 'admin') && <Link to={`/all-statements?section=${section}`} className='btn btn-primary btn-sm mt-2'>&larr; Back</Link>}
                <p className='mt-2'><b>Employee Name:</b> {empData[0]} <br /> <b> Employee Number:</b> {emp_num}</p>
                <b>ESS Screenshot</b>

                {(lock === 0) && (props.logins.loggedinSection === section) && <a href={`edit_record.php?section=${section}&changeScreenshot=${emp_num}`} className='btn btn-info btn-sm ms-2'>Change </a>}

                <div style={{ 'maxHeight': '800px' }} className='overflow-auto'> <img src={props.apiServer + `${section}/uploads/${empData[2]}`} style={{ 'width': '1080px', 'borderRadius': '20px' }} className='mt-2' alt='ESS Screenshot' /></div>

                <div className="my-3">
                    <table id="table_id" className="table-bordered w-100 mb-3 text-center">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>From</th>
                                <th>Upto</th>
                                <th>Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                    </table>

                    {(lock === 0) && (props.logins.loggedinSection === section) && <a href={`edit_record.php?section=${section}&editTable=${emp_num}`} className='btn btn-info btn-sm mb-3'>Edit Table</a>}

                    {(lock === 0) && (props.logins.loggedinSection === section) && <div className='row my-3'>
                        <div className='col'>
                            <button onClick={handleDelete} type='submit' className='float-start btn btn-danger' >Delete </button>
                        </div>
                        <div className='col'>
                            <button onClick={handleVerify} type='submit' className='btn btn-success float-end'>Verify </button>
                        </div>
                    </div>}
                    {(lock === 1) && <p className='text-danger'>Data is locked</p>}
                </div>
            </div >
            <div className="text-center bg-dark text-light py-3 mt-5" style={{ 'marginBottom': '-300px' }}>
                Developer: satishkushwahdigital@gmail.com
            </div>
        </>
    )
}
