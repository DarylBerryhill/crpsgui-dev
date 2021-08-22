
WebViewer
(
    {
        initialDoc : '',
        config : 'src/js/viewPDF_config.js',
        disabledElements:
        [
            'viewControlsButton',
            'viewControlsOverlay',
            'bookmarksPanel',
            'bookmarksPanelButton',
            'leftPanel',
            'leftPanelButton'
        ]
    },
      document.getElementById('viewer')
);


//WebViewer
//(
//    {
//        path: '../../../lib',
//        initialDoc: '',
//        disabledElements:
//        [
//            'viewControlsButton',
//            'viewControlsOverlay',
//            'bookmarksPanel',
//            'bookmarksPanelButton',
//            'leftPanel',
//            'leftPanelButton'
//        ]
//    },
//      document.getElementById('viewer')
//).then(instance =>
//{
//  instance.closeElements([ 'menuOverlay', 'leftPanel' ]);
//
//  document.getElementById('PDFmap').onclick = e =>
//  {
//    e.preventDefault();
//    instance.loadDocument("../../../samples/files/CRPS processor EEPROM memory map.pdf");
//  };
//
//});
