extension UIColor {
  public convenience init(hex: String) {
    let r, g, b: CGFloat

    if hex.hasPrefix("#") {
      let start = hex.index(hex.startIndex, offsetBy: 1)
      let hexColor = String(hex[start...])

      if hexColor.count == 6 {
        let scanner = Scanner(string: hexColor)
        var hexNumber: UInt64 = 0

        if scanner.scanHexInt64(&hexNumber) {
          r = CGFloat((hexNumber & 0xff0000) >> 16) / 255
          g = CGFloat((hexNumber & 0x00ff00) >> 8) / 255
          b = CGFloat(hexNumber & 0x0000ff) / 255

          self.init(red: r, green: g, blue: b, alpha: 255)
          return
        }
      }
    }

    self.init(red: 0, green: 0, blue: 0, alpha: 255)
    return
  }
}

class Colors {
  static let primary = UIColor(hex: "#ff5555")
  static let secondary = UIColor(hex: "#44475a")
  static let text = UIColor(hex: "#f8f8f2")
  static let secondBackground = UIColor(hex: "#6272a4")
  static let background = UIColor(hex: "#282a36")
}
