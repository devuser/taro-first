import Taro, { Component, Config } from "@tarojs/taro";
import { CoverImage, CoverView, Map, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
// import Api from '../../utils/request' import Tips from '../../utils/tips'
import { IViewMapProps, IViewMapState } from "./viewMap.interface";
import { getSubSpots, serviceUrl } from "../../utils/spots";
import "./viewMap.scss";
// import {  } from '../../components'
import locationpng from "../../assets/images/ditu.png";
// 导入可能用到的图片资源
// 注意在/config/index.js中增加copy图片资源的代码
import erji from "../../assets/images/erji.png";
import erji1 from "../../assets/images/erji1.png";
import erji2 from "../../assets/images/erji2.png";
import erji3 from "../../assets/images/erji3.png";
import erji4 from "../../assets/images/erji4.png";
import erji5 from "../../assets/images/erji5.png";
import erji6 from "../../assets/images/erji6.png";
import erji7 from "../../assets/images/erji7.png";

@connect(({ viewMap }) => ({
  ...viewMap,
}))

class ViewMap extends Component<IViewMapProps,
IViewMapState> {
  public static defaultState: IViewMapState = {
    controls: 40,
    dummy: "",
    height: 0,
    include_points: [],
    latitude: 39.897666,
    longitude: 116.657232,
    markers: [],
    scale: 16,
  };
  public config: Config = {
    navigationBarTitleText: "测试地图组件",
  };
  constructor(props: IViewMapProps) {
    super(props);
  }

  public componentDidMount() {
    //
  }
  public onMarkertap(e: any) {
    //
    console.log(e.markerId);
    // 注意必须使用小写，提交到服务端的请求规范，要求小写字母
    const spotscontentid = e.markerId;
    console.log(`spotscontentid: ${spotscontentid}`);
    Taro.request({
      url: serviceUrl + "/api/v1/getspotscontent",
      // tslint:disable-next-line: object-literal-sort-keys
      data: {
        spotscontentid,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success(res: any) {
        console.log(res.data);
        console.log(res.data.obj.audio);
        console.log(res.data.obj.title);
        // 调用背景播放器播放
        const manager = Taro.getBackgroundAudioManager();
        manager.src =res.data.obj.audio;
        manager.title = res.data.obj.title;
        manager.coverImgUrl =  res.data.obj.imageurl;
        manager.play();
        // 如下代码废除，低版本
        // Taro.playBackgroundAudio({
        //   dataUrl: res.data.obj.audio, 
        //   title: res.data.obj.title,
        //   // tslint:disable-next-line: object-literal-sort-keys
        //   coverImgUrl: res.data.obj.imageurl,
        //   // tslint:disable-next-line: object-literal-sort-keys
        // }).then({
        //   success: (playres: any) => {
        //     console.log(playres);
        //     console.log("sucess to play audio");
        //   },
        //   // tslint:disable-next-line: object-literal-sort-keys
        //   fail: (playres: any) => {
        //     console.log(playres);
        //     console.log("fail to play audio");
        //   },
        //   // tslint:disable-next-line: object-literal-sort-keys
        //   complete: (playres: any) => {
        //     console.log(playres);
        //     console.log("complete........");
        //   },

        // });
      },
    });
  }

  public async componentWillMount() {
    // console.log("markers=========1======", e.data.markers); this.sleep(2)
    Taro.authorize({
      scope: "scope.userLocation",
      success: (res: any) => {
        console.log(`userInfo: ${res}`);
      },
    }).then((res: any) => {
      console.log(res);
    });
    const markers = await getSubSpots(1);
    this.setState({ markers });
    Taro.getLocation({
      type: "gcj02", // 返回可以用于wx.openLocation的经纬度
      // tslint:disable-next-line: object-literal-sort-keys
      success: (res) => {
        // tslint:disable-next-line: object-literal-sort-keys
        console.log("onLoad.success");
        console.log(res);
        const amarkers = [
          {
            iconPath: "/images/erji2.png",
            id: 0,
            // latitude 纬度
            latitude: 39.897666,
            // longitude 经度
            longitude: 116.657232,
            // tslint:disable-next-line: object-literal-sort-keys
            label: {
              anchorX: -20,
              anchorY: -16,
              content: "item.title",
              // tslint:disable-next-line: object-literal-sort-keys
              color: "#ff0000",
              bgColor: "#ffcc00",
              textAlign: "center",
            },
            width: 50,
            height: 50,
          },
        ];
        // this.mapCtx = Taro.createMapContext("map");
        console.log(`longitude : ${res.longitude}, latitude : ${res.latitude}`);
        this.setState({
          // markers: amarkers,
          scale: 13,
          // tslint:disable-next-line: object-literal-sort-keys
          longitude: res.longitude,
          latitude: res.latitude,
        }, () => {
          //
        });
        // console.log("markers====222222=======", e.data.markers);
        // console.log("aaamarker======2=====", amarkers);
      },
      fail: (res: any) => {
        console.log(res);
      },
    });
  }
  public onRegionchange(e: any) {
    //
    console.log(e.type);
  }
  public onControltap(e: any) {
    //
    console.log(e.controlId, "controltap");
  }
  public onTap(e: any) {
    //
    console.log(e.controlId, "controltap");
  }

  // public async getSubSpots(spotsid : number) {
  //
  // }

  public render() {
    const { latitude, longitude, scale, markers, controls } = this.state;
    return (
      <View className="fx-searchArticle-wrap">
        <View className="at-row">
          <View className="at-col at-col-12">
            <Text>
              测试地图组件 ...</Text>
          </View>
        </View>
        <View className="fx-viewMap-wrap-map-container">
          <Map
            id="map"
            showLocation={true}
            latitude={latitude}
            longitude={longitude}
            scale={scale}
            markers={markers}
            onMarkertap={this
              .onMarkertap
              .bind(this)}
            onRegionchange={this
              .onRegionchange
              .bind(this)}
            className="fx-viewMap-wrap-map"
            controls={controls}
            onControltap={this
              .onControltap
              .bind(this)}
            onClick={this
              .onTap
              .bind(this)}>
            <CoverView className="fx-viewMap-wrap-coverloc">
              <CoverImage src={locationpng} className="coverlocpng"></CoverImage>
            </CoverView>
          </Map>
        </View>
      </View>
    );
  }
}

export default ViewMap;
