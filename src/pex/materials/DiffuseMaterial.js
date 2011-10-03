define(["pex/core/Core", "pex/util/Util"], function(Core, Util) {

  var vert = ""
    + "uniform mat4 projectionMatrix;"
    + "uniform mat4 modelViewMatrix;"
    + "attribute vec3 position;"
    + "attribute vec3 normal;"
    + "varying vec3 vNormal;"
    + "void main() {"
    +  "vNormal = normal;"
    +  "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);"
    +  "gl_PointSize = 2.0;"
    + "}";

  var frag = ""
    + "uniform vec4 color;"
    + "uniform vec3 lightPos;"
    + "varying vec3 vNormal;"
    + "void main() {"
    +  "vec3 N = normalize(vNormal);"
    +  "vec3 L = normalize(lightPos);"
    +  "float NdotL = max(0.1, dot(N, L));"
    +  "gl_FragColor = color * NdotL;"
    + "}";


  function DiffuseMaterial(uniforms) {
      this.gl = Core.Context.currentContext;
      this.program = new Core.Program(vert, frag);

      var defaults = {
       color : new Core.Vec4(1, 1, 1, 1),
       lightPos : new Core.Vec3(10, 10, -10)
      }

      this.uniforms = Util.mergeObjects(defaults, uniforms);
  }

  DiffuseMaterial.prototype = new Core.Material();

  return DiffuseMaterial;
});