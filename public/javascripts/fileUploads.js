FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 150,
  imageResizeTargetWidth: 200,
  imageResizeTargetWidth: 200
});

FilePond.parse(document.body);
