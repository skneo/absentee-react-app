<?php
header("Access-Control-Allow-Origin: *");
$lockStatus = file_get_contents("lockStatus.json");
$lockStatus = json_decode($lockStatus, true);
$totalEmployees = 0;
$sections = array();
foreach (glob('./*', GLOB_ONLYDIR) as $dir) {
    $dirname = basename($dir);
    if ($dirname == '__MACOSX' || $dirname == 'zip_files' || $dirname == 'static' || $dirname == 'subdomains')
        continue;
    // $displayDir = strtoupper(($dirname));
    $employees = file_get_contents("$dirname/employees.json");
    $employees = json_decode($employees, true);
    $totalEmployees = $totalEmployees + count($employees);
    $btnClass = 'btn-outline-primary';
    if (array_key_exists($dirname, $lockStatus)) {
        if ($lockStatus[$dirname] == 1) {
            $btnClass = 'btn-success';
            // $displayDir = $displayDir . " - <i class='bi bi-lock'></i>";
        }
    }
    $section = array();
    $section['dirname'] = $dirname;
    $section['btnClass'] = $btnClass;
    // $section['displayDir'] = $displayDir;
    array_push($sections, $section);
}
$data = array();
$data['sections'] = $sections;
$data['totalEmployees'] = $totalEmployees;
echo json_encode($data);
