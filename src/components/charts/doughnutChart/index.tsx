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

import { util } from '@sentre/senhub'
import { AllocationType } from 'view/constants'

echarts.use([
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
])

const buildOptions = ({
  data,
  bgTooltip = '#233333',
}: {
  data: Record<string, AllocationType>
  bgTooltip?: string
}) => {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: bgTooltip,
      extraCssText: 'border-radius: 0px',
      formatter: function (params: any) {
        return `<div style="width: 200px; font-weight: 400"><span style="display: flex; justify-content: space-between"><span style="font-size: 14px, font-weight: 400">Value</span> <span style="font-size: 16px; font-weight: 700">${util
          .numeric(params.data.value)
          .format(
            '0,0.[0000]',
          )}</span></span> <span style="display: flex; justify-content: space-between;"><span style="font-size: 14px; font-weight: 400">Token amount</span> <span style="font-size: 16px; font-weight: 700">${util
          .numeric(params.data.tokenAmount)
          .format('0,0.[0000]')}</span></span></div>`
      },
      textStyle: {
        color: '#F4F5F5',
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        width: '300',
        center: [110, '50%'],
        name: 'Sentre chart',
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
            fontSize: 20,
            fontWeight: 'bold',
            color: '#F4F5F5',
            overflow: 'hidden',
          },
        },
        itemStyle: {
          color: (params: any) => {
            return util.randomColor(params.name)
          },
        },

        labelLine: {
          show: false,
        },
        data: Object.values(data).map((val) => {
          return {
            value: val.usdValue,
            name: `${val.symbol}`,
            tokenAmount: val.amountToken,
            percentRatio: val.ratio,
          }
        }),
      },
    ],
    media: [
      {
        query: {
          maxWidth: 300,
        },
        option: {
          series: [
            {
              center: [100, '50%'],
              radius: ['35%', '60%'],
            },
          ],
        },
      },
      {
        query: {
          maxWidth: 200,
        },
        option: {
          series: [
            {
              center: [70, '50%'],
              radius: ['25%', '45%'],
            },
          ],
        },
      },
    ],
  }
}

const DoughnutChart = ({ data }: { data: Record<string, AllocationType> }) => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions({ data, bgTooltip: '#123432' })}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default DoughnutChart
