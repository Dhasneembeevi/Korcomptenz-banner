import * as React from "react";
import { IWelcomeBannerProps } from "./IWelcomeBannerProps";
import { IDataService } from "../Services/IDataService";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields/list";
import "@pnp/sp/items/list";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/site-users/web";
import styles from "./WelcomeBanner.module.scss";
import Clock from "react-live-clock";
import "bootstrap/dist/css/bootstrap.min.css";
// import { ImageHelper } from "@microsoft/sp-image-helper";
import Carousel from "react-bootstrap/Carousel";
// import {img from "./Images/Profileicon.png"
const WelcomeBanner: React.FunctionComponent<IWelcomeBannerProps> = (
  props: IWelcomeBannerProps
) => {
  const [curreUserName, setCurreUserName] = React.useState("");
  const [bannerData, setBannerData] = React.useState(props.collectionData);
  const [Darktheme, setDarktheme] = React.useState(props.isDarkTheme);
  const [theme, setTheme] = React.useState<string>("default");
  const [dateFormat, setDateFormat] = React.useState(props.dateFormat);
  // const [profileImageUrl, setProfileImageUrl] = React.useState<string | undefined>(undefined);
  const dataService: IDataService = props.dataService;
  const img = require("./Images/Profileicon.png") as string;
  // const fetchUserProfileImage = () => {
  //   sp.profiles.myProperties.get().then((profile) => {
  //     const imageUrl = profile.PictureUrl;

  //     if (imageUrl !== null) {
  //       setProfileImageUrl(imageUrl);
  //       console.log("Profile Image URL: ", imageUrl);
  //     } else {
  //       console.log("User has no profile picture.");
  //     }
  //   });
  // };

  //fetch the current user data
  React.useEffect(() => {
    setTheme(props.isDarkTheme ? "default" : "light");
  }, [props.isDarkTheme]);

  React.useEffect(() => {
    sp.setup({
      sp: {
        baseUrl: props.tenantURL,
      },
    });
    dataService.getCurrentUserData().then((res) => {
      setCurreUserName(res["Title"]);
      // fetchUserProfileImage();
    });
    dataService
      .getBannerList(props.SelectSpList, props.sitelistName)
      .then((res) => {
        console.log(res);
        const shuffledData = [...res].sort(() => Math.random() - 0.5);

        setBannerData(shuffledData);
      });
  }, []);
  React.useEffect(() => {
    let indicators = document.getElementsByClassName(
      "carousel-indicators"
    )[0] as HTMLElement;
    let nextControl = document.getElementsByClassName(
      "carousel-control-next"
    )[0] as HTMLElement;
    let prevControl = document.getElementsByClassName(
      "carousel-control-prev"
    )[0] as HTMLElement;
    //  let carouselinner = document.getElementsByClassName("carousel-inner")[0] as HTMLElement;
    //  if(carouselinner){
    //   carouselinner.style.display = props.show ? "co"
    //  }
    if (indicators) {
      // indicators.style.display = props.hideshowindicator ? "flex !important" : "none";
      var activeListItem = document.querySelector(".carousel-indicators");
      if (!props.hideshowindicator) {
        activeListItem.classList.add("hideIndicators");
      } else {
        activeListItem.classList.add("showIndicators");
      }
    }
    if (nextControl && prevControl) {
      nextControl.style.display =  "none";
      prevControl.style.display = "none";
    }
  }, [props]);

  let userName = props.welcomeMessage
    ? props.welcomeMessage + ", " + curreUserName + " !"
    : curreUserName + " !";
  //console.log(bannerData);
  const Siteurl = props.context.pageContext.site.absoluteUrl;
  // console.log(Siteurl);
  const listname = props.listName;
  // console.log(listname);
  let settheme = props.isDarkTheme ? "" : "lighttheme";
  return (
    <div className={`${styles.banner} ${settheme}`}>
      {/* <p>Site Absolute URL: {props.context.pageContext.site.absoluteUrl}</p> */}
      {/* <p>List name:{props.listName}</p> */}
      <Carousel className={styles.carousel}>
        {bannerData &&
          bannerData
            //.filter((item) => item.show === "show" ? "show":"hide")//.carousel-inner -- display: none;
            .map((item, index) => {
              const imageJSON = JSON.parse(item.imageUrl);
              //const image = JSON.parse(item.Icons);
              const convertedBannerImgString =
                JSON.parse(item.imageUrl) !== null &&
                JSON.parse(item.imageUrl).fileName;
              //   .replace(/\[/g, '%5B') // Replace '[' with '%5B'
              //   .replace(/\]/g, '%5D') // Replace ']' with '%5D'
              //   .replace(/ /g, '%20');  // Replace space with '%20'
              //   const convertedBannerIconString = JSON.parse(item.Icons) !== null && JSON.parse(item.Icons).fileName
              //   .replace(/\[/g, '%5B') // Replace '[' with '%5B'
              //   .replace(/\]/g, '%5D') // Replace ']' with '%5D'
              //   .replace(/ /g, '%20');  // Replace space with '%20'
              return (
                <Carousel.Item className={styles.carouselitem}
                  key={index}
                  // interval={props.interval ? props.interval + "000" : 1500}
                >
                
                      {item.imageUrl && (
                        <img className={styles.bannerimg}
                          src={`${props.context.pageContext.site.absoluteUrl}/Lists/${props.listName}/Attachments/${item.id}/${convertedBannerImgString}`}
                          alt=""
                        />
                        // <img src={ImageHelper.convertToImageUrl({
                        //   sourceUrl: imageJSON.serverRelativeUrl,
                        //   width: 30,
                        // })} alt=""/>
                      )}
                

                    {props.enableContentSection === true && (
                      <>
                        <div className={styles.textcontainer}>
                          <div className={styles.text1}>
                            <div className={styles.username}>
                              {userName} <img src={img} alt="" />
                            </div>

                            <div>
                              <Clock format={dateFormat} ticking={true} />
                            </div>
                          </div>
                          {/* <img
                          src={`${props.context.pageContext.site.absoluteUrl}/Lists/${props.listName}/Attachments/${item.id}/${convertedBannerIconString}`} alt="" />    */}

                          <div className={styles.text2}>
                            <p style={{textAlign:'center'}}>{item.Title}</p>
                          </div>

                          <div style={{backgroundColor: props.backgroundcolor ? props.backgroundcolor: ""}}
                            className={styles.text3}
                            title={item.Description}
                          >
                            <p>{item.Description}</p>
                          </div>
                        </div>
                      </>
                    )}
                </Carousel.Item>
              );
            })}
      </Carousel>
    </div>
  );
};

export default WelcomeBanner;
