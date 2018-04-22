const fs = require('fs');
const request = require('request');
const data = require('../json/beauty1.json');
const async = require('async');


let TotalCount = 1; // 建立连接数
let finishCount = 0; // 下载完成数


/**
 * 创建目录
 * @param folder
 * @returns {Promise}
 */
const createFolder = function (folder) {

  return new Promise((resolve, reject) => {

    const dirPath = `video/${folder}/`;
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      resolve(dirPath);
    } else {
      reject(`目录 video/${folder} 已经存在！！！`);
    }
  })
};

/**
 * 下载视频
 * @param dirPath
 * @param url
 * @param filename
 * @returns {Promise}
 */
const downloadByUrl = function (dirPath, url, filename) {

  let httpStream = request({
    url: url,
    method: 'GET',
  });

  const writeStream = fs.createWriteStream(dirPath+filename);

  httpStream.pipe(writeStream);

  httpStream.on('response', (response) => {
    console.log(`当前连接数: ${TotalCount}  开始下载: ${filename}  地址:  ${url}`);
    TotalCount++;
  });

  writeStream.on('close', function() {
    finishCount++;
    console.log('第' + finishCount + '个视频  ' + filename + '  下载完成')
  })
};

// 遍历JSon 下载
async.mapSeries(data.result, function (item, callback) {
  // console.log(item);
  const folder = item.title;
  createFolder(folder)
    .then(function (dirPath) {
      console.log(dirPath);
      async.mapSeries(item.contentList, function (conItem, callback) {
        const url = conItem.video;
        console.log(url);
        const filename = `${conItem.title}.mp4`;
        downloadByUrl(dirPath, url, filename)
        callback(null, filename)
      });
      callback(null, dirPath);
    })
    .catch((error) => {
      throw error;
    })
});


process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging, throwing an error, or other logic here
});
