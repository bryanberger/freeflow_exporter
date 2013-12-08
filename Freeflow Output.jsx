/* 
 * @title   Freeflow Output
 * @desc    Automate multiple filesaving for Freeflow series.
 * 
 * @author  Bryan Berger, http://bryanberger.com
 */
#target "photoshop"

if (BridgeTalk.appName == "photoshop") 
{
    app.bringToFront;

    var outputFolder = Folder.selectDialog("Select a folder to save to:");

    if (outputFolder != null || typeof outputFolder != "undefined") {

        var formats = [
            {size:840, format:SaveDocumentType.JPEG, path:new Folder(decodeURI(outputFolder) + "/840"), quality:75},
            {size:792, format:SaveDocumentType.PNG, path:"/Users/BBerger/Work/freeflows/"},
            {size:560, format:SaveDocumentType.JPEG, quality:80}
        ];

        // ask for t prefix name
        var prefixName = prompt ("Please enter the name prefix:", "Untitled");

        if(prefixName === null || typeof prefixName === 'undefined') {
            alert('Prefix name was undefined');
            exit();
        }
        
        // create output folder if it does not exist        
        if (!outputFolder.exists) outputFolder.create();

        try {
            for (var i = 0, len = formats.length; i < len; i++) {

                var format = formats[i];
                var document = app.activeDocument;
                var documentName = prefixName + "_" + format.size;
                var newFile;

                if(format.size === 840) {
                    if (!format.path.exists) format.path.create();
                    newFile = new File(decodeURI(format.path) + "/" + documentName + ".jpg");
                } else if(format.size === 792) {
                    newFile = new File(decodeURI(format.path) + prefixName + ".png");
                } else {
                    newFile = new File(decodeURI(outputFolder) + "/" + documentName + ".jpg");
                }

                document.flatten();
                document.resizeImage(format.size, format.size, 72);

                var exportOptions = new ExportOptionsSaveForWeb();
                    exportOptions.format = format.format;

                    if (format.format === SaveDocumentType.JPEG) {
                        exportOptions.quality = format.quality;
                    }

                    if (format.format === SaveDocumentType.PNG) {
                        exportOptions.PNG8 = false;
                        exportOptions.optimized = true;
                    }
                
                document.exportDocument(newFile, ExportType.SAVEFORWEB, exportOptions);
                //document.close(SaveOptions.DONOTSAVECHANGES);
             }
             alert("Complete!");
        } catch(e) {
            alert("Error saving file.\n" + e);
        }
    } else {
        alert("Output folder undefined.");
    }
}