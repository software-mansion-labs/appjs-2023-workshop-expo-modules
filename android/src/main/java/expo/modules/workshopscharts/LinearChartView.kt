package expo.modules.workshopscharts

import android.content.Context
import android.view.ViewGroup
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineDataSet
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.Promise
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import expo.modules.workshopscharts.Utils.applyDefaultSettings
import expo.modules.workshopscharts.Utils.applyNewData
import expo.modules.workshopscharts.Utils.moveTo
import expo.modules.workshopscharts.Utils.setOnChartScale
import expo.modules.workshopscharts.Utils.setOnChartValueSelectedListener
import kotlinx.coroutines.launch

class LinearChartView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext), SharedDataSet.Listener {
  private val chartView = LineChart(context)

  private val onDataSelect by EventDispatcher<Map<String, Float>>()
  private val onScale by EventDispatcher<Map<String, Float>>()

  private var currentDataSet: SharedDataSet? = null

  fun setSharedDataSet(dataset: SharedDataSet) {
    currentDataSet?.removeListener(this)
    dataset.addListener(this)
    currentDataSet = dataset
  }

  override fun onNewData(newDataSet: LineDataSet) {
    chartView.applyNewData(newDataSet)
  }

  fun moveToStart() {
    val dataSet = chartView.data
    chartView.moveTo(dataSet.xMin - 1f)
  }

  fun moveToEnd() {
    val dataSet = chartView.data
    chartView.moveTo(dataSet.xMax + 1f)
  }

  fun moveToPoint(x: Float, y: Float) {
    chartView.moveTo(x, y)
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

  fun setLegendEnabled(value: Boolean) {
    chartView.legend.isEnabled = value
  }

  fun saveToGallery(promise: Promise) {
    appContext
      .registry
      .getModule<LinearChartModule>()
      ?.moduleScope
      ?.launch {
        val bitmap = chartView.chartBitmap
        Utils.saveImage(bitmap, context, "MyApp")
        promise.resolve(null)
      }
  }

  init {
    chartView.applyDefaultSettings()

    chartView.setOnChartValueSelectedListener { entry, _ ->
      onDataSelect(mapOf(
        "x" to entry.x,
        "y" to entry.y
      ))
    }

    chartView.setOnChartScale { _, scaleX, scaleY ->
      onScale(mapOf(
        "scaleX" to scaleX,
        "scaleY" to scaleY
      ))
    }

    addView(chartView, ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
    ))
  }
}
