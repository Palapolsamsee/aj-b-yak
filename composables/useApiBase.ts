export const useApiBase = () => {
  const config = useRuntimeConfig()

  return {
    yakkawApi: config.yakkaw_api,
    baseAirApi: config.baseair,
    oneYearApi: config.oneyear,
    oneWeekApi: config.apiUrl, 
    colorRangeApi: config.colorange,
  }
}