// export function sayHello(name: string): string {
//   return `สวัสดี, ${name}!`
// }

// console.log(sayHello("ChatGPT")) // สวัสดี, ChatGPT!


// export function sum(a: number, b: number): number {
//   const summl = a + b;
//   console.log(summl)
//   return summl;
// }



// import * as echarts from 'echarts';

// function getVirtualData(pm25Data: any[]) {
//   const data: [string, number][] = pm25Data.map((item: any) => [
//     item.date, // วันที่
//     item.pm2_5 // ค่า PM2.5
//   ]);
//   return data;
// }

// export const option = {
//   title: {
//     top: 30,
//     left: 'center',
//     text: 'Daily Step Count'
//   },
//   tooltip: {},
//   visualMap: {
//     min: 0,
//     max: 10000,
//     type: 'piecewise',
//     orient: 'horizontal',
//     left: 'center',
//     top: 65
//   },
//   calendar: {
//     top: 120,
//     left: 30,
//     right: 30,
//     cellSize: ['auto', 13],
//     range: '2016',
//     itemStyle: {
//       borderWidth: 0.5
//     },
//     yearLabel: { show: false }
//   },
//   series: {
//     type: 'heatmap',
//     coordinateSystem: 'calendar',
//     data: getVirtualData('2016')
//   }
// }
