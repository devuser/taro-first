import Taro from "@tarojs/taro";
/**
 * 新增模块，从服务端获取地图相关信息
 * 
 */

 
// const serviceUrl = "http://148.70.162.74:80";
// const serviceUrl = "http://148.70.162.74:5008";
// const serviceUrl = "http://127.0.0.1:5002";
// update by devuser
const serviceUrl = "http://www.ai-story.com.cn:5008";
// update by devuser
const getMarkers = (res : any) => {
    const markers = [];
    for (const item of res.data.obj) {
        console.log(item);
        const marker = {
            iconPath: "/assets/images/erji7.png",
            id: item.id || 0,
            name: item.title || "",
            title: item.title || "",
            // tslint:disable-next-line: object-literal-sort-keys
            latitude: item.latitude,
            longitude: item.longitude,
            label: {
                anchorX: -20,
                anchorY: -16,
                content: item.title,
                // tslint:disable-next-line: object-literal-sort-keys
                color: "#ff0000",
                bgColor: "#ffcc00",
                textAlign: "center",
            },
            width: 50,
            height: 50,
        };
        console.log(`marker: ${marker}`);
        markers.push(marker);
    }
    return markers;
};

const getSubSpots = async (spotsid : number) => {
    let markers = [];
    try {
        const res = await Taro.request({
            url: serviceUrl + "/api/v1/getsubspots",
            // tslint:disable-next-line: object-literal-sort-keys
            data: {
                spotsid,
            },
            method: "POST",
        });
        markers = getMarkers(res);
    } catch (error) {
        console.log(error);
    }
    return markers;
};
export { getSubSpots, serviceUrl};