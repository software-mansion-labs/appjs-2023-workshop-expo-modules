package expo.modules.workshopscharts

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import expo.modules.kotlin.Promise
import expo.modules.kotlin.activityresult.AppContextActivityResultContract
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.jni.JavaScriptFunction
import expo.modules.kotlin.jni.JavaScriptObject
import expo.modules.kotlin.jni.JavaScriptValue
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.objects.Object
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Required
import expo.modules.kotlin.sharedobjects.SharedObject
import kotlin.math.sqrt

class PickRingtoneContract : AppContextActivityResultContract<Int, Uri?> {
  override fun createIntent(context: Context, input: Int) =
    Intent(RingtoneManager.ACTION_RINGTONE_PICKER).apply {
      putExtra(RingtoneManager.EXTRA_RINGTONE_TYPE, input)
    }

  override fun parseResult(input: Int, resultCode: Int, intent: Intent?): Uri? {
    if (resultCode != Activity.RESULT_OK) {
      return null
    }
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      intent?.getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI, Uri::class.java)
    } else {
      @Suppress("DEPRECATION")
      intent?.getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI)
    }
  }
}

class SharedList<T> : SharedObject() {
  private val data = mutableListOf<T>()

  val size: Int
    get() = data.size

  fun add(newElement: T) {
    data.add(newElement)
  }

  operator fun get(index: Int): T {
    return data[index]
  }
}

class InvalidSizeException : CodedException(
  message = "Provided size was invalid"
)

data class Point(
  @Field
  @Required
  val x: Double,
  @Field
  @Required
  val y: Double
) : Record

class ChartsModule : Module() {
  var x = -1.0

  private lateinit var pickRingtone: AppContextActivityResultLauncher<Int, Uri?>

  override fun definition() = ModuleDefinition {
    Name("Charts")

    Function("add") { a: Int, b: Int ->
      return@Function a + b
    }

    AsyncFunction("addAsync") { a: Int, b: Int ->
      return@AsyncFunction a + b
    }

    Function("calculateAverage") { data: List<Double> ->
      return@Function data.average()
    }

    AsyncFunction("generateDataAsync") { size: Int ->
      if (size < 0) {
        throw InvalidSizeException()
      }

      return@AsyncFunction IntArray(size) { it }
    }

    Constants(
      "VERY_IMPORTANT_CONSTANT" to 2
    )

    Function("typeOf") { value: JavaScriptValue ->
      return@Function value.kind()
    }

    Function("modifyJSObject") { jsObject: JavaScriptObject ->
      jsObject.setProperty("expo", "is awesome")
    }

    Function("callJSFunction") { jsFunction: JavaScriptFunction<Double> ->
      return@Function jsFunction(100, 200)
    }

    AsyncFunction("objectSummary") { jsObject: Map<String, Any> ->
      return@AsyncFunction jsObject.toString()
    }

    Events("onNewData")

    AsyncFunction("sendOnNewDataEvent") {
      sendEvent("onNewData", mapOf(
        "value" to 123,
      ))
    }

    Function("calculateDistance") { p1: Point, p2: Point ->
      sqrt((p1.y - p2.y) * (p1.y - p2.y) + (p1.x - p2.x) * (p1.x - p2.x))
    }

    Property("x")
      .get { x }
      .set { newValue: Double -> x = newValue * newValue }

    RegisterActivityContracts {
      pickRingtone = registerForActivityResult(PickRingtoneContract())
    }

    AsyncFunction("pickRingtone") Coroutine { ->
      val result = pickRingtone.launch(RingtoneManager.TYPE_ALL)
      result
    }

    Class("Class") {
      Constructor { self: JavaScriptObject, value: Int? ->
        self.setProperty("property", value ?: 10)
      }

      Function("modifyProperty") { self: JavaScriptObject ->
        val p = self.getProperty("property").getInt()
        self.setProperty("property", p * p)
      }

      AsyncFunction("modifyPropertyAsync") { self: JavaScriptObject, promise: Promise ->
        appContext.executeOnJavaScriptThread {
          val p = self.getProperty("property").getInt()
          self.setProperty("property", p * p)
          promise.resolve(null)
        }
      }

      Function("createAnonymousObject") {
        return@Function Object {
          Function("calculate") { a: Int, b: Int, c: Int ->
            a + b + c
          }
        }
      }
    }

    Class(SharedList::class) {
      Constructor {
        return@Constructor SharedList<Int>()
      }

      Function("add") { sharedObject: SharedList<Int>, newValue: Int ->
        sharedObject.add(newValue)
      }

      Function("get") { sharedObject: SharedList<Int>, index: Int ->
        sharedObject[index]
      }

      Function("size") { sharedObject: SharedList<Int> ->
        sharedObject.size
      }

      AsyncFunction("addAsync") { sharedObject: SharedList<Int>, newValue: Int ->
        sharedObject.add(newValue)
      }

      AsyncFunction("getAsync") { sharedObject: SharedList<Int>, index: Int ->
        sharedObject[index]
      }

      AsyncFunction("sizeAsync") { sharedObject: SharedList<Int> ->
        sharedObject.size
      }
    }
  }
}
