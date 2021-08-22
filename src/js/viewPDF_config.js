window.addEventListener('viewerLoaded', function()
{

  window.parent.document.getElementById('PDFmap').onclick = function(e)
  {
    e.preventDefault();
    readerControl.loadDocument("../../../samples/files/CRPS processor EEPROM memory map.pdf");
  };

});