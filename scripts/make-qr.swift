import AppKit
import CoreImage

let urlText = "http://192.168.1.5:5174/"
let outputPath = "/Users/takahata/Documents/New project/スマホ用QRコード.png"

guard let data = urlText.data(using: .utf8),
      let filter = CIFilter(name: "CIQRCodeGenerator") else {
  fatalError("QRコードを作成できませんでした。")
}

filter.setValue(data, forKey: "inputMessage")
filter.setValue("Q", forKey: "inputCorrectionLevel")

guard let qrImage = filter.outputImage else {
  fatalError("QRコード画像を作成できませんでした。")
}

let scale = 14.0
let transformed = qrImage.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
let context = CIContext(options: nil)

guard let cgImage = context.createCGImage(transformed, from: transformed.extent) else {
  fatalError("QRコード画像を書き出せませんでした。")
}

let padding = 96
let labelHeight = 150
let qrWidth = cgImage.width
let qrHeight = cgImage.height
let canvasWidth = qrWidth + padding * 2
let canvasHeight = qrHeight + padding * 2 + labelHeight

let image = NSImage(size: NSSize(width: canvasWidth, height: canvasHeight))
image.lockFocus()

NSColor.white.setFill()
NSRect(x: 0, y: 0, width: canvasWidth, height: canvasHeight).fill()

let title = "道エネSSサービスマスター"
let subtitle = "スマホで読み取って開く"
let code = "合言葉: 583"

let titleAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.boldSystemFont(ofSize: 38),
  .foregroundColor: NSColor(calibratedRed: 0.10, green: 0.30, blue: 0.75, alpha: 1)
]
let subtitleAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.boldSystemFont(ofSize: 28),
  .foregroundColor: NSColor(calibratedRed: 0.95, green: 0.34, blue: 0.08, alpha: 1)
]
let codeAttributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.boldSystemFont(ofSize: 30),
  .foregroundColor: NSColor.black
]

func drawCentered(_ text: String, y: CGFloat, attributes: [NSAttributedString.Key: Any]) {
  let attributed = NSAttributedString(string: text, attributes: attributes)
  let size = attributed.size()
  attributed.draw(at: NSPoint(x: (CGFloat(canvasWidth) - size.width) / 2, y: y))
}

drawCentered(title, y: CGFloat(canvasHeight - 58), attributes: titleAttributes)
drawCentered(subtitle, y: CGFloat(canvasHeight - 98), attributes: subtitleAttributes)
drawCentered(code, y: CGFloat(canvasHeight - 138), attributes: codeAttributes)

let qrRect = NSRect(x: padding, y: padding, width: qrWidth, height: qrHeight)
NSGraphicsContext.current?.cgContext.interpolationQuality = .none
NSImage(cgImage: cgImage, size: NSSize(width: qrWidth, height: qrHeight)).draw(in: qrRect)

image.unlockFocus()

guard let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let png = bitmap.representation(using: .png, properties: [:]) else {
  fatalError("PNGへ変換できませんでした。")
}

try png.write(to: URL(fileURLWithPath: outputPath))
print(outputPath)
