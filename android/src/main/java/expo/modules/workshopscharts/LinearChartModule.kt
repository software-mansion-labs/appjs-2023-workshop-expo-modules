package expo.modules.workshopscharts

import android.Manifest
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.data.LineDataSet.Mode
import expo.modules.core.errors.ContextDestroyedException
import expo.modules.interfaces.permissions.PermissionsStatus
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.jni.JavaScriptFunction
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Required
import expo.modules.kotlin.sharedobjects.SharedObject
import expo.modules.kotlin.typedarray.Uint8Array
import expo.modules.kotlin.types.Enumerable
import expo.modules.workshopscharts.Utils.applyDefaultSettings
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

enum class DataMode(val value: Int) : Enumerable {
  LINEAR(0),
  STEPPED(1),
  CUBIC_BEZIER(2),
  HORIZONTAL_BEZIER(3);

  fun toLineDataSetMode(): Mode {
    return when (this) {
      LINEAR -> Mode.LINEAR
      STEPPED -> Mode.STEPPED
      CUBIC_BEZIER -> Mode.CUBIC_BEZIER
      HORIZONTAL_BEZIER -> Mode.HORIZONTAL_BEZIER
    }
  }
}

class LinearDataSeries : Record {
  @Field
  @Required
  val values: List<DataEntry> = emptyList()

  @Field
  @Required
  val label: String = ""

  @Field
  val mode: DataMode = DataMode.LINEAR

  @Field
  val lineWidth: Float = 5f

  @Field
  val textSize: Float = 10f
}

data class DataEntry(
  @Field val x: Float,
  @Field val y: Float
) : Record

class UserRejectedPermissionsException : CodedException(
  message = "User rejected permissions"
)

class SharedDataSetOptions : Record {
  @Field
  val mode: DataMode = DataMode.LINEAR

  @Field
  val lineWidth: Float = 5f
}

class SharedDataSet(
  initValues: Uint8Array? = null,
  options: SharedDataSetOptions? = null
) : SharedObject() {
  fun interface Listener {
    fun onNewData(newDataSet: LineDataSet)
  }

  private val listeners = mutableListOf<Listener>()

  private val dataSet = LineDataSet(
    initValues
      ?.withIndex()
      ?.map { (index, value) ->
        Entry((index + 1).toFloat(), value.toFloat())
      }
      ?.toMutableList() ?: mutableListOf<Entry?>(),
    "label"
  ).also {
    it.applyDefaultSettings()
    options?.mode?.toLineDataSetMode()?.let { mode->
      it.mode = mode
    }
    options?.lineWidth?.let { lineWidth ->
      it.lineWidth = lineWidth
    }
  }

  internal var transformer: JavaScriptFunction<Float>? = null

  fun addListener(newDataListener: Listener) {
    listeners.add(newDataListener)

    if (dataSet.entryCount != 0) {
      newDataListener.onNewData(dataSet)
    }
  }

  fun removeListener(listener: Listener?) {
    if (listener == null) {
      return
    }
    listeners.remove(listener)
  }

  fun addData(value: Float) {
    dataSet.addEntry(
      Entry(
        (dataSet.entryCount + 1).toFloat(),
        value
      )
    )
    listeners.forEach { it.onNewData(dataSet) }
  }
}

class LinearChartModule : Module() {
  private var wasScopedInitialized = false
  internal val moduleScope by lazy {
    wasScopedInitialized = true
    CoroutineScope(
      Dispatchers.IO +
        SupervisorJob() +
        CoroutineName("LinearChartModuleScope")
    )
  }

  override fun definition() = ModuleDefinition {
    Name("LinearChart")

    OnCreate {
      Utils.initCharts(appContext)
    }

    OnDestroy {
      if (wasScopedInitialized) {
        moduleScope.cancel(ContextDestroyedException())
      }
    }

    Class(SharedDataSet::class) {
      Constructor { initValues: Uint8Array?, options: SharedDataSetOptions? ->
        return@Constructor SharedDataSet(initValues, options)
      }

      Function("setDataTransformer") { sharedObject: SharedDataSet, transformer: JavaScriptFunction<Float> ->
        sharedObject.transformer = transformer
      }

      Function("add") { sharedObject: SharedDataSet, newY: Float ->
        val y = sharedObject.transformer?.invoke(newY) ?: newY
        appContext.mainQueue.launch {
          sharedObject.addData(y)
        }
      }
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

      AsyncFunction("moveToStart") { view: LinearChartView ->
        view.moveToStart()
      }

      AsyncFunction("moveToEnd") { view: LinearChartView ->
        view.moveToEnd()
      }

      AsyncFunction("moveToPoint") { view: LinearChartView, x: Float, y: Float ->
        view.moveToPoint(x, y)
      }

      AsyncFunction("saveToGallery") { view: LinearChartView, promise: Promise ->
        val permissionManager = appContext.permissions
          ?: throw Exceptions.MissingPermissions()
        permissionManager.askForPermissions({ result ->
          if (result[Manifest.permission.WRITE_EXTERNAL_STORAGE]?.status != PermissionsStatus.GRANTED) {
            promise.reject(UserRejectedPermissionsException())
            return@askForPermissions
          }

          view.saveToGallery(promise)
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE)
      }

      AsyncFunction("setDataSet") { view: LinearChartView, sharedDataSet: SharedDataSet ->
        view.setSharedDataSet(sharedDataSet)
      }

      Events("onDataSelect", "onScale")
    }
  }
}
