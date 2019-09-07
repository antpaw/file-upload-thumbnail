var Thumbnail = function (options) {
  this.options = {
    file: options.file,
    maxWidth: options.maxWidth,
    maxHeight: options.maxHeight,
    onError: options.onError && options.onError.bind(this),
    onSuccess: options.onSuccess && options.onSuccess.bind(this)
  };
};

Thumbnail.prototype.detectVerticalSquash = function(elem) {
  if (elem.naturalHeight === undefined) {
    return 1;
  }
  var alpha, canvas, ctx, data, ey, ih, py, ratio, sy;
  ih = elem.naturalHeight;
  canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = ih;
  ctx = canvas.getContext('2d');
  ctx.drawImage(elem, 0, 0);
  data = ctx.getImageData(0, 0, 1, ih).data;
  sy = 0;
  ey = ih;
  py = ih;
  while (py > sy) {
    alpha = data[(py - 1) * 4 + 3];
    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }
    py = (ey + sy) >> 1;
  }
  ratio = py / ih;
  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

Thumbnail.prototype.createThumbnail = function() {
  if (this.options.file.type.match(/image.*/)) {
    this.createThumbnailFromImageFile();
  }
  else if (this.options.file.type.match(/video.*/)) {
    this.createThumbnailFromVideoFile();
  }
  else if (this.options.onError) {
    this.options.onError();
  }
};

Thumbnail.prototype.createThumbnailFromImageFile = function() {
  var fileReader = new FileReader();
  fileReader.addEventListener('load', function() {
    this.createThumbnailFromUrl(fileReader.result);
  }.bind(this));
  fileReader.readAsDataURL(this.options.file);
};

Thumbnail.prototype.createThumbnailFromVideoFile = function() {
  this.createVideoThumbnailFromUrl(URL.createObjectURL(this.options.file));
};

Thumbnail.prototype.createVideoThumbnailFromUrl = function(videoUrl) {
  var canPlay, videoElem;
  videoElem = document.createElement('video');
  videoElem.setAttribute('preload', 'auto');
  videoElem.style = 'display: none';
  document.body.appendChild(videoElem);
  canPlay = videoElem.canPlayType(this.options.file.type);
  if (canPlay === 'no' || canPlay === '') {
    if (this.options.onError) {
      this.options.onError();
    }
    return;
  }
  videoElem.addEventListener('loadeddata', function() {
    if (this.options.onSuccess) {
      this.options.onSuccess(
        this.getThumbnailDataURL(videoElem, videoElem.videoWidth, videoElem.videoHeight)
      );
    }
    document.body.removeChild(videoElem);
  }.bind(this), false);
  videoElem.addEventListener('error', function() {
    if (this.options.onError) {
      this.options.onError();
    }
    document.body.removeChild(videoElem);
  }.bind(this), false);
  videoElem.src = videoUrl;
};

Thumbnail.prototype.createThumbnailFromUrl = function(imageUrl, crossOrigin) {
  var imageElem = document.createElement('img');
  if (crossOrigin) {
    imageElem.crossOrigin = crossOrigin;
  }
  if (this.options.onSuccess) {
    imageElem.onload = function() {
      this.options.onSuccess(
        this.getThumbnailDataURL(imageElem, imageElem.width, imageElem.height)
      );
    }.bind(this);
  }
  if (this.options.onError) {
    imageElem.onerror = this.options.onError;
  }
  imageElem.src = imageUrl;
};

Thumbnail.prototype.getResizeInformation = function(srcWidth, srcHeight) {
  var info = {
    srcX: 0,
    srcY: 0,
    srcWidth: srcWidth,
    srcHeight: srcHeight,
    trgWidth: undefined,
    trgHeight: undefined
  };
  var srcRatio = srcWidth / srcHeight;
  var optWidth = this.options.maxWidth;
  var optHeight = this.options.maxHeight;
  if ( ! optWidth && ! optHeight) {
    optWidth = info.srcWidth;
    optHeight = info.srcHeight;
  } else if ( ! optWidth) {
    optWidth = srcRatio * optHeight;
  } else if ( ! optHeight) {
    optHeight = (1 / srcRatio) * optWidth;
  }
  var trgRatio = optWidth / optHeight;
  if (srcHeight < optHeight || srcWidth < optWidth) {
    // this code fails if only one src is below opt
    info.trgHeight = info.srcHeight;
    info.trgWidth = info.srcWidth;
  }
  else {
    if (srcRatio > trgRatio) {
      info.srcHeight = srcHeight;
      info.srcWidth = info.srcHeight * trgRatio;
    }
    else {
      info.srcWidth = srcWidth;
      info.srcHeight = info.srcWidth / trgRatio;
    }
  }
  info.srcX = (srcWidth - info.srcWidth) / 2;
  info.srcY = (srcHeight - info.srcHeight) / 2;
  if (info.trgWidth === undefined) {
    info.trgWidth = optWidth;
  }
  if (info.trgHeight === undefined) {
    info.trgHeight = optHeight;
  }
  return info;
};

Thumbnail.prototype.getThumbnailDataURL = function(elem, elemWidth, elemHeight) {
  var vertSquashRatio = this.detectVerticalSquash(elem);
  var info = this.getResizeInformation(elemWidth, elemHeight);
  var canvas = document.createElement('canvas');
  canvas.width = info.trgWidth;
  canvas.height = info.trgHeight;
  canvas.getContext('2d').drawImage(elem,
    info.srcX, info.srcY,
    info.srcWidth, info.srcHeight,
    0, 0,
    info.trgWidth, info.trgHeight / vertSquashRatio
  );
  return canvas.toDataURL('image/png');
};

module.exports = Thumbnail;
