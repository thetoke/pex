//Module wrapper for materials classes.
define(
  [
    'pex/materials/SolidColor',
    'pex/materials/ShowNormals',
    'pex/materials/Textured',
    'pex/materials/ShowTexCoords',
    'pex/materials/ShowDepth',
    'pex/materials/ShowColors',
    'pex/materials/PackDepth',
    'pex/materials/Diffuse',
    'pex/materials/Test',
    'pex/materials/BlinnPhong',
    'pex/materials/PointSpriteTextured',
  ],
  function(SolidColor, ShowNormals, Textured, ShowTexCoords, ShowDepth, ShowColors, PackDepth, Diffuse, Test, BlinnPhong, PointSpriteTextured) {
    return {
      SolidColor : SolidColor,
      ShowNormals : ShowNormals,
      Textured : Textured,
      ShowTexCoords : ShowTexCoords,
      ShowDepth : ShowDepth,
      ShowColors : ShowColors,
      PackDepth : PackDepth,
      Diffuse : Diffuse,
      Test : Test,
      BlinnPhong : BlinnPhong,
      PointSpriteTextured : PointSpriteTextured
    };
  }
);
