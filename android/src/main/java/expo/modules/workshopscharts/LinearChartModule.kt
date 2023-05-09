package expo.modules.workshopscharts

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class LinearChartModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("LinearChart")

    OnCreate {
      Utils.initCharts(appContext)
    }

    View(LinearChartView::class) {

    }
  }
}
