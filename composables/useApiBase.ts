export const useApiBase = () => {
  const config = useRuntimeConfig();
  const publicConfig = config.public as any;

  const baseAirApi =
    publicConfig.baseApiAri ??
    publicConfig.apiUrl ??
    publicConfig.baseAirApi ??
    publicConfig.baseair ??
    (config as any).airqualityProxyTarget;

  return {
    //อย่าลืม public
    YAKKAW_API: publicConfig.yakkawApi ?? publicConfig.YAKKAW_API,
    baseAirApi,
    oneYearApi:
      publicConfig.yearApiAri ??
      publicConfig.oneyear ??
      baseAirApi,
    oneWeekApi:
      publicConfig.aqiWeekApi ??
      publicConfig.aqiweek ??
      baseAirApi,
    colorRangeApi:
      publicConfig.apiUrlColorrange ??
      publicConfig.colorange ??
      publicConfig.COLOUR ??
      (config as any).colorange,
    googlemap_key: publicConfig.googlemap ?? publicConfig.GOOGLEMAPAPI,
    newsApi: publicConfig.newsApi || "/api/news",
  };
};

// import { initializeApp } from "firebase/app"
// import { getFirestore, collection, getDocs } from "firebase/firestore"

// export const useApiBase = () => {
//   const config = useRuntimeConfig()

//   const firebaseConfig = {
//     apiKey: config.firebaseApiKey,
//     authDomain: config.firebaseAuthDomain,
//     projectId: config.firebaseProjectId,
//     storageBucket: config.firebaseStorageBucket,
//     messagingSenderId: config.firebaseMessagingSenderId,
//     appId:config.firebaseAppId
//   }

//   const app = initializeApp(firebaseConfig)
//   const db = getFirestore(app)

//   const fetchColorRanges = async () => {
//     const colRef = collection(db, "colorRanges")
//     const snapshot = await getDocs(colRef)
//     return snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }))
//   }

//   return {
//     app,
//     db,
//     fetchColorRanges
//   }
// }
