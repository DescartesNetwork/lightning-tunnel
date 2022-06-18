import * as echarts from 'echarts/core'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { numeric } from 'shared/util'
import { shortenTailText } from 'app/helper'

echarts.use([
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
])

const buildOptions = ({ bgTooltip = '#233333' }: { bgTooltip?: string }) => {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: bgTooltip,
      extraCssText: 'border-radius: 0px',
      formatter: function (params: any) {
        return `<div style="width: 200px; font-weight: 400"><span style="display: flex; justify-content: space-between"><span style="font-size: 14px, font-weight: 400">Value</span> <span style="font-size: 16px; font-weight: 700">${params.data.value}%</span></span> <span style="display: flex; justify-content: space-between;"><span style="font-size: 14px; font-weight: 400">Token amount</span> <span style="font-size: 16px; font-weight: 700">${params.data.tokenAmount}</span></span></div>`
      },
      textStyle: {
        color: '#F4F5F5',
      },
    },
    legend: {
      top: '15%',
      right: 'right',
      orient: 'vertical',
      formatter: function (name: string) {
        const splitedString = name.split('_')
        return `{a| ${shortenTailText(splitedString[0], 7)}}{b| ${numeric(
          splitedString[1],
        ).format('0,0.[00]')}%}`
      },
      icon: 'rect',
      textStyle: {
        width: 150,
        rich: {
          a: {
            color: '#A7ADAD',
            fontSize: 14,
          },
          b: {
            width: 50,
            padding: 16,
            fontSize: 14,
            color: '#F4F5F5',
            align: 'right',
          },
        },
      },
    },
    series: [
      {
        left: 0,
        center: [120, '50%'],
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            formatter: function (params: any) {
              const splitedString = params.name.split('_')
              return splitedString[0]
            },
            fontSize: 20,
            fontWeight: 'bold',
            color: '#F4F5F5',
            overflow: 'hidden',
          },
        },

        labelLine: {
          show: false,
        },
        data: [
          {
            value: 1048,
            name: 'Search Engine_1048',
            tokenAmount: 10,
          },
          { value: 735, name: 'Direct_735', tokenAmount: 10 },
          { value: 580, name: 'Email_580', tokenAmount: 10 },
          { value: 484, name: 'Union Ads_484', tokenAmount: 10 },
          { value: 300, name: 'Video Ads_300', tokenAmount: 10 },
        ],
      },
    ],
    media: [
      {
        query: {
          maxWidth: 400,
        },
        option: {
          legend: {
            top: '25%',
            textStyle: {
              width: 100,
              rich: {
                a: {
                  fontSize: 10,
                },
                b: {
                  fontSize: 10,
                },
              },
            },
          },
          series: [
            {
              center: [80, '50%'],
              radius: ['30%', '50%'],
            },
          ],
        },
      },
    ],
  }
}

const DoughnutChart = () => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions({})}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default DoughnutChart
