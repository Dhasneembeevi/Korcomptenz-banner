import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneLink,
  PropertyPaneToggle,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import WelcomeBanner from "./components/WelcomeBanner";
import { IWelcomeBannerProps } from "./components/IWelcomeBannerProps";
import SharePointService from "./Services/sharepoint_services";
import { IDataService } from "./Services/IDataService";
import { sp } from "@pnp/sp";
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
} from "@pnp/spfx-property-controls/lib/PropertyFieldCollectionData";
import {
  PropertyFieldColorPicker,
  PropertyFieldColorPickerStyle,
} from "@pnp/spfx-property-controls/lib/PropertyFieldColorPicker";
// import {
//   ThemeProvider,
//   ThemeChangedEventArgs,
//   IReadonlyTheme
// } from "@microsoft/sp-component-base";
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface IWelcomeBannerWebPartProps {
  dataService: IDataService;
  description: string;
  context: any;
  tenantURL: any;
  dateFormat: string;
  listName: string;
  backgroundBanner: any;
  listLink: string;
  welcomeMessage: string;
  enableContentSection: boolean;
  collectionData: any[];
  SelectSpList: any;
  height: any;
  itemsToDisplay: number;
  hideshowarrow: boolean;
  hideshowindicator: boolean;
  interval: number;
  fontcolor: any;
  fontsize: any;
  backgroundcolor: string;
  sitelistName: any;
}

export default class WelcomeBannerWebPart extends BaseClientSideWebPart<IWelcomeBannerWebPartProps> {
  private lists: IPropertyPaneDropdownOption[] = [];
  private dataService: IDataService;
  private _isDarkTheme: boolean = false;
  // private _themeProvider: ThemeProvider;
  // private _themeVariant: IReadonlyTheme | undefined;
 
  public onInit(): Promise<void> {
    this.dataService = new SharePointService(this.context);
    return super.onInit().then((_) => {
      sp.setup({
        spfxContext: this.context,
      });
      // this._themeProvider = this.context.serviceScope.consume(
      //   ThemeProvider.serviceKey
      // );
  
      // // If it exists, get the theme variant
      // this._themeVariant = this._themeProvider.tryGetTheme();
  
      // // Register a handler to be notified if the theme variant changes
      // this._themeProvider.themeChangedEvent.add(
      //   this,
      //   this._handleThemeChangedEvent
      // );
    });
  }
  // private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
  //   this._themeVariant = args.theme;
  //   this.render();
  // }

  public render(): void {
    this.getListName();
    const element: React.ReactElement<IWelcomeBannerProps> =
      React.createElement(WelcomeBanner, {
        //themeVariant: this._themeVariant,
        description: this.properties.description,
        context: this.context,
        provider: this.dataService,
        isDarkTheme: this._isDarkTheme,
        tenantURL: this.context.pageContext.site.absoluteUrl,
        dateFormat: this.properties.dateFormat,
        listName: this.properties.listName,
        backgroundBanner: this.properties.backgroundBanner,
        dataService: this.dataService,
        listLink: this.properties.listLink,
        welcomeMessage: this.properties.welcomeMessage,
        height: this.properties.height,
        //right side section
        fontcolor: this.properties.fontcolor,
        fontsize: this.properties.fontsize,
        backgroundcolor: this.properties.backgroundcolor,
        enableContentSection: this.properties.enableContentSection,
        collectionData: this.properties.collectionData,
        SelectSpList: this.properties.SelectSpList,
        sitelistName: this.properties.sitelistName,
        //carousel settings
        hideshowarrow: this.properties.hideshowarrow,
        hideshowindicator: this.properties.hideshowindicator,
        interval: this.properties.interval,
      });

    ReactDom.render(element, this.domElement);
  }
  //Welcome Banner section Theme Color Changed
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
  //Get Listname from sharepoint site
  public async getListName(): Promise<any> {
    //get list name using guid
    let listName = await sp.web.lists
      .getById(this.properties.SelectSpList)
      .select("Title")
      .get();
    // let groupID = await sp.web.currentUser.groups.get();
    // userGroup = groupID.map((item) => {
    //   return item.Id;
    // });
    this.properties.listName = listName.Title;
  }
  protected onPropertyPaneConfigurationStart(): void {
    sp.web.lists
      .expand("rootFolder")
      .select(
        "Title,ParentWebUrl,rootFolder/ServerRelativeUrl,rootFolder/Name,Id,ItemCount"
      )
      .get()
      .then((res) => {
        res.map((r) => {
          this.lists.push({ key: r.Id, text: r.Title });
        });
        this.context.propertyPane.refresh();
        this.render();
      });
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): void {
    if (propertyPath === "dateFormat" && newValue) {
      this.context.propertyPane.refresh();
      this.onDispose();
    }
  }

  private applyButton() {
    this.context.propertyPane.refresh();
    this.onDispose();
  }
  private renderAnnouncementSection() {
    const enableContentSection = this.properties.enableContentSection;

    let fields = [
      {
        id: "imageUrl",
        title: "Image URL",
        type: CustomCollectionFieldType.string,
        required: true,
      },
      {
        id: "show",
        title: "Show or Hide",
        type: CustomCollectionFieldType.dropdown,
        options: [
          {
            key: "show",
            text: "Show",
          },
          {
            key: "hide",
            text: "Hide",
          },
        ],
        required: true,
      },
    ];
    if (enableContentSection) {
      fields.push(
        {
          id: "Title",
          title: "Title",
          type: CustomCollectionFieldType.string,
          required: true,
        },
        {
          id: "Description",
          title: "Description",
          type: CustomCollectionFieldType.string,
          required: false,
        },
        {
          id: "readmoreLink",
          title: "Read More Link",
          type: CustomCollectionFieldType.string,
          required: false,
        }
      );
    }
    return [
      // PropertyPaneSlider("fontsize", {
      //   label: "Font Size (px)",
      //   min: 10,
      //   max: 30,
      //   step: 1,
      // }),
      // PropertyFieldColorPicker("fontcolor", {
      //   label: "Font Color",
      //   selectedColor: this.properties.fontcolor,
      //   onPropertyChange: this.onPropertyPaneFieldChanged,
      //   properties: this.properties,
      //   disabled: false,
      //   debounce: 1000,
      //   isHidden: false,
      //   alphaSliderHidden: false,
      //   style: PropertyFieldColorPickerStyle.Inline,
      //   iconName: "Precipitation",
      //   key: "colorFieldId",
      // }),
      PropertyFieldColorPicker("backgroundcolor", {
        label: "Background Color",
        selectedColor: this.properties.backgroundcolor,
        onPropertyChange: this.onPropertyPaneFieldChanged,
        properties: this.properties,
        disabled: false,
        debounce: 1000,
        isHidden: false,
        alphaSliderHidden: false,
        style: PropertyFieldColorPickerStyle.Inline,
        iconName: "Precipitation",
        key: "colorFieldId",
      }),
      // PropertyFieldCollectionData("collectionData", {
      //   key: "collectionData",
      //   label: "Banner Data",
      //   panelHeader: "Banner data panel header",
      //   manageBtnLabel: "Manage Banner data",
      //   value: this.properties.collectionData,
      //   fields: fields,
      //   disabled: false,
      // }),
      PropertyFieldListPicker('SelectSpList', {
        label: 'Select a list',
        selectedList: this.properties.SelectSpList,
        includeHidden: false,
        orderBy: PropertyFieldListPickerOrderBy.Title,
        disabled: false,
        onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
        properties: this.properties,
        context: this.context as any,
        onGetErrorMessage: null,
        deferredValidationTime: 0,
        key: 'listPickerFieldId'
      }),
      // PropertyPaneSlider("itemsToDisplay", {
      //   label: "Number of items to display",
      //   min: 1,
      //   max: 10,
      // })
     
    ];
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Basic",
              groupFields: [
                PropertyPaneTextField("welcomeMessage", {
                  label: "Welcome message",
                }),
                PropertyPaneDropdown("dateFormat", {
                  label: "Format Date and Time",
                  options: [
                    {
                      key: "h:mm A dddd, MMM D, YYYY",
                      text: "7:52 PM Wednesday, Dec 15, 2021",
                    },
                    {
                      key: "dddd Do MMM, YYYY, h:mm A",
                      text: "Thursday 14th Jul, 2022, 4:27 PM",
                    },
                    {
                      key: "dddd D MMMM YYYY, h:mm A",
                      text: "Thursday 14 July 2022, 4:27 PM",
                    },
                    { key: "h:mm A, D/M/YYYY", text: "7:52 PM, 15/12/2021" },
                    {
                      key: "dddd D MMMM, YYYY h:mmA",
                      text: "Thursday 14 July, 2022 4:27PM",
                    },
                  ],
                }),
                // PropertyPaneSlider("height", {
                //   label: "Banner Height",
                //   min: 250,
                //   max: 550,
                //   step: 50,
                // }),
              ],
            },
            {
              isCollapsed: true,
              groupName: "Banner Configs",
              groupFields: [
                PropertyPaneToggle("enableContentSection", {
                  label: "Enable announcement section",
                  checked: false,
                }),
                 ...this.renderAnnouncementSection(),
                
              ],
            },
            {
              isCollapsed: true,
              groupName: "Carousel Settings",
              groupFields: [
                PropertyPaneToggle("hideshowarrow", {
                  label: "Show Next & Prev Icon?",
                  checked: true,
                }),
                PropertyPaneToggle("hideshowindicator", {
                  label: "Show Indicator?",
                  checked: true,
                }),
                PropertyPaneSlider("interval", {
                  label: "Carousel Interval (seconds)",
                  min: 5,
                  max: 60,
                  step: 3,
                }),
              ],
            },
            {
              isCollapsed: true,
              groupName: "List Settings",
              groupFields: [
                PropertyPaneLink("addItem", {
                  text: "Add new Items",
                  href: `${this.context.pageContext.site.absoluteUrl}/Lists/${this.properties.listName}/NewForm.aspx`,
                  target: "_blank",
                }),
                PropertyPaneLink("editItem", {
                  text: "Edit Items",
                  href: `${this.context.pageContext.site.absoluteUrl}/Lists/${this.properties.listName}/AllItems.aspx`,
                  target: "_blank",
                }),
              ],
            }
          ],
        },
      ],
    };
  }
}
