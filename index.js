const pathToFfmpeg = require('ffmpeg-static')
const cmd = require('node-cmd');
const fs = require('fs');
const os = require('os-utils');
if (!fs.existsSync('./temp')) {
    fs.mkdirSync('./temp')
}
bench_fullhd = 0
input='input.mp4'
cmd1080 = '$ffmpeg -re -i $input ' +
		   '-s 640x360   -b:v 500k temp/0-$name.mp4 ' +
		   '-s 854x480   -b:v 1M   temp/1-$name.mp4 ' +
		   '-s 1280x720  -b:v 2M   temp/2-$name.mp4 ' +
		   '-s 1920x1080 -b:v 3M   temp/3-$name.mp4'
cmd720 = '$ffmpeg -re -i $input ' +
		   '-s 640x360   -b:v 500k temp/0-$name.mp4 ' +
		   '-s 854x480   -b:v 1M   temp/1-$name.mp4 ' +
		   '-s 1280x720  -b:v 2M   temp/2-$name.mp4 ' +
		   '-s 1920x1080 -b:v 3M   temp/3-$name.mp4'
selected = bench_fullhd ? cmd1080 : cmd720
function start() {
    count++
    const name = (new Date()).getTime()
    console.time("name" + name)
	ffmpeg = selected.replace("$ffmpeg",pathToFfmpeg).replace("$input", input).split("$name").join(name)
    cmd.get(
        ffmpeg,
        function (err, data, stderr) {
            console.timeEnd("name" + name)
            console.log("finish")
            count--
        }
    );

}
step = 0
count = 0
setInterval(() => {
	os.cpuUsage(function (v) {
		if (step%3 == 0 && (count == 0 || ((v / count) + v) < 0.8)) {
			start()
		}
		console.log("%s task(s), CPU %d%%, RAM %d%%", count, (v*100).toFixed(0), (100 - os.freememPercentage()*100).toFixed(0))
		step++
	});
}, 2000)

