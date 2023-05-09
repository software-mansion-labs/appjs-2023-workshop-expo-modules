package expo.modules.workshopscharts

import android.Manifest
import com.github.mikephil.charting.data.LineDataSet
import expo.modules.core.errors.ContextDestroyedException
import expo.modules.interfaces.permissions.PermissionsStatus
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Required
import expo.modules.kotlin.types.Enumerable
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel

class UserRejectedPermissionsException : CodedException(
  message = "User rejected permissions"
)

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
    }
  }
}
