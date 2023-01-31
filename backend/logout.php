<?php
$section = $_GET['section'];
session_start();
session_destroy();
header("Location: all-statements?section=$section");
