export const useApiBase = () => {
  const config = useRuntimeConfig();

  return {
    //อย่าลืม public
    YAKKAW_API: config.public.YAKKAW_API,
    baseAirApi: config.public.baseAirApi || config.public.apiUrl,
    oneYearApi: config.public.oneyear,
    oneWeekApi: config.public.aqiweek,
    colorRangeApi:
      (config.public as any).colorange ??
      (config.public as any).COLOUR ??
      (config as any).colorange,
    googlemap_key: config.public.GOOGLEMAPAPI,
    newsApi: config.public.newsApi || "/api/news",
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
