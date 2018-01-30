<?php
//必须开启session
session_start();
class Verify {
	public $yn  = '00';
	public $num = '00';
}

$verify = new Verify();
if (abs($_POST['yzm']-$_SESSION['code']) < 5) {
	$verify->yn = 1;

} else {
	$verify->yn = 0;
}
$num  = rand(0, 99999999);
$verify->num = $num;
$_SESSION['num'] = $num;
echo json_encode($verify);
?>