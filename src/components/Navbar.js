import React from 'react'
import { Link } from 'react-router-dom'
export default function Navbar(props) {
    function logout() {
        props.setLogins({ 'loggedinSection': 'none', 'adminKey': 'none' })
        document.cookie = "loggedinSection=" + 'none';
        document.cookie = "adminKey=" + 'none';
        window.open(`logout.php?section=${props.loggedinSection}`, "_self")
    }
    return (
        <>
            <nav className='navbar navbar-expand-lg navbar-dark bg-dark fixed-top'>
                <div className='container-fluid text-center'>
                    <Link className='navbar-brand active' to='/'>Absentee</Link>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            <li className='nav-item'>
                                <Link className='nav-link active ' aria-current='page' to='/'>Home</Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link active ' aria-current='page' to={`/fill-leaves?section=${props.section}`}>New Entry</Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link active ' aria-current='page' to={`/all-statements?section=${props.section}`}>View All</Link>
                            </li>
                            {/* adminloggedin */}
                            {(props.loggedinSection === 'admin') && <>
                                <li className='nav-item'>
                                    <a className='nav-link active ' aria-current='page' href={`edit_employees.php?section=${props.section}`}>Edit Employees</a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link active' aria-current='page' href={`change_approvers.php?section=${props.section}`}>Change Approvers</a>
                                </li>
                            </>
                            }
                            <li className='nav-item'>
                                <Link className='nav-link active ' aria-current='page' to={`/help?section=${props.section}`}>Help</Link>
                            </li>
                        </ul>
                        {/* adminloggedin */}
                        {(props.loggedinSection === 'admin') &&
                            <div className='btn-group '>
                                <button id='userMenu' type='button' className='btn btn-success dropdown-toggle mx-3' data-bs-toggle='dropdown' aria-expanded='false' value=''>
                                    Admin Menu
                                </button>
                                <ul className='dropdown-menu dropdown-menu-lg-end'>
                                    <li><a className='dropdown-item ' href='export_all_sections.php?section=admin'>Export All Sections</a></li>
                                    <li><a href='unlock.php?section=admin' className='dropdown-item' >Lock/Unlock Data</a></li>
                                    <li><a className='dropdown-item ' href='delete_statements.php?section=admin'>Delete Absentee Data</a></li>
                                    <li><a href='all_screenshots.php?section=admin' className='dropdown-item'>Old Data</a></li>
                                    <li><a href='reset_password.php?section=admin' className='dropdown-item' >Reset others's Password</a></li>
                                    <li><a className='dropdown-item ' href='add_delete_section.php?section=admin'>Add/Delete Section</a></li>
                                    <li><a className='dropdown-item ' href='notifications.php?section=admin'>Enable Notifications</a></li>
                                    <li><button className='dropdown-item ' onClick={logout}>Logout Admin</button></li>
                                </ul>
                            </div>
                        }
                        {/* section not loggenin */}
                        {(props.loggedinSection !== props.section) && <Link to={`/login?section=${props.section}`} className='btn btn-primary' >Login</Link>}
                        {/*  login */}
                        {(props.loggedinSection === props.section) && <div className='btn-group '>
                            <button id='userMenu' type='button' className='btn btn-success dropdown-toggle ' data-bs-toggle='dropdown' aria-expanded='false' value=''>
                                {props.section.toUpperCase()}
                            </button>
                            <ul className='dropdown-menu dropdown-menu-lg-end'>
                                <li><a className='dropdown-item ' href={`change_password.php?section=${props.section}`}>Change Password</a></li>
                                <li><button className='dropdown-item' onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                        }

                    </div>
                </div>
            </nav>
            <div className="text-center text-primary h4" style={{ 'paddingTop': '60px' }}>
                Section: {props.section.toUpperCase()}
            </div>
        </>
    )
}
Navbar.defaultProps = {
    section: "Section-NA",
    loggedinSection: 'none',
}