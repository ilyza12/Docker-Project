<?php
    $count = count($_FILES['files']['name']);
    $convermode = $_POST['query'];

    if($count <= 0) {
        echo "No file selected";
    } else {
        $fileNames = array_filter($_FILES["files"]["name"]);
        $fileTmpNames = array_filter($_FILES["files"]["tmp_name"]);
    
          // create export folder if not exist
        try {
            $exportFolder = "files/export";
            if (!file_exists($exportFolder)) {
                mkdir($exportFolder, 0777, true);
            }
    
            // remove all files inside the export folder
            $exportfiles = glob('files/export/*'); // get all file names
            foreach($exportfiles as $exportfile){ // iterate files
            if(is_file($exportfile))
                unlink($exportfile); // delete file
            }
    
            // loop through all files and upload to export folder
            for($i = 0; $i < $count; $i++) {
                $target_dir = "files/export/";
                $target_file = $target_dir . basename($fileNames[$i]);
                
                // upload into the export folder
                if (move_uploaded_file($fileTmpNames[$i], $target_file)) {
                    // echo "The file ". basename( $_FILES["files"]["name"][$i]). " has been uploaded.";
                } else {
                    // echo "Sorry, there was an error uploading your file.";
                }
            }
    
            // run java program to pdftxtconverter.jar
            if($convermode == 'pdf') {
                $command = escapeshellcmd('java -jar PdfTxtConverter.jar');
            }else {
                $command = escapeshellcmd('java -jar TxtPdfConverter.jar');
            }

            $output = shell_exec($command);
            echo $output;
    
        }catch(Exception $e) {	
            echo $e->getMessage();
        }
    }
?>

