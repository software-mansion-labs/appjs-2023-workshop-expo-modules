package expo.modules.workshopscharts

import com.github.mikephil.charting.data.LineDataSet
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Required
import expo.modules.kotlin.types.Enumerable

enum class DataMode(val value: Int) : Enumerable {
  LINEAR(0),
  STEPPED(1),
  CUBIC_BEZIER(2),
  HORIZONTAL_BEZIER(3);

  fun toLineDataSetMode(): LineDataSet.Mode {
    return when (this) {
      LINEAR -> LineDataSet.Mode.LINEAR
      STEPPED -> LineDataSet.Mode.STEPPED
      CUBIC_BEZIER -> LineDataSet.Mode.CUBIC_BEZIER
      HORIZONTAL_BEZIER -> LineDataSet.Mode.HORIZONTAL_BEZIER
    }
  }
}

data class DataEntry(
  @Field val x: Float,
  @Field val y: Float
) : Record

class LinearDataSeries : Record {
  @Field
  @Required
  val values: List<DataEntry> = emptyList()

  @Field
  @Required
  val label: String = ""

  @Field
  val lineWidth: Float = 5f

  @Field
  val textSize: Float = 10f

  @Field
  val mode: DataMode = DataMode.LINEAR
}

class LinearChartModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("LinearChart")

    OnCreate {
      Utils.initCharts(appContext)
    }

    View(LinearChartView::class) {
      Prop("data") { view: LinearChartView, series: LinearDataSeries? ->
        if (series != null) {
          view.setSeries(series)
        }
      }

      Prop("touchEnabled") { view: LinearChartView, touchEnabled: Boolean? ->
        view.setTouchEnabled(touchEnabled ?: true)
      }

      Prop("legendEnabled") { view: LinearChartView, legendEnabled: Boolean? ->
        view.setLegendEnabled(legendEnabled ?: true)
      }

      Events("onDataSelect", "onScale")

      AsyncFunction("moveToStart") { view: LinearChartView ->
        view.moveToStart()
      }

      AsyncFunction("moveToEnd") { view: LinearChartView ->
        view.moveToEnd()
      }

      AsyncFunction("moveToPoint") { view: LinearChartView, x: Float, y: Float ->
        view.moveToPoint(x, y)
      }
    }
  }
}
