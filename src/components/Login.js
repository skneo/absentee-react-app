import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

export default function Login(props) {
    let url = new URL(window.location.href);
    let section = url.searchParams.get("section");
    document.title = "Login - " + section.toUpperCase();
    const [loginFailed, setLoginFailed] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(props.apiServer + `api-login.php?section=${section}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle data
                setPassword("");
                props.setLogins({ 'loggedinSection': data.loggedinSection, 'adminKey': data.adminKey });
                document.cookie = "loggedinSection=" + data.loggedinSection;
                document.cookie = "adminKey=" + data.adminKey;
                if (data.loggedinSection === 'admin') {
                    navigate('/fill-leaves?section=admin')
                } else if (data.loggedinSection === section) {
                    navigate('/all-statements?section=' + section)
                }
                setLoginFailed(data.loggedinSection !== section);
            })
            .catch((err) => {
                // console.log(err.message);
            });
    };
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
        let loggedinSection = getCookie('loggedinSection')
        let adminKey = getCookie('adminKey')
        if (loggedinSection !== 'none') {
            props.setLogins({ 'loggedinSection': loggedinSection, 'adminKey': adminKey });
            if (loggedinSection === 'admin') {
                navigate('/fill-leaves?section=admin')
            } else if (loggedinSection === section) {
                navigate('/all-statements?section=' + section)
            }
        }
    }, [])

    return (
        <>
            <Navbar section={section} loggedinSection={props.logins.loggedinSection} setLogins={props.setLogins} />
            {/* alert */}
            {loginFailed && <div className='alert alert-danger alert-dismissible fade show py-2 mb-0' role='alert'>
                <strong >Wrong password</strong>
                <button type='button' className='btn-close pb-2' data-bs-dismiss='alert' aria-label='Close'></button>
            </div>}
            <center>
                <div className="mt-5 ">
                    <form onSubmit={handleSubmit}>
                        <input type="password" name="password" className="form-control mb-3 mt-5" style={{ width: "200px" }} placeholder="enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit" className="btn btn-primary " style={{ width: "200px" }}>Login </button>
                    </form>
                </div>
            </center>
        </>
    )

}
