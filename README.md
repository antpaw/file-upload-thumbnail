# file-upload-thumbnail
[![npm version](https://badge.fury.io/js/file-upload-thumbnail.svg)](https://www.npmjs.com/package/file-upload-thumbnail)

Create thumbnails from uploading files (image/video).

Extracted from [Dropzone](https://www.dropzone.dev/).

## Install

```bash
$ npm install --save file-upload-thumbnail
```

## Usage

Below is a example of usage.

```javascript
var FileUploadThumbnail = require('file-upload-thumbnail');
document.getElementById('file').addEventListener('change', function(e) {
  e.preventDefault();
  if (e.target.files) {
    Array.prototype.slice.call(e.target.files).forEach(function(file){
      new FileUploadThumbnail({
        maxWidth: 500,
        maxHeight: 40,
        file: file,
        onSuccess: function(src){
          document.getElementById('preview_image').src = src || '';
        }
      }).createThumbnail();
    });
  }
  e.target.value = null;
  return false;
});
```

## Options

### new Instance(options)

#### `file`
type: `File`  
the file selected from the input or a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance

#### `onSuccess(src)` (optional)
type: `Function`  
default: `undefined`
callback, parameter `src` is base64 `String` representing the thumbnail image

#### `onError` (optional)
type: `Function`  
default: `undefined`
callback

#### `maxWidth` (optional)
type: `Int`  
default: `undefined`  
maximal width of the thumbnail, if `undefined`, the ratio of the image will be used to calculate it.

#### `maxHeight` (optional)
type: `Int`  
default: `undefined`  
the same as `maxHeight`. If both (`maxWidth` and `maxHeight`) are `undefined`, images will not be resized.


### instance.createThumbnail()
### instance.createThumbnailFromImageFile()
### instance.createThumbnailFromVideoFile()
