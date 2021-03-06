var LeveledXMItemEntity = function(mesh, xm_mesh, defaultQuality) {

  var DEFAULT_QUALITY = defaultQuality.clone();

  var ITEM_MESH = mesh,
    ITEM_TEXTURE = 'FlipCardTexture',
    ITEM_SHADER = 'bicolor_textured',
    CORE_MESH = xm_mesh,
    CORE_TEXTURE = 'ObjectXMTexture',
    CORE_SHADER = 'xm';

  var leveledItem = function(loader, quality) {
    Entity.call(this, loader);
    quality = quality || DEFAULT_QUALITY;
    var itemGeometry = loader.getAsset('geometry', ITEM_MESH);
    var itemTexture = loader.getAsset('texture', ITEM_TEXTURE);
    var itemShaders = loader.getAsset('shaders', ITEM_SHADER);
    if(!itemGeometry)
    {
      throw 'Unable to load Geometry ' + ITEM_MESH;
    }
    if(!itemTexture)
    {
      throw 'Unable to load texture ' + ITEM_TEXTURE;
    }
    if(!itemShaders)
    {
      throw 'Unable to load shaders: ' + ITEM_SHADER;
    }
    this.item = new BicoloredDrawable(itemTexture, this.quality);
    this.item.init(itemGeometry, itemShaders);
    var coreGeometry = loader.getAsset('geometry', CORE_MESH);
    var coreTexture = loader.getAsset('texture', CORE_TEXTURE);
    var coreShaders = loader.getAsset('shaders', CORE_SHADER);
    if(!coreGeometry)
    {
      throw 'Unable to load Geometry ' + CORE_MESH;
    }
    if(!coreTexture)
    {
      throw 'Unable to load texture ' + CORE_TEXTURE;
    }
    if(!coreShaders)
    {
      throw 'Unable to load shaders: ' + CORE_SHADER;
    }
    this.core = new XmDrawable(coreTexture);
    this.core.init(coreGeometry, coreShaders);
    this.setQuality(quality);
    this.models = [this.item, this.core];
  };
  Entity.extend(leveledItem, Entity);
  leveledItem._assets.geometry.push(ITEM_MESH);
  leveledItem._assets.geometry.push(CORE_MESH);
  leveledItem._assets.texture.push(ITEM_TEXTURE);
  leveledItem._assets.texture.push(CORE_TEXTURE);
  leveledItem._assets.shaders.push(ITEM_SHADER);
  leveledItem._assets.shaders.push(CORE_SHADER);

  leveledItem.prototype.setQuality = function(quality)
  {
    if(quality instanceof THREE.Vector4)
    {
      this.quality = quality;
    }
    else if(!(quality in constants.qualityColors))
    {
      throw 'Unknown quality color ' + quality;
    }
    else
    {
      this.quality = constants.qualityColors[quality].clone();
    }
    if(this.item)
    {
      this.item.setPrimaryColor(this.quality);
    }
    return this;
  };

  return leveledItem;
};

imv.Entities = imv.Entities || {};
imv.Entities.LeveledXMItem = LeveledXMItemEntity;