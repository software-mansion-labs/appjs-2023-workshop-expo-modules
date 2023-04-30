package expo.modules.workshopscharts

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.os.Environment
import android.os.SystemClock
import android.provider.MediaStore
import android.view.MotionEvent
import android.view.ViewGroup
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.YAxis.AxisDependency
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.highlight.Highlight
import com.github.mikephil.charting.listener.ChartTouchListener
import com.github.mikephil.charting.listener.OnChartGestureListener
import com.github.mikephil.charting.listener.OnChartValueSelectedListener
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.Promise
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import kotlinx.coroutines.launch
import java.io.File
import java.io.File.separator
import java.io.FileOutputStream
import java.io.OutputStream

class LinearChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val linearChart = LineChart(context)

  private val onDataSelect by EventDispatcher<Map<String, Float>>()
  private val onScale by EventDispatcher<Map<String, Float>>()

  private var currentDataSet: SharedDataSet? = null
  private var currentDataSetListener: ListenerType? = null

  fun setSharedDataSet(dataset: SharedDataSet) {
    currentDataSet?.removeListener(currentDataSetListener)
    val newListener: ListenerType = { data -> applyNewData(data) }
    currentDataSet = dataset
    dataset.addListener(newListener)
    currentDataSetListener = newListener
  }

  fun moveToStart() {
    val dataSet = linearChart.data
    moveTo(dataSet.xMin - 1f)
  }

  fun moveToEnd() {
    val dataSet = linearChart.data
    moveTo(dataSet.xMax + 1f)
  }

  fun moveToPoint(x: Float, y: Float) {
    moveTo(x, y)
  }

  private fun moveTo(x: Float, y: Float = 0f, axisDependency: AxisDependency = AxisDependency.LEFT, duration: Long = 300) {
    linearChart.isDragDecelerationEnabled = false
    linearChart.dispatchTouchEvent(
      MotionEvent.obtain(SystemClock.uptimeMillis(), SystemClock.uptimeMillis(), MotionEvent.ACTION_DOWN, 0f, 0f, 0)
    )
    linearChart.moveViewToAnimated(x, y, axisDependency, duration)
    linearChart.postDelayed({
      linearChart.isDragDecelerationEnabled = true
    }, duration + 100)
  }

  private fun applyNewData(dataSet: LineDataSet) {
    val prevDataSet = linearChart.data

    val data = LineData(dataSet)
    linearChart.data = data
    linearChart.setVisibleXRangeMinimum(1f)
    linearChart.setVisibleYRangeMinimum(1f, AxisDependency.LEFT)
    linearChart.setVisibleXRangeMaximum(10f)

    if (prevDataSet == null || prevDataSet.dataSetCount == 0) {
      linearChart.fitScreen()
      linearChart.notifyDataSetChanged()
      linearChart.invalidate()
      linearChart.setVisibleXRangeMinimum(1f)
      linearChart.setVisibleYRangeMinimum(1f, AxisDependency.LEFT)
      linearChart.setVisibleXRangeMaximum(10f)

      return
    }

    linearChart.notifyDataSetChanged()
    val wasScrolled = prevDataSet.xMax - linearChart.highestVisibleX > 2f
    if (wasScrolled) {
      linearChart.invalidate()
    } else {
      moveToEnd()
    }

  }

  fun setSeries(series: LinearDataSeries) {
    val dataSet = LineDataSet(
      series.values.map { Entry(it.x, it.y) },
      series.label
    )

    dataSet.apply {
      mode = series.mode.toLineDataSetMode()
      valueTextSize = series.textSize
      lineWidth = series.lineWidth
      color = Colors.primary
      valueTextColor = Colors.text
    }

    applyNewData(dataSet)
  }

  fun setTouchEnabled(value: Boolean) {
    linearChart.setTouchEnabled(value)
  }

  fun setLegendEnabled(value: Boolean) {
    linearChart.legend.isEnabled = value
  }

  fun saveToGallery(promise: Promise) {
    appContext.registry.getModule<LinearChartModule>()?.moduleScope?.launch {
      val bitmap = linearChart.chartBitmap
      saveImage(bitmap, context, "MyApp")
      promise.resolve(null)
    }
  }

  init {
    linearChart.setPinchZoom(true)
    linearChart.setVisibleXRangeMaximum(10f)
    linearChart.setVisibleXRangeMinimum(1f)
    linearChart.animateX(200)
    linearChart.description.isEnabled = false
    linearChart.setBackgroundColor(Colors.background)
    linearChart.legend.textColor = Colors.text
    linearChart.axisRight.textColor = Colors.text
    linearChart.axisLeft.textColor = Colors.text
    linearChart.xAxis.textColor = Colors.text
    linearChart.setGridBackgroundColor(Colors.secondBackground)
    linearChart.xAxis.textSize = 12f
    linearChart.axisLeft.textSize = 12f
    linearChart.axisRight.textSize = 12f

    linearChart.setOnChartValueSelectedListener(object : OnChartValueSelectedListener {
      override fun onValueSelected(e: Entry, h: Highlight) {
        onDataSelect(mapOf(
          "x" to e.x,
          "y" to e.y
        ))
      }

      override fun onNothingSelected() = Unit
    })

    linearChart.onChartGestureListener = object : OnChartGestureListener {
      override fun onChartGestureStart(me: MotionEvent?, lastPerformedGesture: ChartTouchListener.ChartGesture?) = Unit

      override fun onChartGestureEnd(me: MotionEvent?, lastPerformedGesture: ChartTouchListener.ChartGesture?) = Unit

      override fun onChartLongPressed(me: MotionEvent?) = Unit

      override fun onChartDoubleTapped(me: MotionEvent?) = Unit

      override fun onChartSingleTapped(me: MotionEvent?) = Unit

      override fun onChartFling(me1: MotionEvent?, me2: MotionEvent?, velocityX: Float, velocityY: Float) = Unit

      override fun onChartScale(me: MotionEvent?, scaleX: Float, scaleY: Float) {
        onScale(mapOf(
          "scaleX" to scaleX,
          "scaleY" to scaleY
        ))
      }

      override fun onChartTranslate(me: MotionEvent?, dX: Float, dY: Float) = Unit
    }
    addView(linearChart, ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
    ))

  }

  private fun saveImage(bitmap: Bitmap, context: Context, folderName: String) {
    if (android.os.Build.VERSION.SDK_INT >= 29) {
      val values = contentValues()
      values.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/$folderName")
      values.put(MediaStore.Images.Media.IS_PENDING, true)
      // RELATIVE_PATH and IS_PENDING are introduced in API 29.

      val uri: Uri? = context.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
      if (uri != null) {
        saveImageToStream(bitmap, context.contentResolver.openOutputStream(uri))
        values.put(MediaStore.Images.Media.IS_PENDING, false)
        context.contentResolver.update(uri, values, null, null)
      }
    } else {
      val directory = File(Environment.getExternalStorageDirectory().toString() + separator + folderName)
      // getExternalStorageDirectory is deprecated in API 29

      if (!directory.exists()) {
        directory.mkdirs()
      }
      val fileName = System.currentTimeMillis().toString() + ".png"
      val file = File(directory, fileName)
      saveImageToStream(bitmap, FileOutputStream(file))
      val values = contentValues()
      values.put(MediaStore.Images.Media.DATA, file.absolutePath)
      // .DATA is deprecated in API 29
      context.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
    }
  }

  private fun contentValues(): ContentValues {
    val values = ContentValues()
    values.put(MediaStore.Images.Media.MIME_TYPE, "image/png")
    values.put(MediaStore.Images.Media.DATE_ADDED, System.currentTimeMillis() / 1000)
    values.put(MediaStore.Images.Media.DATE_TAKEN, System.currentTimeMillis())
    return values
  }

  private fun saveImageToStream(bitmap: Bitmap, outputStream: OutputStream?) {
    if (outputStream != null) {
      try {
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        outputStream.close()
      } catch (e: Exception) {
        e.printStackTrace()
      }
    }
  }
}
