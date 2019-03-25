import QUnit from "steal-qunit"
import easedGradient from "../src/eased-gradient.js"

const { test } = QUnit

QUnit.module("eased-gradient by PropJockey", function (hooks) {
  test("import should work", t => {
    t.ok(easedGradient, "exists")
  })
  test("throws if stops not provided or too few provided", t => {
    t.expect(2)
    try {
      easedGradient({
        stops: { "0": "#ff00ff" }
      })
    } catch (e) {
      t.equal(e.message, "must have at least 2 stops", "stop check")
    }
    try {
      easedGradient({})
    } catch (e) {
      t.equal(e.message, "must have at least 2 stops", "stop check")
    }
  })
  test("throws if unknown type provided", t => {
    t.expect(1)
    try {
      easedGradient({
        type: "nyan",
        stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
      })
    } catch (e) {
      t.equal(e.message, "unknown gradient type", "type check")
    }
  })
  test("can return rawData early instead", t => {
    const getRawData = true
    const { freq, values } = easedGradient({
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    }, getRawData)
    t.equal(freq, 0.25, "frequency returned correctly")
    t.equal(values.length, 5, "correct number of values returned")
    t.equal(values[0], "#ff00ff", "position 0 color is correct")
    t.equal(values[1], "#d70bee", "position 1 color is correct")
    t.equal(values[2], "#b017dd", "position 2 color is correct")
    t.equal(values[3], "#8822cc", "position 3 color is correct")
    t.equal(values[4], "#4488ff", "position 4 color is correct")
  })
  test("defaults to linear gradient", t => {
    const gradientCss = easedGradient({
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "linear-gradient(#ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "correct gradient returned")
  })
  test("can override type and set radial gradient", t => {
    const gradientCss = easedGradient({
      type: "radial",
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "radial-gradient(#ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "correct gradient returned")
  })
  test("defaults to radial gradient if draw contains specific keywords and type isn't explicityly set", t => {
    let gradientCss = easedGradient({
      draw: "closest-side",
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "radial-gradient(closest-side, #ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "correct gradient returned")

    gradientCss = easedGradient({
      draw: "farthest-corner",
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "radial-gradient(farthest-corner, #ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "correct gradient returned")

    gradientCss = easedGradient({
      draw: "circle at 100%",
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "radial-gradient(circle at 100%, #ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "correct gradient returned")

    gradientCss = easedGradient({
      draw: "ellipse at bottom",
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "radial-gradient(ellipse at bottom, #ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "correct gradient returned")

    gradientCss = easedGradient({
      type: "linear",
      draw: "ellipse at bottom",
      freq: 0.25,
      stops: { "0": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    t.equal(gradientCss, "linear-gradient(ellipse at bottom, #ff00ff 0%, #d70bee 25%, #b017dd 50%, #8822cc 75%, #4488ff 100%)", "invalid css but correctly returned")
  })
  test("can specify the easing which is handled by propgun in the PropJockey hydrationStore format", t => {
    const gradientCss = easedGradient({
      ease: "ease.ease-in-out",
      stops: { "0": "#ff00ff", "0.125": "#ff00ff", "75%": "#8822cc", "100%": "#4488ff" }
    })
    const shouldbe = "linear-gradient(#ff00ff 0%, #ff00ff 8.333333%, #ff00ff 16.66667%, #fe00ff 25%, #eb06f6 33.33333%, #d20dec 41.66667%, #b814e0 50%, #9d1cd5 58.33333%, #8329d0 66.66667%, #6753e5 75%, #5371f3 83.33333%, #4882fc 91.66667%, #4488ff 100%)"
    t.equal(gradientCss, shouldbe, "correct gradient returned")
  })
})
