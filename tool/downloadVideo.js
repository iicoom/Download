// const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
// const superagent = require('superagent');
const data = require('../json/beauty1.json');


let TotalCount = 1; // 建立连接数
let finishCount = 0; // 下载完成数

// const getYou = function (folder, url, filename, callback) {
//
//     // return new Promise((resolve, reject) => {
//     //
//     // })
//     const dirPath = `video/${folder}/`;
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath);
//     }
//
//     console.log('开始下载第' + TotalCount + '个视频  ' + filename + ' 地址: ' + url);
//
//     const writeStream = fs.createWriteStream(dirPath+filename);
//
//     const req = superagent.get(url)
//     req.pipe(writeStream);
//
//     writeStream.on('close', function() {
//         callback(filename);
//     })
// }

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

    return new Promise((resolve, reject) => {
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
        // console.log('第' + finishCount + '个视频  ' + filename + '  下载完成')
        resolve(finishCount);
      })
    })
};

// 遍历JSon 下载
data.result.forEach((item) => {
  const folder = item.title;
  createFolder(folder)
    .then(function (dirPath) {
      item.contentList.forEach((conItem) => {
        const url = conItem.video;
        const filename = `${conItem.title}.mp4`;
        downloadByUrl(dirPath, url, filename)
          .then(function (finishCount) {
            console.log('第' + finishCount + '个视频  ' + filename + '  下载完成')
          })
      })
    })
});

// const getYou = function (folder, url, filename) {
//
//     return new Promise((resolve, reject) => {
//
//         const dirPath = `video/${folder}/`;
//         if (!fs.existsSync(dirPath)) {
//             fs.mkdirSync(dirPath);
//         }
//
//         let httpStream = request({
//             url: url,
//             method: 'GET',
//         });
//
//         const writeStream = fs.createWriteStream(dirPath+filename);
//
//         httpStream.pipe(writeStream);
//
//         let totalLength = 0;
//
//         // 当获取到第一个HTTP请求的响应获取
//         httpStream.on('response', (response) => {
//             // console.log('response headers is: ', response.headers);
//             console.log(`当前连接数: ${TotalCount}  开始下载: ${filename}  地址:  ${url}`);
//             TotalCount++;
//         });
//
//         // httpStream.on('data', (chunk) => {
//         //     totalLength += chunk.length;
//         //     console.log('recevied data size: ' + totalLength + 'KB');
//         // });
//
//         writeStream.on('close', function() {
//             finishCount++;
//             console.log('第' + finishCount + '个视频  ' + filename + '  下载完成')
//         })
//
//     })
// };



// 开始下载
// data.result.forEach((item) => {
//     const folder = item.title;
//     item.contentList.forEach((index) => {
//         const url = index.video;
//         const filename = `${index.title}.mp4`;
//         getYou(folder, url, filename)
//     })
// })

