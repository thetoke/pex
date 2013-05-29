// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Context, Face3, Face4, Mat4, Mesh, Quat, Vec3, _ref;

  Context = require('pex/gl/Context');
  _ref = require('pex/geom'), Vec3 = _ref.Vec3, Quat = _ref.Quat, Mat4 = _ref.Mat4, Face3 = _ref.Face3, Face4 = _ref.Face4;
  return Mesh = (function() {
    function Mesh(geometry, material, options) {
      var _ref1;

      this.gl = Context.currentContext.gl;
      this.geometry = geometry;
      this.material = material;
      options = options || {};
      this.gl = Context.currentContext.gl;
      this.primitiveType = options.primitiveType;
      if ((_ref1 = this.primitiveType) == null) {
        this.primitiveType = this.gl.TRIANGLES;
      }
      this.attributes = {};
      this.usage = this.gl.STATIC_DRAW;
      this.addAttrib("position", geometry.attribs.position.data, geometry.attribs.position.elementSize);
      if (geometry.attribs.normal) {
        this.addAttrib("normal", geometry.attribs.normal.data, geometry.attribs.normal.elementSize);
      }
      if (geometry.attribs.texCoord) {
        this.addAttrib("texCoord", geometry.attribs.texCoord.data, geometry.attribs.texCoord.elementSize);
      }
      if (geometry.attribs.color) {
        this.addAttrib("color", geometry.attribs.color.data, geometry.attribs.color.elementSize);
      }
      this.position = Vec3.create(0, 0, 0);
      this.rotation = Quat.create();
      this.scale = Vec3.create(1, 1, 1);
      this.modelWorldMatrix = Mat4.create();
      this.modelViewMatrix = Mat4.create();
      this.rotationMatrix = Mat4.create();
      this.normalMatrix = Mat4.create();
      this.updateIndices(geometry);
    }

    Mesh.prototype.addAttrib = function(name, data, elementSize, usage) {
      var attrib;

      elementSize = elementSize || 3;
      usage = usage || this.usage;
      attrib = {};
      attrib.name = name;
      attrib.data = data;
      attrib.dataBuf = data.buf;
      attrib.elementSize = elementSize;
      attrib.location = -1;
      attrib.buffer = this.gl.createBuffer();
      attrib.usage = usage;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, attrib.dataBuf, usage);
      return this.attributes[attrib.name] = attrib;
    };

    Mesh.prototype.updateIndices = function(geometry) {
      var data, oldArrayBinding;

      if (this.indices === undefined) {
        this.indices = {};
        this.indices.buffer = this.gl.createBuffer();
      }
      data = [];
      if (geometry.faces.length > 0) {
        geometry.faces.forEach(function(face) {
          if (face.constructor === Face4) {
            data.push(face.a);
            data.push(face.b);
            data.push(face.d);
            data.push(face.d);
            data.push(face.b);
            data.push(face.c);
          }
          if (face.constructor === Face3) {
            data.push(face.a);
            data.push(face.b);
            return data.push(face.c);
          }
        });
      }
      this.indices.data = new Uint16Array(data);
      oldArrayBinding = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.data, this.usage);
      return this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, oldArrayBinding);
    };

    Mesh.prototype.draw = function(camera) {
      var attrib, materialUniforms, name, num, program, programUniforms, _ref1, _results;

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
      _ref1 = this.attributes;
      for (name in _ref1) {
        attrib = _ref1[name];
        if (attrib.location === 'undefined' || attrib.location === -1) {
          attrib.location = this.gl.getAttribLocation(program.handle, attrib.name);
        }
        if (attrib.location >= 0) {
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attrib.buffer);
          if (this.geometry.attribs[name].isDirty) {
            attrib.dataBuf = this.geometry.attribs[name].buf;
            if (this.geometry.attribs[name].type === 'Vec2') {
              this.geometry.attribs[name].data.forEach(function(v, i) {
                attrib.dataBuf[i * 2 + 0] = v.x;
                return attrib.dataBuf[i * 2 + 1] = v.y;
              });
            }
            if (this.geometry.attribs[name].type === 'Vec3') {
              this.geometry.attribs[name].data.forEach(function(v, i) {
                attrib.dataBuf[i * 3 + 0] = v.x;
                attrib.dataBuf[i * 3 + 1] = v.y;
                return attrib.dataBuf[i * 3 + 2] = v.z;
              });
            }
            this.gl.bufferData(this.gl.ARRAY_BUFFER, attrib.dataBuf, attrib.usage);
            this.geometry.attribs[name].isDirty = false;
          }
          this.gl.vertexAttribPointer(attrib.location, attrib.elementSize, this.gl.FLOAT, false, 0, 0);
          this.gl.enableVertexAttribArray(attrib.location);
        }
      }
      if (this.indices && this.indices.data && this.indices.data.length > 0) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
        this.gl.drawElements(this.primitiveType, this.indices.data.length, this.gl.UNSIGNED_SHORT, 0);
      } else if (this.attributes["position"]) {
        num = this.attributes["position"].dataBuf.length / 3;
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
      this.rotationMatrix.identity();
      this.modelWorldMatrix.identity().translate(this.position.x, this.position.y, this.position.z).mul(this.rotationMatrix).scale(this.scale.x, this.scale.y, this.scale.z);
      this.modelViewMatrix.copy(camera.getViewMatrix()).mul(this.modelWorldMatrix);
      return this.normalMatrix.copy(this.modelViewMatrix).invert().transpose();
    };

    return Mesh;

  })();
  /*
    Mesh::getMaterial = ->
      @material
  
    Mesh::setMaterial = (material) ->
      @material = material
      @resetAttribLocations()
  
    Mesh::getProgram = ->
      @material.program
  
    Mesh::setProgram = (program) ->
      @material.program = program
      @resetAttribLocations()
  
    Mesh
  */

});
