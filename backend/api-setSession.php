<?php
$section = $_GET['section'];
session_start();
include "$section/password.php";

if (isset($_GET['key'])) {
    if ($_GET['key'] === md5($password)) {
        $_SESSION[$section . 'loggedin'] = true;
        if ($section == 'admin') {
            header("Location: fill-leaves?section=admin");
        } else header("Location: all-statements?section=$section");
    }
}
