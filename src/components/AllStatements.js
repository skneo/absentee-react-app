import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Alert from './Alert';
import Navbar from './Navbar'
export default function AllStatements(props) {
    let url = new URL(window.location.href);
    let section = url.searchParams.get("section");
    const navigate = useNavigate();
    document.title = "All Leave Statements - " + section.toUpperCase();
    const [absentee, setAbsentee] = useState({})
    const [employees, setEmployees] = useState([])
    const [officerName, setofficerName] = useState('officerNameNA')
    const [inchargeName, setinchargeName] = useState('inchargeNameNA')
    const [inchargeEmpNo, setinchargeEmpNo] = useState('inchargeEmpNoNA')
    const [locked, setlocked] = useState(0)
    const [remark, setremark] = useState('NA')
    const [disableSubmitBtn, setdisableSubmitBtn] = useState(true)
    const [pendingSubmition, setpendingSubmition] = useState(true)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = new Date()
    let fromDate = `16-${months[d.getMonth()]}-${d.getFullYear()}`;
    let toDate = d.setDate(d.getDate() + 20);
    toDate = `15-${months[d.getMonth()]}-${d.getFullYear()}`;
    const [showAlert, setshowAlert] = useState(false)
    const [alertData, setalertData] = useState({})

    function copyTableLink() {
        let tableLink = window.location.href;
        navigator.clipboard.writeText(tableLink);
        alert('Link copied to clip')
    }
    function copyDivToClipboard() {
        var range = document.createRange();
        range.selectNode(document.getElementById("notSubmitted"));
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges(); // to deselect
        alert('Message copied to clip')
    }
    const handleLockReq = async () => {
        if (window.confirm('After locking you will not be able to edit data, are you sure to lock and submit ?')) {
            props.setProgress(10);
            let url = props.apiServer + `api-allStatements.php?section=${section}&lock=1&remark=${remark}`;
            let data = await fetch(url);
            props.setProgress(50);
            let parsedData = await data.json();
            props.setProgress(80);
            setlocked(parsedData.locked);
            setremark(parsedData.remark);
            props.setProgress(100);
        }
    }
    const getData = async () => {
        props.setProgress(10);
        let url = props.apiServer + `api-allStatements.php?section=${section}`;
        let data = await fetch(url);
        props.setProgress(50);
        let parsedData = await data.json();
        props.setProgress(80);
        setAbsentee(parsedData.absentee)
        setEmployees(parsedData.employees)
        setpendingSubmition(!(parsedData.employees.length === Object.keys(parsedData.absentee).length))
        setofficerName(parsedData.officerName)
        setinchargeName(parsedData.inchargeName)
        setinchargeEmpNo(parsedData.inchargeEmpNo)
        setlocked(parsedData.locked)
        setremark(parsedData.remark)
        props.setProgress(100);
    }
    useEffect(() => {
        if (!(props.logins.loggedinSection === section || props.logins.loggedinSection === 'admin')) {
            navigate('/login?section=' + section)
        } else {
            getData();
            if (Object.keys(props.alerts).length > 0) {
                setshowAlert(true)
                setalertData({ 'alertType': props.alerts.alertType, 'alertMessage': props.alerts.alertMessage })
                props.setalerts({})
            }
        }
    }, [])
    let sn = 0;
    let not_submitted = []
    let verifyPending = 0;
    let tableRows = employees.map((emp_name) => {
        let rows = [];
        if (absentee[emp_name.split('-')[0].trim()]) {
            sn = sn + 1;
            let leaveData = absentee[emp_name.split('-')[0].trim()][1];
            let totalSlots = leaveData.length;
            let verification = absentee[emp_name.split('-')[0].trim()][3];
            let verified = '';
            if (verification === 1)
                verified = 'text-success';
            else if (verifyPending === 0)
                verifyPending = 1;
            if (totalSlots > 0) {
                let date1 = new Date(leaveData[0][0]);
                let date2 = new Date(leaveData[0][1]);
                let Difference_In_Time = date2.getTime() - date1.getTime();
                let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
                let leaveDate = new Date(leaveData[0][0])
                let leaveFrom = leaveDate.getDate() + '-' + months[leaveDate.getMonth()] + '-' + leaveDate.getFullYear().toString().substring(2);
                leaveDate = new Date(leaveData[0][1])
                let leaveTo = leaveDate.getDate() + '-' + months[leaveDate.getMonth()] + '-' + leaveDate.getFullYear().toString().substring(2);
                rows.push(<tr key={emp_name.split('-')[0].trim() + '-0'} className={verified}>
                    <td rowSpan={totalSlots}>{sn} </td>
                    <td rowSpan={totalSlots}> {emp_name.split('-')[0].trim()}</td>
                    <td rowSpan={totalSlots}>{emp_name.split('-')[1].trim()} </td>
                    <td rowSpan={totalSlots}>REGULAR </td>
                    <td>{leaveData[0][2]}</td>
                    <td>{leaveFrom}</td>
                    <td>{leaveTo}</td>
                    <td>YES</td>
                    <td>{Difference_In_Days}</td>
                    <td rowSpan={totalSlots}>{officerName}</td>
                    <td rowSpan={totalSlots}><Link className='btn btn-outline-primary' to={`/view-screenshot?section=${section}&view_emp=${emp_name.split('-')[0].trim()}`}>View/Verify</Link></td>
                </tr>)
                for (var i = 1; i < totalSlots; i++) {
                    let date1 = new Date(leaveData[i][0]);
                    let date2 = new Date(leaveData[i][1]);
                    let Difference_In_Time = date2.getTime() - date1.getTime();
                    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
                    let leaveDate = new Date(leaveData[i][0])
                    let leaveFrom = leaveDate.getDate() + '-' + months[leaveDate.getMonth()] + '-' + leaveDate.getFullYear().toString().substring(2);
                    leaveDate = new Date(leaveData[i][1])
                    let leaveTo = leaveDate.getDate() + '-' + months[leaveDate.getMonth()] + '-' + leaveDate.getFullYear().toString().substring(2);
                    rows.push(<tr key={emp_name.split('-')[0].trim() + '-' + i} className={verified}>
                        <td>{leaveData[i][2]}</td>
                        <td>{leaveFrom}</td>
                        <td>{leaveTo}</td>
                        <td>YES</td>
                        <td>{Difference_In_Days}</td>
                    </ tr>)
                }
            }
            else {
                rows.push(<tr key={emp_name.split('-')[0].trim()} className={verified}>
                    <td>{sn}</td>
                    <td>{emp_name.split('-')[0].trim()}</td>
                    <td>{emp_name.split('-')[1].trim()}</td>
                    <td>REGULAR</td>
                    <td>NIL</td>
                    <td>NIL</td>
                    <td>NIL</td>
                    <td>NIL</td>
                    <td>NIL</td>
                    <td>{officerName}</td>
                    <td><Link className='btn btn-outline-primary' to={`/view-screenshot?section=${section}&view_emp=${emp_name.split('-')[0].trim()}`}>View/Verify</Link></td>
                </tr>)
            }
        } else {
            not_submitted.push(emp_name)
        }
        return rows;
    })

    return (
        <>
            <Navbar section={section} loggedinSection={props.logins.loggedinSection} setLogins={props.setLogins} />
            {showAlert && <Alert alertType={alertData.alertType} alertMessage={alertData.alertMessage} />}
            {(locked === 1) && <Alert alertType='success' alertMessage="Data locked and submitted, don't forget to Export Table in Excel and Download All Screenshots" />}
            <div className="container my-3 mb-5">
                <h4>Leave statements of all employees <span><button id='copyBtn' onClick={copyTableLink} className="btn btn-outline-primary btn-sm">Copy Link</button></span></h4>
                <div className="my-3 table-responsive">
                    <table id="table_id" className="table-bordered w-100 text-center">
                        <thead>
                            <tr>
                                <td colSpan='11' className='text-center fw-bold'>
                                    <h5>{section.toUpperCase()} Section Khyberpass Depot</h5>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='11' className='text-center fw-bold'>
                                    <h5>Leave statements from {fromDate} to {toDate}</h5>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='11'> .</td>
                            </tr>
                            {/* <!--<thead>--> */}
                            <tr>
                                <th>SN</th>
                                <th>Employee Number</th>
                                <th style={{ 'minWidth': '150px' }} >Employee Name</th>
                                <th>Type</th>
                                <th>Leave Type</th>
                                <th style={{ 'minWidth': '150px' }}>Leave From</th>
                                <th style={{ 'minWidth': '150px' }}>Leave Upto</th>
                                <th>Approved</th>
                                <th>No of Days</th>
                                <th>Approving Authority Name</th>
                                <th>View/Verify Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                    </table>
                    <a href={`export_statements.php?section=${section}`} className="mt-3 btn btn-primary">Export Table in Excel</a><br />
                    <a href={`zip_screenshots.php?section=${section}`} className="my-3 btn btn-primary">Download All Screenshots</a>
                </div>
                {(locked === 1) && <><p><b>Remark: </b>{remark}</p>
                    <Alert alertType='info' alertMessage={`Data locked and submitted by section incharge ${inchargeName.toUpperCase()} (${inchargeEmpNo})`} />
                </>}

                {(locked === 0) && <p><b>Note: </b> Data not submitted to HR</p>}
                {(verifyPending === 1) && <p><b>Note: </b>Entries shown with black fonts needs verification</p>}
                {/* showing lock data form */}
                {(locked === 0) && (verifyPending === 0) && (!pendingSubmition) && <>
                    <div className='form-check'>
                        <input type='checkbox' className='form-check-input' id='checkbtn' onChange={(e) => setdisableSubmitBtn(!e.target.checked)} />
                        <label className='form-check-label' htmlFor='checkbtn'>
                            <p className='text-danger'>I have carefully matched the leave statements and ESS applied leaves of above employees with attendance register. </p>
                        </label>
                    </div>
                    <label htmlFor='inchargeRemark' className='form-label float-start'>Remark</label>
                    <textarea className='form-control mb-3' value={remark} onChange={(e) => setremark(e.target.value)} rows='2'></textarea>
                    <button id='submitbtn' disabled={disableSubmitBtn} onClick={handleLockReq} className='btn btn-danger mb-3' >Lock & Submit Data</button>
                    <br />
                    <b>Section Incharge:</b> {inchargeName} <br />
                    <b>Employee Number:</b> {inchargeEmpNo}</>
                }
                {(not_submitted.length > 0) && <div className="my-3" id='notSubmitted'>
                    <h5 className='text-danger'>Leave statement not submitted by below employees <span><button className='btn btn-outline-primary btn-sm' onClick={copyDivToClipboard}>Copy Message</button></span></h5>
                    {not_submitted.map((emp, index) => {
                        return <div key={emp}><b>{index + 1}.</b> {emp} </div>
                    })}</div>
                }
            </div>
            <div className="text-center bg-dark text-light py-3 mt-5" style={{ 'marginBottom': '-300px' }}>
                Developer: satishkushwahdigital@gmail.com
            </div>
        </>
    )
}
