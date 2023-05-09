package expo.modules.workshopscharts

import android.content.Context
import android.view.ViewGroup
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineDataSet
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import expo.modules.workshopscharts.Utils.applyDefaultSettings
import expo.modules.workshopscharts.Utils.applyNewData

class LinearChartView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {
  private val chartView = LineChart(context)

  init {
    chartView.applyDefaultSettings()

    addView(chartView, ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
    ))
  }

  fun setSeries(series: LinearDataSeries) {
    val dataSet = LineDataSet(
      series.values.map { Entry(it.x, it.y) },
      series.label
    )

    dataSet.apply {
      applyDefaultSettings()

      mode = series.mode.toLineDataSetMode()

      valueTextSize = series.textSize
      lineWidth = series.lineWidth
    }

    chartView.applyNewData(dataSet)
  }

  fun setTouchEnabled(value: Boolean) {
    chartView.setTouchEnabled(value)
  }
}
