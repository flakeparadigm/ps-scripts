/**
  * Batch "fit image" resize script
  * This script resizes an image to the specified width and height,
  * filling any extra space around the image with transparent pixels.
  *
  * Written/Adapted by Flakeparadigm 2016
  *
  * Includes code from:
  * https://coffeeshopped.com/2008/11/conditional-image-resizing-with-photoshop-and-javascript
  * http://stackoverflow.com/questions/4537316/automate-batch-script-convert-filenames-to-text-in-photoshop
  * http://extendscript.blogspot.com/2009/09/file-name-without-file-extension.html
  */

// Make sure there aren't any open documents
if (app.documents.length) {
    alert("Please close all open documents before running this script.");
} else {

  // Use folder selection dialogs to get the location of the input files
  // and where to save the new output files.
  var sourceFolder = Folder.selectDialog("Please choose the location of the source image files.", Folder.myDocuments);
  var destFolder = Folder.selectDialog("Please choose a location where the new image files will be saved.", sourceFolder);

  // these are our values for the end result width and height (in pixels) of our image
  var fWidth = 500;
  var fHeight = 400;

  var files = sourceFolder.getFiles();
  for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (f instanceof Folder)
          continue;

      // If there are no other documents open doc is the active document.
      var doc = app.open (f);

      // get a reference to the current (active) document and store it in a variable named "doc"
      doc = app.activeDocument;

      // change the color mode to RGB.  Important for resizing GIFs with indexed colors, to get better results
      doc.changeMode(ChangeMode.RGB);

      // make sure background layer is unlocked. Important for resizing jpgs
      doc.activeLayer.allLocked = false;
      doc.activeLayer.isBackgroundLayer = false;

      // do the resizing.  if height > width (portrait-mode) resize based on height.  otherwise, resize based on width
      if (doc.height > doc.width) {
          doc.resizeImage(null,UnitValue(fHeight,"px"),null,ResampleMethod.BICUBIC);
      }
      else {
          doc.resizeImage(UnitValue(fWidth,"px"),null,null,ResampleMethod.BICUBIC);
      }

      doc.resizeCanvas(UnitValue(fWidth,"px"),UnitValue(fHeight,"px"),AnchorPosition.MIDDLECENTER);

      var options = new ExportOptionsSaveForWeb();
      options.format = SaveDocumentType.PNG;
      options.optimized = true;

      // Get the original name ;
      var fullName = f.name

      // Locate the final position of the final . before the extension.
      var finalDotPosition = fullName.lastIndexOf( "." ) ;
      var fileName;

      // remove the extension from the string if there is one
      if ( finalDotPosition > -1 ) {
          fileName = fullName.substr( 0 , finalDotPosition );
      } else {
          fileName = fullName;
      }

      var outputFile = new File(destFolder.absoluteURI + "/" + fileName + ".png");
      doc.exportDocument(outputFile, ExportType.SAVEFORWEB, options);
      doc.close(SaveOptions.DONOTSAVECHANGES);
  }
}
