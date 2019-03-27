import propgun from "propgun"

// const props = {
//   type: "linear",
//   draw: "45deg",
//   stops: { "0": "#ff00ff", "75%": "#8822CC", "100%": "#4488FF" },
//   ease: "ease.ease-in-out",
//   freq: 1 / 9
// }
const easedGradient = function (props, rawData) {
  const stops = props.stops
  const numStopsX3 = stops && (Object.keys(stops).length * 3)
  if (!stops || numStopsX3 <= 3) {
    throw new Error("must have at least 2 stops")
  }
  const gradientpropgun = propgun(stops)
  const freq = props.freq || (1 / numStopsX3)
  const values = []
  const ease = props.ease || "ease.linear"
  for (let i = 0; i < 1; i += freq) {
    values.push(gradientpropgun.pew(i, ease))
  }
  values.push(gradientpropgun.pew(1, ease))

  gradientpropgun.destroy()

  if (rawData) {
    return { freq, values }
  }

  const draw = typeof props.draw === "string" ? props.draw.replace(/[^a-z0-9 .%-]/gi, "") : ""
  let type = props.type
  if (draw && !type) {
    type = ["circle", "ellipse", "closest", "farthest"].find(keyword => draw.includes(keyword)) && "radial"
  }
  type = type || "linear"
  if (type !== "radial" && type !== "linear") {
    throw new Error("unknown gradient type")
  }

  // maybe TODO, could calculate each slope between values and only include compiled stops at
  // 0, 1, and anywhere the slope changes more than a few degrees to produce an optimized result
  const compiled = values.reduce((output, val, index) => {
    const percentage = (index * freq * 100).toPrecision(7).replace(/\.?0+$/, "")
    output += (val + " " + percentage + "%, ")
    return output
  }, "").replace(/, $/, "")
  return `${type}-gradient(${draw ? draw + ", " : ""}${compiled})`
}

export { easedGradient }
export default easedGradient
