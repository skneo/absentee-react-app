<?php
header("Access-Control-Allow-Origin: *");
$section = $_GET['section'];
session_start();
if (isset($_SESSION[$section . 'loggedin'])) {
    $sectionLoggedIn = true;
} else {
    $sectionLoggedIn = false;
}

if (isset($_SESSION['adminloggedin'])) {
    $adminLoggedIn = true;
} else {
    $adminLoggedIn = false;
}

$data = array();
$data['adminLoggedIn'] = $adminLoggedIn;
$data['sectionLoggedIn'] = $sectionLoggedIn;
echo json_encode($data);
