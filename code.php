<?php
    //必须开启session
    session_start();
    if ($_POST['yzm'] != $_SESSION['code']) {
        echo 0;
    } else {
        echo 1;
    }
 ?>