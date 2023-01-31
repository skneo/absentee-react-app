import React, { useState, useEffect } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom'
import Alert from './Alert';

export default function FillLeaves(props) {
    let url = new URL(window.location.href);
    let section = url.searchParams.get("section");
    const navigate = useNavigate();
    // console.log(section);
    document.title = "Fill Leave Statements - " + section.toUpperCase();
    const [deletedFiles, setDeletedFiles] = useState(0);
    const [not_submitted, setNot_submitted] = useState([]);
    const [formData, setFormData] = useState({ 'emp_name': '-- Select your name --', 'from_0': '', 'to_0': '', 'leave_type_0': 'NA', 'total_rows': 1 })
    const [leaveRows, setLeaveRows] = useState([0])
    const [errorMessage, seterrorMessage] = useState('none')
    const [disableSubmitBtn, setdisableSubmitBtn] = useState(true)
    const [allSubmitted, setallSubmitted] = useState(false)

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(values => ({ ...values, [name]: value }))
        // console.log(formData)
    }

    function addRows() {
        let rows = leaveRows;
        setLeaveRows(rows.concat(formData.total_rows))
        setFormData(values => ({ ...values, [`from_${formData.total_rows}`]: '', [`to_${formData.total_rows}`]: '', [`leave_type_${formData.total_rows}`]: 'NA', }))
        setFormData(values => ({ ...values, ['total_rows']: formData.total_rows + 1 }))
        // console.log(formData)
    }
    const handleSubmit = () => {
        if (window.confirm('Sure to submit?') && formData.emp_name !== '-- Select your name --') {
            document.getElementById('pageLoader').classList.remove('d-none');
            // event.preventDefault();
            // console.log(formData)
            const fileInput = document.querySelector('#fileToUpload');
            const fData = new FormData();
            fData.append('fileToUpload', fileInput.files[0]);
            fData.append('emp_name', formData.emp_name)
            fData.append('total_rows', formData.total_rows)
            for (let i = 0; i < formData.total_rows; i++) {
                fData.append('from_' + i, formData['from_' + i])
                fData.append('to_' + i, formData['to_' + i])
                fData.append('leave_type_' + i, formData['leave_type_' + i])
            }
            const options = {
                method: 'POST',
                body: fData,
                // If you add this, upload won't work
                // headers: {
                //   'Content-Type': 'multipart/form-data',
                // }
            };
            // console.log(options)
            fetch(props.apiServer + 'api-saveLeaves.php?section=' + section, options)
                .then((response) => response.json())
                .then((data) => {
                    // Handle data
                    setLeaveRows([0]);
                    setFormData({ 'emp_name': '-- Select your name --', 'from_0': '', 'to_0': '', 'leave_type_0': 'NA', 'total_rows': 1 })
                    if (data.errorMessage !== 'none') {
                        seterrorMessage(data.errorMessage)
                    } else {
                        navigate('/view-screenshot?section=' + section + '&view_emp=' + formData.emp_name.split('-')[0].trim())
                    }
                })
                .catch((err) => {
                    // console.log(err.message);
                    seterrorMessage('Error occurred')
                });
        }
    }
    const getData = async () => {
        props.setProgress(10);
        let url = props.apiServer + `api-fillLeaves.php?section=${section}&adminKey=${props.logins.adminKey}`;
        let data = await fetch(url);
        props.setProgress(50);
        let parsedData = await data.json();
        props.setProgress(80);
        setNot_submitted(parsedData.not_submitted)
        setDeletedFiles(parsedData.deletedFiles)
        if (parsedData.not_submitted.length === 0) {
            setallSubmitted(true)
        }
        props.setProgress(100);
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
    function copyDivToClipboard() {
        var range = document.createRange();
        range.selectNode(document.getElementById("notSubmitted"));
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges(); // to deselect
        alert('Message copied to clip')
    }
    function validateFile() {
        let fileSize = document.getElementById('fileToUpload').files[0].size / (1024);
        if (fileSize < 1024) {
            setdisableSubmitBtn(false)
            document.getElementById("fileErrror").style.display = "none";
        } else {
            setdisableSubmitBtn(true)
            document.getElementById("fileErrror").style.display = "block";
        }
    }

    return (
        <>
            <Navbar section={section} loggedinSection={props.logins.loggedinSection} setLogins={props.setLogins} />
            {/* deleted files */}
            {(errorMessage !== 'none') && <Alert alertType='danger' alertMessage={errorMessage} />}
            {(deletedFiles !== 0) && <Alert alertType='success' alertMessage={`${deletedFiles} files older than 100 days deleted from Old Data`} />}
            {allSubmitted && <Alert alertType='success' alertMessage='Leave statement submitted by all employees' />}
            <div className='alert alert-info py-2' role='alert'>
                <strong>स्क्रीनशॉट Crop करके ही अपलोड करें <a target='_blank' href="sample.jpg">( सैंपल देखें )</a></strong>
            </div>
            <div className="container mb-3">
                <h4>Fill Leave Statement</h4>
                {/* <form encType="multipart/form-data" onSubmit={handleSubmit}> */}
                <div className='mb-3 mt-3'>
                    <label htmlFor='emp_name' className='form-label float-start'>Employee Name</label>
                    <select className="form-select" name='emp_name' id='emp_num' value={formData.emp_name} onChange={handleChange} required>
                        <option key='-- Select your name --' > -- Select your name -- </option>
                        {not_submitted.map((element) => {
                            return <option key={element}>{element}</option>
                        })}
                    </select>
                </div>
                <div className='mb-3 table-responsive'>
                    <label htmlFor='emp_num' className='form-label float-start '>Leave Data <small className="form-text text-muted">( छुट्टी नहीं ली तो खाली छोड़ दें ) </small>
                    </label>
                    <table className="table-light table table-striped table-bordered w-100">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th style={{ 'minWidth': '150px' }}>Type of leave</th>
                            </tr>
                        </thead>
                        <tbody id='tableBody'>
                            {leaveRows.map((row) => {
                                return <tr key={row}>
                                    <td><input type='date' value={formData['from_' + row] || ''} onChange={handleChange} className='form-control' name={'from_' + row} /></td>
                                    <td><input type='date' value={formData['to_' + row] || ''} onChange={handleChange} className='form-control' name={'to_' + row} /></td>
                                    <td>
                                        <select value={formData['leave_type_' + row] || 'NA'} onChange={handleChange} className='form-select' name={'leave_type_' + row}>
                                            <option>NA</option>
                                            <option>HALF CL</option>
                                            <option>CL</option>
                                            <option>LAP</option>
                                            <option>RH</option>
                                            <option>LHAP (Com.)</option>
                                            <option>LHAP (Half)</option>
                                            <option>PL</option>
                                            <option>ML</option>
                                            <option>CCL</option>
                                            <option>SCL</option>
                                            <option>IOD</option>
                                            <option>QRTL</option>
                                            <option>EOL</option>
                                            <option>LWP</option>
                                            <option>LND</option>
                                            <option>OTHER</option>
                                        </select>
                                    </td>
                                </tr>
                            })
                            }
                        </tbody>
                    </table>
                    <button onClick={addRows} className="btn btn-info btn-sm" id='add_row'>Add Row</button>
                </div>
                <div className='mb-3'>
                    <label htmlFor='fileToUpload' className='form-label float-start'>ESS Screenshot (size less than 1 Mb) <div className="form-text text-muted"> अगर आपने कोई छुट्टी नहीं ली फिर भी ESS का स्क्रीनशॉट अपलोड करें </div></label>
                    <input type='file' className='form-control' id='fileToUpload' name='fileToUpload' required onChange={validateFile} />
                    <div className='text-danger' id='fileErrror' style={{ 'display': 'none' }}>File size is greater than 1 Mb</div>
                    <div className='form-text text-muted'>स्क्रीनशॉट Crop करके अपलोड करें जिसमें सिर्फ आपका नाम और अप्लाई की हुई छुट्टियाँ ही दिखें <a target='_blank' href='sample.jpg'>( सैंपल देखें ) </a></div>
                </div>
                <center>
                    <button disabled={disableSubmitBtn} onClick={handleSubmit} className='btn btn-primary px-5' id='submitBtn' >Submit</button>
                </center>
                {/* </form> */}
                <div className="d-flex justify-content-center my-3 d-none" id="pageLoader">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                {/* <!-- leave statement not submitted  --> */}
                {(not_submitted.length !== 0) && <div className="my-5" id='notSubmitted'>
                    <hr />
                    <h5 className='text-danger'>Leave statement not submitted by below employees <span><button className='btn btn-outline-primary btn-sm' onClick={copyDivToClipboard}>Copy Message</button></span></h5>
                    {not_submitted.map((element, index) => {
                        return <div key={element}><b>{index + 1}. </b>{element} </div>
                    })}
                </div>}
            </div>
            {/* show if admin loggedn in */}
            {/* {false && <script>(function(w,d, s, id) {if(typeof(w.webpushr)!=='undefined') return;w.webpushr=w.webpushr||function(){(w.webpushr.q = w.webpushr.q || []).push(arguments)};var js, fjs = d.getElementsByTagName(s)[0];js = d.createElement(s); js.id = id;js.async=1;js.src = \"https://cdn.webpushr.com/app.min.\";fjs.parentNode.appendChild(js);}(window,document, 'script', 'webpushr-jssdk'));webpushr('setup',{'key':'BO1cmyevzFd0zZtMTX6vPdBWCQsOh0rIp7ppuImPY1-WzfDk6NOpZlq3r_iMizmudV5S0-pswSO6tV7VgtFRfJs' });</script>} */}
            <div className="text-center bg-dark text-light py-3 mt-5" style={{ 'marginBottom': '-300px' }}>
                Developer: satishkushwahdigital@gmail.com
            </div>
        </>
    )
}
