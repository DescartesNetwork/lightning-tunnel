import * as echarts from 'echarts/core'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import { LineChart as LC } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  GridComponent,
  LC,
  CanvasRenderer,
  LegendComponent,
])

const buildOptions = () => {
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        length: 6,
        show: true,
        lineStyle: {
          color: '#A7ADAD',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#A7ADAD',
        },
      },
      splitLine: {
        lineStyle: {
          // Dark and light colors will be used in turns
          color: ['#394747', '#394747'],
        },
      },
    },
    grid: {
      show: false,
      left: 40,
      right: 10,
      top: 10,
      bottom: 20,
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {
          origin: 'start',
        },
        showSymbol: false,
        lineStyle: {
          color: 'transparent',
        },
      },
    ],
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#42E6EB', // color at 0%
        },
        {
          offset: 1,
          color: 'rgba(66, 230, 235, 0)', // color at 100%
        },
      ],
    },
  }
}

const LineChart = () => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions()}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default LineChart
