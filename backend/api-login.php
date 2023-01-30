<?php
header("Access-Control-Allow-Origin: *");
$section = $_GET['section'];

$loginTried = false;
$loggedinSection = 'none';
$adminKey = 'none';
include "$section/password.php";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $loginTried = true;
    $postData = json_decode(file_get_contents("php://input"));
    $userPassword  =   $postData->password;
    if ($userPassword === $password) {
        $loggedinSection = $section;
        if ($section == 'admin') {
            $adminKey = md5($userPassword);
        }
        // if ($section == 'admin') {
        //     header("Location: fill_leaves.php?section=admin");
        // } else header("Location: all_statements.php?section=$section");
    }
}


$data = array();
$data['loggedinSection'] = $loggedinSection;
$data['adminKey'] = $adminKey;
$data['loginTried'] = $loginTried;

echo json_encode($data);
