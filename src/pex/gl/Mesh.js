// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Context, Mat4, Mesh, Quat, RenderableGeometry, Vec3, _ref;

  Context = require('pex/gl/Context');
  _ref = require('pex/geom'), Vec3 = _ref.Vec3, Quat = _ref.Quat, Mat4 = _ref.Mat4;
  RenderableGeometry = require('pex/gl/RenderableGeometry');
  return Mesh = (function() {
    function Mesh(geometry, material, options) {
      var _ref1;

      this.gl = Context.currentContext.gl;
      this.geometry = geometry;
      this.material = material;
      options = options || {};
      this.primitiveType = options.primitiveType;
      if ((_ref1 = this.primitiveType) == null) {
        this.primitiveType = this.gl.TRIANGLES;
      }
      if (options.useEdges) {
        this.primitiveType = this.gl.LINES;
      }
      this.useEdges = options.useEdges;
      this.position = Vec3.create(0, 0, 0);
      this.rotation = Quat.create();
      this.scale = Vec3.create(1, 1, 1);
      this.modelWorldMatrix = Mat4.create();
      this.modelViewMatrix = Mat4.create();
      this.rotationMatrix = Mat4.create();
      this.normalMatrix = Mat4.create();
    }

    Mesh.prototype.draw = function(camera) {
      var attrib, materialUniforms, name, num, program, programUniforms, _ref1, _results;

      if (this.geometry.isDirty()) {
        this.geometry.compile();
      }
      programUniforms = this.material.program.uniforms;
      materialUniforms = this.material.uniforms;
      if (camera) {
        this.updateMatrices(camera);
        if (programUniforms.projectionMatrix) {
          materialUniforms.projectionMatrix = camera.getProjectionMatrix();
        }
        if (programUniforms.modelViewMatrix) {
          materialUniforms.modelViewMatrix = this.modelViewMatrix;
        }
        if (programUniforms.viewMatrix) {
          materialUniforms.viewMatrix = camera.getViewMatrix();
        }
        if (programUniforms.modelWorldMatrix) {
          materialUniforms.modelWorldMatrix = this.modelWorldMatrix;
        }
        if (programUniforms.normalMatrix) {
          materialUniforms.normalMatrix = this.normalMatrix;
        }
      }
      this.material.use();
      program = this.material.program;
      _ref1 = this.geometry.attribs;
      for (name in _ref1) {
        attrib = _ref1[name];
        attrib.location = this.gl.getAttribLocation(program.handle, attrib.name);
        if (attrib.location >= 0) {
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer.handle);
          this.gl.vertexAttribPointer(attrib.location, attrib.buffer.elementSize, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray(attrib.location);
        }
      }
      if (this.geometry.faces && this.geometry.faces.length > 0 && !this.useEdges) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.geometry.faces.buffer.handle);
        this.gl.drawElements(this.primitiveType, this.geometry.faces.buffer.dataBuf.length, this.gl.UNSIGNED_SHORT, 0);
      } else if (this.geometry.edges && this.useEdges) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.geometry.edges.buffer.handle);
        this.gl.drawElements(this.primitiveType, this.geometry.edges.buffer.dataBuf.length, this.gl.UNSIGNED_SHORT, 0);
      } else if (this.geometry.vertices) {
        num = this.geometry.vertices.buffer.dataBuf.length / 3;
        this.gl.drawArrays(this.primitiveType, 0, num);
      }
      _results = [];
      for (name in this.attributes) {
        attrib = this.attributes[name];
        if (attrib.location >= 0) {
          _results.push(this.gl.disableVertexAttribArray(attrib.location));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Mesh.prototype.resetAttribLocations = function() {
      var attrib, name, _results;

      _results = [];
      for (name in this.attributes) {
        attrib = this.attributes[name];
        _results.push(attrib.location = -1);
      }
      return _results;
    };

    Mesh.prototype.updateMatrices = function(camera) {
      this.rotation.toMat4(this.rotationMatrix);
      this.modelWorldMatrix.identity().translate(this.position.x, this.position.y, this.position.z).mul(this.rotationMatrix).scale(this.scale.x, this.scale.y, this.scale.z);
      this.modelViewMatrix.copy(camera.getViewMatrix()).mul(this.modelWorldMatrix);
      return this.normalMatrix.copy(this.modelViewMatrix).invert().transpose();
    };

    Mesh.prototype.getMaterial = function() {
      return this.material;
    };

    Mesh.prototype.setMaterial = function(material) {
      this.material = material;
      return this.resetAttribLocations();
    };

    Mesh.prototype.getProgram = function() {
      return this.material.program;
    };

    Mesh.prototype.setProgram = function(program) {
      this.material.program = program;
      return this.resetAttribLocations();
    };

    return Mesh;

  })();
});
