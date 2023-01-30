<?php
header("Access-Control-Allow-Origin: *");

$section = $_GET['section'];
$adminKey = $_GET['adminKey'];
include "admin/password.php";
//deleting files older than 100 days
$deletedFiles = 0;
if ($adminKey == md5($password)) {
    date_default_timezone_set('Asia/Kolkata');
    if ($handle = opendir("zip_files")) {
        while (false !== ($file = readdir($handle))) {
            if ($file != "." && $file != "..") {
                if ($file == "index.php")
                    continue;
                $ctime = filectime("zip_files/$file");
                $fileDate = date("Y-m-d", $ctime);
                $currentDate = date("Y-m-d");
                $fileDeleteDate = date('Y-m-d', strtotime($fileDate . ' + 100 days'));
                if ($fileDeleteDate < $currentDate) {
                    $filePath = "zip_files/$file";
                    unlink($filePath);
                    $deletedFiles = $deletedFiles + 1;
                }
            }
        }
    }
}
//employees who did not submit absentee
$employees = file_get_contents("$section/employees.json");
$employees = json_decode($employees, true);
$absentee = file_get_contents("$section/absentee.json");
$absentee = json_decode($absentee, true);
$not_submitted = array();
for ($i = 0; $i < count($employees); $i++) {
    $emp = $employees[$i];
    $emp_num = trim(explode("-", $emp)[0]);
    if (array_key_exists($emp_num, $absentee)) {
        continue;
    }
    array_push($not_submitted, $employees[$i]);
    // echo "<option>$emp</option>";
}
$data = array();
$data['deletedFiles'] = $deletedFiles;
$data['not_submitted'] = $not_submitted;
echo json_encode($data);
