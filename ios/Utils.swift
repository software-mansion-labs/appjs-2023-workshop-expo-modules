import Charts

extension LineChartView {
  func applyDefaultSettings() {
    autoresizingMask = [.flexibleWidth, .flexibleHeight]
    pinchZoomEnabled = true
    setVisibleXRangeMaximum(10)
    setVisibleXRangeMinimum(1)
    animate(xAxisDuration: 0.2)

    backgroundColor = Colors.background
    legend.textColor = Colors.primary
    rightAxis.labelTextColor = Colors.text
    leftAxis.labelTextColor = Colors.text
    xAxis.labelTextColor = Colors.text
    gridBackgroundColor = Colors.secondBackground
    xAxis.labelFont = xAxis.labelFont.withSize(12)
    rightAxis.labelFont = rightAxis.labelFont.withSize(12)
    leftAxis.labelFont = leftAxis.labelFont.withSize(12)
  }

  func applyNewData(dataSet: LineChartDataSet) {
    data = LineChartData(dataSet: dataSet)

    setVisibleXRangeMaximum(10)
    setVisibleXRangeMinimum(1)

    notifyDataSetChanged()
  }
}

extension LineChartDataSet {
  func applyDefaultSettings() {
    colors = [Colors.primary]
    valueTextColor = Colors.text
    valueFont = valueFont.withSize(12)
    lineWidth = 10
    mode = .cubicBezier
  }
}
