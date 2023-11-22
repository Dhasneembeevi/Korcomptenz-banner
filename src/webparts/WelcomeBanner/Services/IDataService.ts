import { IList } from "../common/IObject";


export interface IDataService {
  getCurrentUserData(): Promise<any[]>;
  //getBannerImage(listName: any): Promise<any[]>;
  getBannerList(SelectSpList: string,sitelistName: any): Promise<IList[]>;
 
}
