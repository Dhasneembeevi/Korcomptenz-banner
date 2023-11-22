import { IDataService } from "./IDataService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {  sp } from "@pnp/sp/presets/all";
import { IList } from "../common/IObject";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields/list";
import "@pnp/sp/items/list";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/site-users/web";
import * as moment from "moment";


export default class SharePointService implements IDataService {
  private _webPartContext: WebPartContext;
  private _webAbsoluteUrl: string;

  constructor(_context: WebPartContext) {
    this._webPartContext = _context;
    this._webAbsoluteUrl = _context.pageContext.web.absoluteUrl;
    sp.setup({
      spfxContext:  this._webPartContext
    });
  }

  // constructor(private context: WebPartContext) {
  //   sp.setup({
  //     spfxContext: this.context,
  //   });
  // }
 

  public getCurrentUserData(): Promise<any> {
    return new Promise((resolve, rejet) => {
      sp.web.currentUser.get().then((res) => {
        resolve(res);
      });
    });
  }


  // public getBannerImage(listName: string): Promise<any> {
  //   return new Promise((resolve, rejet) => {
  //     sp.web.lists
  //       .getById(listName)
  //       .items.select("*,Title,FileRef,FileLeafRef")
  //       .top(10)
  //       .orderBy("Id", false)
  //       .get()
  //       .then((res) => {
  //         resolve(res);
  //       });
  //   });
  // }

  public async getBannerList(SelectSpList: string,  sitelistName : any): Promise<IList[]> {
    let _items: IList[];
    let todayDate = moment();
    let tomorrowDate = moment(todayDate).add(1, "d");
    let formatedTodayDate = moment(todayDate).format();
    let formatedTomorrowDate = moment(tomorrowDate).format();
    //let web = Web(SelectSpList);
    const getitems = await sp.web.lists
      .getById(SelectSpList)
      .items.orderBy("OrderBy",true)
      .top(8)
      .get();
    _items = [];
    for (let i = 0; i < getitems.length; i++) {
      let item = getitems[i];
      var lst: any = {
        Title: item.Title,
        id:item.ID, 
     //   show:item.show,       
        Description: item.Description,
      //  Description2:item.Description2,
     //   Description3:item.Description3,
        imageUrl:item.imageUrl,
        //Icons:item.Icons,
        Order0: item.OrderBy,
        // ExpiryDate: item.ExpiryDate,
        // TargetWindow: item.TargetWindow
      };

      _items.push(lst);
    }
    console.log(lst);
    console.log(_items);
    return _items;
  }
}
