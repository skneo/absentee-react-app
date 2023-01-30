<?php
header("Access-Control-Allow-Origin: *");
$section = $_GET['section'];
//view data
if (isset($_GET['view_emp'])) {
    $emp_num = $_GET['view_emp'];
    $absentee = file_get_contents("$section/absentee.json");
    $absentee = json_decode($absentee, true);
    if (!(array_key_exists($emp_num, $absentee))) {
        echo json_encode(['NA', [], 'NA', 0]);
        exit();
    }
    $emp_data = $absentee[$emp_num];
    //checking lock status
    $lock = 0;
    $lockStatus = file_get_contents("lockStatus.json");
    $lockStatus = json_decode($lockStatus, true);
    if (array_key_exists($section, $lockStatus)) {
        $lock = $lockStatus[$section];
    }
    $data = array();
    $data['lock'] = $lock;
    $data['emp_data'] = $emp_data;
    echo json_encode($data);
}
//data verification
else if (isset($_GET['verify_data'])) {
    $emp_num = $_GET['verify_data'];
    $verified = false;
    $absentee = file_get_contents("$section/absentee.json");
    $absentee = json_decode($absentee, true);
    $emp_data = $absentee[$emp_num];
    $emp_data[3] = 1;
    $absentee[$emp_num] = $emp_data;
    $emp_name = $emp_data[0];
    file_put_contents("$section/absentee.json", json_encode($absentee));
    $data = array();
    $verified = true;
    $data['verified'] = $verified;
    echo json_encode($data);
}
//delete
else if (isset($_GET['delete'])) {
    $emp_num = $_GET['delete'];
    $deleted = false;
    $absentee = file_get_contents("$section/absentee.json");
    $absentee = json_decode($absentee, true);
    $emp_data = $absentee[$emp_num];
    $file = $emp_data[2];
    $emp_name = $emp_data[0];
    if (file_exists("$section/uploads/" . $file)) {
        unlink("$section/uploads/" . $file);
    }
    unset($absentee[$emp_num]);
    file_put_contents("$section/absentee.json", json_encode($absentee));
    $data = array();
    $deleted = true;
    $data['deleted'] = $deleted;
    echo json_encode($data);
}
