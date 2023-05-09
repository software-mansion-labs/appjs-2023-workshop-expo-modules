import ExpoModulesCore
import Charts

class LinearChartView: ExpoView {
  let chartView = LineChartView(frame: .zero)

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    chartView.applyDefaultSettings()

    addSubview(chartView)
  }
}
