/*
* 作者：李健
* 邮箱：lj2690@163.com
* */


let isRun = false
const MaxRange = 1000000025

self.addEventListener('message', (event) => {
    if (event.data === 'stop') {
        isRun = false;
    } else {
        isRun = true;
        calculateEvenNumbers();
    }
});


function calculateEvenNumbers() {
    let minEvenNum = -1;
    let maxEvenNum = -1;
    let size = 0;
    //每处理一百万个数据就通知外面一次进度
    let batchSize = 1000000;
    for (let i = 1; i <= MaxRange; i++) {
        if (!isRun) {
            return;
        }
        if (i % 2 === 0) {
            if (minEvenNum === -1) {
                minEvenNum = i;
            }
            if (i > maxEvenNum) {
                maxEvenNum = i;
            }
            size++;
        }
        // 定期发送进度更新
        if (i % batchSize === 0 || i === MaxRange) {
            self.postMessage({
                type: 'progress',
                value: Math.floor((i / MaxRange) * 100)
            })
        }
    }
    self.postMessage({
        type: 'complete',
        size: size,
        min: minEvenNum,
        max: maxEvenNum
    });
}