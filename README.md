# 图片滑动解锁

## 介绍

![img1](img/2.png)

滑动解锁作为一种较新的验证方式,以其方便快捷简单的特点,迅速成为目前较为流行的验证方式;而图片滑动解锁比滑动解锁更加高效安全,成为现代最为流行的用户验证方式

![img2](img/1.png)

###  本组件3基于 ArronYR / slideunlock-plugin (github) 滑动解锁组件;进行升级开发,实现了图片滑动解锁的核心功能


![img3](img/3.png)
## 主要代码
### 图片的绘制
```
header('Content-Type: image/png');
session_start();
$image = imagecreatetruecolor(360, 60);
$bgcolor = imagecolorallocate($image, 255, 255, 255);
imagefill($image, 0, 0, $bgcolor);
for ($i = 0;$i < 1000;$i++) {
    $pointcolor = imagecolorallocate($image, rand(0, 255), rand(0, 255), rand(0, 255));
    imagesetpixel($image, rand(0, 359), rand(0, 59), $pointcolor);
}
for ($i = 0;$i < 10;$i++) {
    $linecolor = imagecolorallocate($image, rand(100, 200), rand(100, 200), rand(100, 200));
    imageline($image, rand(0, 359), 0, rand(0, 359),  59, $linecolor);
}

$bgcolor = imagecolorallocate($image, rand(100, 200), rand(100, 200), rand(100, 200));
$x = rand(30, 300);
$_SESSION['code'] = $x;
$x2 = $x + 30;
imagefilledrectangle($image, $x, 15, $x2, 45, $bgcolor);
imagepng($image);
imagedestroy($image);

```
### 滑动位置检测,登录状态记忆
```
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
```

## 文件地址

[github](https://github.com/jxj322991/verify_user)

## 演示地址

[点击](http://jxjweb.sc2yun.com/verify/)