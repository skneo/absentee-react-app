<?php
header("Access-Control-Allow-Origin: *");
$section = $_GET['section'];
function validateInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
$data = array();
//new entry
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //checking duplicate entry
    $absentee = file_get_contents("$section/absentee.json");
    $absentee = json_decode($absentee, true);
    $emp_num = validateInput(explode("-", $_POST['emp_name'])[0]);
    if (array_key_exists($emp_num, $absentee)) {
        $data['errorMessage'] = 'Error! Your leave statement already submitted, duplicate entry not allowed';
        echo json_encode($data);
        exit();
    }

    date_default_timezone_set('Asia/Kolkata');
    $timeStamp = date('Ymd-His');
    $emp_name = validateInput(explode("-", $_POST['emp_name'])[1]);
    $emp_num = validateInput(explode("-", $_POST['emp_name'])[0]);
    $temp = explode(".", $_FILES["fileToUpload"]["name"]);
    $newfilename = $emp_num . "-$timeStamp." . end($temp);
    $target_file = "$section/uploads/" . $newfilename;
    $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    // check file type
    if (!($file_type == 'jpg' or $file_type == 'jpeg' or $file_type == 'png')) {
        $data['errorMessage'] = 'Error, only .jpg , .jpeg and .png files are allowed to upload ! ';
        echo json_encode($data);
        exit();
    }
    // Check if file already exists
    else if (file_exists($target_file)) {
        $data['errorMessage'] = "Error! $target_file already exists";
        echo json_encode($data);
        exit();
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $filename = htmlspecialchars(basename($_FILES["fileToUpload"]["name"]));
            $absentee = file_get_contents("$section/absentee.json");
            $absentee = json_decode($absentee, true);
            if ($absentee == NULL)
                $absentee = array();
            $employee_record = array();
            array_push($employee_record, $emp_name);
            $leave_data = array();
            $total_rows = validateInput($_POST['total_rows']);
            for ($i = 0; $i < $total_rows; $i++) {
                $leave_type = "leave_type_" . $i;
                $from = "from_" . $i;
                $to = "to_" . $i;
                if ($_POST[$leave_type] != 'NA' and $_POST[$from] != '' and $_POST[$to] != '') {
                    $row = array();
                    array_push($row, validateInput($_POST[$from]), validateInput($_POST[$to]), validateInput($_POST[$leave_type]));
                    array_push($leave_data, $row);
                }
            }
            array_push($employee_record, $leave_data, $newfilename, 0); //0 for not verified
            $absentee[$emp_num] = $employee_record;
            file_put_contents("$section/absentee.json", json_encode($absentee));
            $emp_data = $employee_record;
            $emp_name = $emp_data[0];
            $leave_data   = $emp_data[1];
            $file_path   = $emp_data[2];
            // echo "<div class='alert alert-success alert-dismissible fade show py-2 mb-0' role='alert'>
            //     <strong >Leave statement saved of $emp_name, kindly check your submitted data below </strong>
            //     <button type='button' class='btn-close pb-2' data-bs-dismiss='alert' aria-label='Close'></button>
            // </div>";
            $data['errorMessage'] = 'none';
            echo json_encode($data);
            exit();
        } else {
            $data['errorMessage'] = 'none';
            echo json_encode('Error! your record not saved.');
            exit();
        }
    }
}
