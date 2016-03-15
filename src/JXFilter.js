THREE.JX.JXFilter = {};

/**
 * @description: 灰度处理
 * @modify: 灰度算法改成加权平均值 (0.299, 0.578, 0.114)
 */


THREE.JX.JXFilter.toGray = function(imgData){
    var data = imgData.data;
    for(var i = 0,n = data.length;i < n;i += 4) {
                                                                                                                var gray = parseInt((0.299 * data[i] + 0.578 * data[i + 1] + 0.114 * data[i + 2]));                                                                                                   data[i + 2] = data[i + 1] = data[i] = gray;
                                                                                                                                                                 }

                                                                                                                 imgData.data = data;

                                                                                                                                 return imgData;
                                                                                                                                             }
                                                                 };



