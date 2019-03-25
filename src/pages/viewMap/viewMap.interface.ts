/**
 * searchArticle.state 参数类型
 *
 * @export
 * @interface IViewMapState
 */
export interface IViewMapState {

    controls : any;
    dummy : string;
    height : number;
    include_points : any;
    latitude : number;
    longitude : number;
    markers : any;
    scale : number;

}

/**
 * searchArticle.props 参数类型
 *
 * @export
 * @interface IViewMapProps
 */
export interface IViewMapProps {
    dummy : string;
}
