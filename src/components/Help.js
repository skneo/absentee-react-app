import React, { useEffect } from 'react'
import Navbar from './Navbar'

export default function Help(props) {
    let url = new URL(window.location.href);
    let section = url.searchParams.get("section");
    document.title = "Help - " + section.toUpperCase();
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
    }, [])
    return (
        <>
            <Navbar section={section} loggedinSection={props.logins.loggedinSection} setLogins={props.setLogins} />
            <div className="container my-3">
                <h3 className="text-center"> Help</h3>
                <h4>Export Leave Statements table into excel</h4>
                <p>Export table into excel by clicking on "Export Table" button. </p>

                <h4>Forgot password</h4>
                <p>Contact HR to reset your password </p>

                <h4>Features available after login</h4>
                <p>1. Verify and hightlight the absentee data submitted by employee </p>
                <p>2. Edit the data submited by employee.</p>
                <p>3. Delete the leave statement of individual employee.</p>
                <p>4. Change login password.</p>

                <i className="text-danger fs-5">Developer: satishkushwahdigital@gmail.com</i>

            </div>
        </>
    )
}
