module.exports = [{
  mode: 'production',
  entry: {
    file_upload_thumbnail: './index.js'
  },
  output: {
		filename: '[name].js',
    path: __dirname + '/dist',
		library: 'FileUploadThumbnail',
		libraryTarget: 'var'
  }
}];
