var Thumbnail = require('../index.js');
var expect = require('chai').expect;

var getMockFile = function(type) {
  return {
    name: 'test file name',
    size: 123456,
    type: type || 'text/html'
  };
};


describe('FileUploadThumbnail', function() {

  describe('resizer', function(){
    describe('trgWidth/trgHeight', function(){
      it('normal image', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 50,
          maxHeight: 40
        });
        var rI = t.getResizeInformation(120, 120);
        expect(rI.trgWidth).to.equal(50);
        expect(rI.trgHeight).to.equal(40);
      });
      it('small image', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 120,
          maxHeight: 120
        });
        var rI = t.getResizeInformation(40, 30);
        expect(rI.trgWidth).to.equal(40);
        expect(rI.trgHeight).to.equal(30);
      });
      it.skip('high maxWidth, small maxHeight, image is in between', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 500,
          maxHeight: 40
        });
        var rI = t.getResizeInformation(120, 120);
        expect(rI.trgWidth).to.equal(120);
        expect(rI.trgHeight).to.equal(40);
      });
      it.skip('small maxWidth, high maxHeight, image is in between', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 40,
          maxHeight: 500
        });
        var rI = t.getResizeInformation(120, 120);
        expect(rI.trgWidth).to.equal(40);
        expect(rI.trgHeight).to.equal(120);
      });
    });

    describe('srcWidth/srcHeight', function(){
      it('small maxWidth, high maxHeight, image is in between', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 40,
          maxHeight: 500
        });
        var rI = t.getResizeInformation(120, 120);
        expect(rI.srcWidth).to.equal(120);
        expect(rI.srcHeight).to.equal(120);
      });
      it('small image', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 120,
          maxHeight: 120
        });
        var rI = t.getResizeInformation(40, 30);
        expect(rI.srcWidth).to.equal(40);
        expect(rI.srcHeight).to.equal(30);
      });
    });

    describe('srcX/srcY', function(){
      it.skip('small maxWidth, high maxHeight, image is in between', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 40,
          maxHeight: 500
        });
        var rI = t.getResizeInformation(120, 120);
        expect(rI.srcX).to.equal(0);
        expect(rI.srcY).to.equal(-190);
      });
      it('small image', function(){
        var t = new Thumbnail({
          file: getMockFile,
          maxWidth: 120,
          maxHeight: 120
        });
        var rI = t.getResizeInformation(40, 30);
        expect(rI.srcX).to.equal(0);
        expect(rI.srcY).to.equal(0);
      });
    });
  });
});
