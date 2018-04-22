const fs = require('fs');
const request = require('request');
const async = require('async');


let finishCount = 0; // 下载完成数
let totalLength = 0;

const data = [
  {
    url: "http://videooss.tan8.com/tan8video/ea/71/ea4f0e109789661227e771f1fa8ac071/ea4f0e109789661227e771f1fa8ac071_2.mp4",
    title: "第1课-文武贝的一封信"
  },
  {
    url: "http://videooss.tan8.com/tan8video/aa/bc/aae0035e896b647edc317f8ff7f457bc/aae0035e896b647edc317f8ff7f457bc_2.mp4",
    title: "第2课-预备课 10分钟学会基本乐理"
  },
  {
    url: "http://videooss.tan8.com/tan8video/71/57/71d7cb8cbc765d15076f0d79dfade057/71d7cb8cbc765d15076f0d79dfade057_2.mp4",
    title: "3 - 音的长度该如何表示？"
  },
  {
    url: "http://videooss.tan8.com/tan8video/5f/4e/5f3e4a7081ed3fce787babcf57f2564e/5f3e4a7081ed3fce787babcf57f2564e_2.mp4",
    title: "4 - 调"
  },
  {
    url: "http://videooss.tan8.com/tan8video/0f/6e/0fef886f997db07fe2a2f9f2c10d7e6e/0fef886f997db07fe2a2f9f2c10d7e6e_2.mp4",
    title: "5 - 作业- 简谱练习"
  },
  {
    url: "http://videooss.tan8.com/tan8video/93/15/937d21bc0cfe51d4a542a5168a41f015/937d21bc0cfe51d4a542a5168a41f015_2.mp4",
    title: "6 - 作业- 音名练习"
  }
];


/**
 * 下载视频
 * @param dirPath
 * @param url
 * @param filename
 * @returns {Promise}
 */
const downloadByUrl = function (dirPath, url, filename) {

  return new Promise((resolve, reject) => {
    let httpStream = request({
      url: url,
      method: 'GET',
    });

    const writeStream = fs.createWriteStream(dirPath+filename);

    httpStream.pipe(writeStream);

    httpStream.on('response', (response) => {
      console.log(`开始下载: ${filename}`);
    });

    httpStream.on('data', (chunk) => {
       totalLength += chunk.length;
       // console.log('recevied data size: ' + totalLength + 'KB');
    });

    writeStream.on('close', function() {
      finishCount++;
      console.log('第' + finishCount + '个视频下载完成,视频大小为：'+ Math.ceil(totalLength/(1024*1024))+'M');
      totalLength = 0;
      resolve();
    })
  })

};

// 遍历JSon 下载
async.mapSeries(data, function (item, callback) {
  console.log(item);

  downloadByUrl('./video/', item.url, `${item.title}.mp4`)
    .then(function () {
      callback(null)
    });
});


process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging, throwing an error, or other logic here
});

/*
 ➜  tool git:(master) ✗ node download1.js
 { url: 'http://videooss.tan8.com/tan8video/ea/71/ea4f0e109789661227e771f1fa8ac071/ea4f0e109789661227e771f1fa8ac071_2.mp4',
 title: '第1课-文武贝的一封信' }
 开始下载: 第1课-文武贝的一封信.mp4
 第1个视频下载完成,视频大小为：28.27727508544922M
 { url: 'http://videooss.tan8.com/tan8video/aa/bc/aae0035e896b647edc317f8ff7f457bc/aae0035e896b647edc317f8ff7f457bc_2.mp4',
 title: '第2课-预备课 10分钟学会基本乐理' }
 开始下载: 第2课-预备课 10分钟学会基本乐理.mp4
 第2个视频下载完成,视频大小为：37.41847610473633M
 { url: 'http://videooss.tan8.com/tan8video/71/57/71d7cb8cbc765d15076f0d79dfade057/71d7cb8cbc765d15076f0d79dfade057_2.mp4',
 title: '3 - 音的长度该如何表示？' }
 开始下载: 3 - 音的长度该如何表示？.mp4
 第3个视频下载完成,视频大小为：3.3686304092407227M
 { url: 'http://videooss.tan8.com/tan8video/5f/4e/5f3e4a7081ed3fce787babcf57f2564e/5f3e4a7081ed3fce787babcf57f2564e_2.mp4',
 title: '4 - 调' }
 开始下载: 4 - 调.mp4
 第4个视频下载完成,视频大小为：2.4233970642089844M
 { url: 'http://videooss.tan8.com/tan8video/0f/6e/0fef886f997db07fe2a2f9f2c10d7e6e/0fef886f997db07fe2a2f9f2c10d7e6e_2.mp4',
 title: '5 - 作业- 简谱练习' }
 开始下载: 5 - 作业- 简谱练习.mp4
 第5个视频下载完成,视频大小为：0.7606744766235352M
 { url: 'http://videooss.tan8.com/tan8video/93/15/937d21bc0cfe51d4a542a5168a41f015/937d21bc0cfe51d4a542a5168a41f015_2.mp4',
 title: '6 - 作业- 音名练习' }
 开始下载: 6 - 作业- 音名练习.mp4
 第6个视频下载完成,视频大小为：1.3307380676269531M
 */
