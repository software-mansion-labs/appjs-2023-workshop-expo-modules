package expo.modules.workshopscharts

import android.content.Context
import android.view.ViewGroup
import com.github.mikephil.charting.charts.LineChart
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import expo.modules.workshopscharts.Utils.applyDefaultSettings

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
}
