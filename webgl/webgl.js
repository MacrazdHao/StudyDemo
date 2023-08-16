const WhiteBoardDom = document.getElementById('WhiteBoard')
const Gl = WhiteBoardDom.getContext("webgl") ||
  WhiteBoardDom.getContext("experimental-webgl");
let WindowWdith = document.body.offsetWidth
let WindowHeight = document.body.offsetHeight

WhiteBoardDom.width = WindowWdith
WhiteBoardDom.height = WindowHeight

const WhiteBoardWidth = WhiteBoardDom.width
const WhiteBoardHeight = WhiteBoardDom.height

window.onresize = () => {
  WindowWdith = document.body.offsetWidth
  WindowHeight = document.body.offsetHeight
  WhiteBoardDom.width = WindowWdith
  WhiteBoardDom.height = WindowHeight
}
let MousePos = { x: 0, y: 0, color: getRandomColor() }

let Balls = []

// 随机数
function getIntRandom(max = 1, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 随机小数
function getFloatRandom(max = 1, min = 0) {
  return Math.random() * (max - min) + min
}
// 随机数(可去除部分数)
function getExcludeRandom(max = 0, min = 1, excludes = []) {
  let num = getIntRandom(max, min)
  while (excludes.includes(num)) {
    num = getIntRandom(max, min)
  }
  return num
}
// 随机色
function getRandomColor(minR = 0, maxR = 255, minG = 0, maxG = 255, minB = 0, maxB = 255) {
  const colorR = getIntRandom(maxR, minR)
  const colorG = getIntRandom(maxG, minG)
  const colorB = getIntRandom(maxB, minB)
  return `rgb(${colorR}, ${colorG}, ${colorB})`
}

function setRectangle(Gl, x, y, width, height) {
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height;
  Gl.bufferData(Gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), Gl.STATIC_DRAW);
}

function main() {
  let image = new Image();
  image.src = "http://127.0.0.1:5500/webgl/leaves.jpg";
  image.onload = function () {
    render(image);
  };
}

function render(image) {

  // 
  let program = webglUtils.createProgramFromScripts(Gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // 将写好的片段着色器和顶点着色器引用到gl对象中
  let positionLocation = Gl.getAttribLocation(program, "a_position");
  let texcoordLocation = Gl.getAttribLocation(program, "a_texCoord");

  // 创建缓冲区
  let positionBuffer = Gl.createBuffer();

  // 绑定缓冲区
  Gl.bindBuffer(Gl.ARRAY_BUFFER, positionBuffer);
  // 
  setRectangle(Gl, 0, 0, image.width, image.height);

  // provide texture coordinates for the rectangle.
  let texcoordBuffer = Gl.createBuffer();
  Gl.bindBuffer(Gl.ARRAY_BUFFER, texcoordBuffer);
  Gl.bufferData(Gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), Gl.STATIC_DRAW);

  // Create a texture.
  let texture = Gl.createTexture();
  Gl.bindTexture(Gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  Gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_WRAP_S, Gl.CLAMP_TO_EDGE);
  Gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_WRAP_T, Gl.CLAMP_TO_EDGE);
  Gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MIN_FILTER, Gl.NEAREST);
  Gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MAG_FILTER, Gl.NEAREST);

  // Upload the image into the texture.
  Gl.texImage2D(Gl.TEXTURE_2D, 0, Gl.RGBA, Gl.RGBA, Gl.UNSIGNED_BYTE, image);

  // lookup uniforms
  let resolutionLocation = Gl.getUniformLocation(program, "u_resolution");

  webglUtils.resizeCanvasToDisplaySize(Gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  Gl.viewport(0, 0, Gl.canvas.width, Gl.canvas.height);

  // Clear the canvas
  Gl.clearColor(0, 0, 0, 0);
  Gl.clear(Gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  Gl.useProgram(program);

  // Turn on the position attribute
  Gl.enableVertexAttribArray(positionLocation);

  // Bind the position buffer.
  Gl.bindBuffer(Gl.ARRAY_BUFFER, positionBuffer);

  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  let size = 2;          // 2 components per iteration
  let type = Gl.FLOAT;   // the data is 32bit floats
  let normalize = false; // don't normalize the data
  let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0;        // start at the beginning of the buffer
  Gl.vertexAttribPointer(
    positionLocation, size, type, normalize, stride, offset);

  // Turn on the texcoord attribute
  Gl.enableVertexAttribArray(texcoordLocation);

  // bind the texcoord buffer.
  Gl.bindBuffer(Gl.ARRAY_BUFFER, texcoordBuffer);

  Gl.vertexAttribPointer(
    texcoordLocation, size, type, normalize, stride, offset);

  // set the resolution
  Gl.uniform2f(resolutionLocation, Gl.canvas.width, Gl.canvas.height);

  // Draw the rectangle.
  let primitiveType = Gl.TRIANGLES;
  let count = 6;
  Gl.drawArrays(primitiveType, offset, count);
}

main();
