package expo.modules.workshopscharts

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.os.Environment
import android.os.SystemClock
import android.provider.MediaStore
import android.view.MotionEvent
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.YAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.highlight.Highlight
import com.github.mikephil.charting.listener.ChartTouchListener
import com.github.mikephil.charting.listener.OnChartGestureListener
import com.github.mikephil.charting.listener.OnChartValueSelectedListener
import expo.modules.kotlin.AppContext
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream

object Utils {
  fun initCharts(appContext: AppContext) {
    com.github.mikephil.charting.utils.Utils.init(appContext.reactContext!!)
  }

  fun LineChart.applyDefaultSettings() {
    setPinchZoom(true)
    setVisibleXRangeMaximum(10f)
    setVisibleXRangeMinimum(1f)
    animateX(200)
    description.isEnabled = false
    setBackgroundColor(Colors.background)
    legend.textColor = Colors.text
    axisRight.textColor = Colors.text
    axisLeft.textColor = Colors.text
    xAxis.textColor = Colors.text
    setGridBackgroundColor(Colors.secondBackground)
    xAxis.textSize = 12f
    axisLeft.textSize = 12f
    axisRight.textSize = 12f
  }

  fun LineDataSet.applyDefaultSettings() {
    mode = LineDataSet.Mode.CUBIC_BEZIER
    colors = listOf(Colors.primary)
    lineWidth = 10f
    valueTextColor = Colors.text
    valueTextSize = 12f
  }

  fun LineChart.applyNewData(
    dataSet: LineDataSet
  ) {
    val prevDataSet = data

    data = LineData(dataSet)
    setVisibleXRangeMinimum(1f)
    setVisibleYRangeMinimum(1f, YAxis.AxisDependency.LEFT)
    setVisibleXRangeMaximum(10f)

    if (prevDataSet == null || prevDataSet.dataSetCount == 0) {
      fitScreen()
      notifyDataSetChanged()
      invalidate()
      setVisibleXRangeMinimum(1f)
      setVisibleYRangeMinimum(1f, YAxis.AxisDependency.LEFT)
      setVisibleXRangeMaximum(10f)
      return
    }

    notifyDataSetChanged()
    val wasScrolled = prevDataSet.xMax - highestVisibleX > 2f
    if (wasScrolled) {
      invalidate()
    } else {
      moveTo(data.xMax + 1f)
    }
  }

  fun LineChart.setOnChartValueSelectedListener(listener: (entry: Entry, highlight: Highlight) -> Unit) {
    setOnChartValueSelectedListener(object : OnChartValueSelectedListener {
      override fun onValueSelected(e: Entry, h: Highlight) {
        listener(e, h)
      }

      override fun onNothingSelected() = Unit
    })
  }

  fun LineChart.setOnChartScale(listener: (event: MotionEvent?, scaleX: Float, scaleY: Float) -> Unit) {
    onChartGestureListener = object : OnChartGestureListener {
      override fun onChartGestureStart(me: MotionEvent?, lastPerformedGesture: ChartTouchListener.ChartGesture?) = Unit

      override fun onChartGestureEnd(me: MotionEvent?, lastPerformedGesture: ChartTouchListener.ChartGesture?) = Unit

      override fun onChartLongPressed(me: MotionEvent?) = Unit

      override fun onChartDoubleTapped(me: MotionEvent?) = Unit

      override fun onChartSingleTapped(me: MotionEvent?) = Unit

      override fun onChartFling(me1: MotionEvent?, me2: MotionEvent?, velocityX: Float, velocityY: Float) = Unit

      override fun onChartScale(me: MotionEvent?, scaleX: Float, scaleY: Float) {
        listener(me, scaleX, scaleY)
      }

      override fun onChartTranslate(me: MotionEvent?, dX: Float, dY: Float) = Unit
    }
  }

  fun LineChart.moveTo(
    x: Float,
    y: Float = 0f,
    axisDependency: YAxis.AxisDependency = YAxis.AxisDependency.LEFT,
    duration: Long = 300
  ) {
    isDragDecelerationEnabled = false
    dispatchTouchEvent(
      MotionEvent.obtain(SystemClock.uptimeMillis(), SystemClock.uptimeMillis(), MotionEvent.ACTION_DOWN, 0f, 0f, 0)
    )
    moveViewToAnimated(x, y, axisDependency, duration)
    postDelayed({
      isDragDecelerationEnabled = true
    }, duration + 100)
  }

  fun saveImage(bitmap: Bitmap, context: Context, folderName: String) {
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
      val directory = File(Environment.getExternalStorageDirectory().toString() + File.separator + folderName)
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
