define(['pex/fx/FXGraph', 'lib/text!pex/fx/Downsample2.glsl', 'pex/geom/Vec2'], function(FXGraph, Downsample2GLSL, Vec2) {
  FXGraph.prototype.downsample2 = function(options) {
    options = options || {};

    var outputSize = this.getOutputSize(options.width, options.height);
    outputSize.width /= 2;
    outputSize.height /= 2;

    var rt = this.getRenderTarget(outputSize.width, outputSize.height, options.depth, options.bpp);
    var source = this.getSourceTexture();

    var program = this.getShader(Downsample2GLSL);
    program.use();
    program.uniforms.textureSize(Vec2.fromValues(source.width, source.height));
    rt.bindAndClear();
    source.bind();
    this.drawFullScreenQuad(outputSize.width, outputSize.height, program);
    rt.unbind();

    rt.name = 'downsample2';
    this.stack.push(rt);

    return this;

  }
})