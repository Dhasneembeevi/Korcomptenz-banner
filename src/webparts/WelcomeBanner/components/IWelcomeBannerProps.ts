import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDataService } from "../Services";
// import { IReadonlyTheme } from "@microsoft/sp-component-base";

export interface IWelcomeBannerProps {
  //: IReadonlyTheme | undefined;
  description: string;
  provider: IDataService;
  dataService: IDataService;
  tenantURL: string;
  dateFormat: string;
  listName: string;
  backgroundBanner: any;
  welcomeMessage: string;
  height: any;
  enableContentSection: boolean;
  listLink: any;
  context: WebPartContext;
  SelectSpList: any;
  isDarkTheme: boolean;
  sitelistName: any;
  collectionData: any[];
  hideshowarrow: boolean;
  hideshowindicator: boolean;
  interval: number;
  //provider: IDataService;
  fontcolor: any;
  fontsize: any;
  backgroundcolor: string;
}
