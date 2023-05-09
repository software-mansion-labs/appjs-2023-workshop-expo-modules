package expo.modules.workshopscharts

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Required

data class DataEntry(
  @Field val x: Float,
  @Field val y: Float
) : Record

class LinearDataSeries : Record {
  @Field
  @Required
  val values: List<DataEntry> = emptyList()
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
    }
  }
}
