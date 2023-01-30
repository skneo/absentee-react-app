<?php
header("Access-Control-Allow-Origin: *");
$section = $_GET['section'];
//locking data
if (isset($_GET['lock'])) {
    //saving section lock status 
    $lock = $_GET['lock'];
    $lockStatus = file_get_contents("lockStatus.json");
    $lockStatus = json_decode($lockStatus, true);
    $lockStatus[$section] = 1;
    file_put_contents("lockStatus.json", json_encode($lockStatus));
    //saving remark 
    $remarks = file_get_contents("remarks.json");
    $remarks = json_decode($remarks, true);
    $remark = $_GET["remark"];
    $remarks[$section] = $remark;
    file_put_contents("remarks.json", json_encode($remarks));
    //zipping all screenshots
    date_default_timezone_set('Asia/Kolkata');
    $from = date('16-M-Y', strtotime('-1 month'));
    $to = date("15-M-Y");
    $zip_name = "zip_files/" . strtoupper($section) . "_ESS_screenshots_$from" . "_to_" . "$to" . ".zip";
    $showAlert = false;
    // Get real path for our folder
    $rootPath = realpath("$section/uploads");
    // Initialize archive object
    $zip = new ZipArchive();
    $zip->open($zip_name, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    // Create recursive directory iterator
    /** @var SplFileInfo[] $files */
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($rootPath),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($files as $name => $file) {
        // Skip directories (they would be added automatically)
        if (!$file->isDir()) {
            // Get real and relative path for current file
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);
            // Add current file to archive
            $zip->addFile($filePath, $relativePath);
        }
    }
    // Zip archive will be created only after closing object
    $zip->close();

    //saving copy of absentee data
    $absentee = file_get_contents("$section/absentee.json");
    $absentee = json_decode($absentee, true);
    $absentee_employees = array_keys($absentee);
    sort($absentee_employees);
    $sn = 1;
    $total_emp = count($absentee_employees);
    $absenteeArrray = array();
    $absenteeRow = array('SN', 'Employee Number', 'Employee Name', 'Leave Type', 'Leave From', 'Leave Upto');
    array_push($absenteeArrray, $absenteeRow);
    for ($i = 0; $i < $total_emp; $i++) {
        $emp_num = $absentee_employees[$i];
        $emp_data = $absentee[$emp_num];
        $emp_name = strtoupper($emp_data[0]);
        $leave_data   = $emp_data[1];
        $total_slots = count($leave_data);
        for ($j = 0; $j < $total_slots; $j++) {
            $absenteeRow = array();
            $row = $leave_data[$j];
            $from = date("d-M-y", strtotime($row[0]));
            $to = date("d-M-y", strtotime($row[1]));
            $leave_type = $row[2];
            array_push($absenteeRow, $sn, $emp_num, $emp_name, $leave_type, $from, $to);
            array_push($absenteeArrray, $absenteeRow);
        }
        if ($total_slots == 0) {
            $absenteeRow = array();
            array_push($absenteeRow, $sn, $emp_num, $emp_name, 'NIL', 'NIL', 'NIL');
            array_push($absenteeArrray, $absenteeRow);
        }
        $sn = $sn + 1;
    }
    date_default_timezone_set('Asia/Kolkata');
    $from = date('16-M-Y', strtotime('-1 month'));
    $to = date("15-M-Y");
    $fp = fopen("zip_files/" . strtoupper($section) . "_Absentee_$from" . "_to_" . "$to" . ".csv", 'w');
    foreach ($absenteeArrray as $fields) {
        fputcsv($fp, $fields);
    }
    fclose($fp);

    //web push notification
    $end_point = 'https://api.webpushr.com/v1/notification/send/all';
    $http_header = array(
        "Content-Type: Application/Json",
        "webpushrKey: 05dfa90eda322294084342fdd1b8cafe",
        "webpushrAuthToken: 40358"
    );
    $sectionCap = strtoupper($section);
    $req_data = array(
        'title'         => "Absentee submitted by $sectionCap section", //required
        'message'         => "View absentee data of $sectionCap by clicking on this notification", //required
        'target_url'    => "https://absentee.techtips.co.in/all_statements.php?section=$section", //required
        //following parameters are optional
        // 'name'		=> 'Test campaign',
        // 'icon'		=> 'https://cdn.webpushr.com/siteassets/wSxoND3TTb.png',
        // 'image'		=> 'https://cdn.webpushr.com/siteassets/aRB18p3VAZ.jpeg',
        //'auto_hide'	=> 1,
        //'expire_push'	=> '5m',
        //'send_at'		=> '2022-01-04 10:47 +5:30',
        //'action_buttons'=> array(	
        //array('title'=> 'Demo', 'url' => 'https://www.webpushr.com/demo'),
        //array('title'=> 'Rates', 'url' => 'https://www.webpushr.com/pricing')
        //)
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, $http_header);
    curl_setopt($ch, CURLOPT_URL, $end_point);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($req_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    // echo $response;
    $data = array();
    $data['locked'] = 1;
    $data['remark'] = $remark;
    echo json_encode($data);
    exit;
}

$absentee = file_get_contents("$section/absentee.json");
$absentee = json_decode($absentee, true);
//counting from employees.json
$employees = file_get_contents("$section/employees.json");
$employees = json_decode($employees, true);
//approvers
$approvers = file_get_contents("$section/approvers.json");
$approvers = json_decode($approvers, true);
$officerName = strtoupper($approvers['officerName']);
$inchargeName = $approvers['inchargeName'];
$inchargeEmpNo = $approvers['inchargeEmpNo'];
//lock status
$locked = 0;
$lockStatus = file_get_contents("lockStatus.json");
$lockStatus = json_decode($lockStatus, true);
if (array_key_exists($section, $lockStatus)) {
    $locked = $lockStatus[$section];
}
//incharge remark
$remark = 'NA';
$remarks = file_get_contents("remarks.json");
$remarks = json_decode($remarks, true);
if (array_key_exists($section, $remarks)) {
    $remark = $remarks[$section];
}
//preparing response
$data = array();
$data['absentee'] = $absentee;
$data['employees'] = $employees;
$data['officerName'] = $officerName;
$data['inchargeName'] = $inchargeName;
$data['inchargeEmpNo'] = $inchargeEmpNo;
$data['locked'] = $locked;
$data['remark'] = $remark;
echo json_encode($data);
