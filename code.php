<?php
    //必须开启session
    session_start();
    if (abs($_POST['yzm'] - $_SESSION['code'])<5) {
        echo 1;
    } else {
        echo 2;
    }
 ?>