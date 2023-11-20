<?php

/*----------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *---------------------------------------------------------------------------------------*/

function sayHello($name) {
	echo "Hello $name!";
}

function uploadFile($name) {
	$target_dir = "files/export/";
	$target_file = $target_dir . basename($name);
	// just upload
	if (move_uploaded_file($_FILES["files"]["tmp_name"], $target_file)) {
		echo "The file " . basename($name) . " has been uploaded.";
	} else {
		echo "Sorry, there was an error uploading your file.";
	}
}

// do ajax query to get the name input from form
// when the form is submitted
if (isset($_POST['formsubmit'])) {
	$files = $_FILES['files'];
	$filenames = array_filter($_FILES['files']['name']); //Use something similar before processing files.
	$total_count = count($_FILES['files']['name']);

	// save the files to export folder
	try {
		$exportFolder = "files/export";
		if (!file_exists($exportFolder)) {
			mkdir($exportFolder, 0777, true);
		}

		for($i = 0; $i < $total_count; $i++) {
			// save the files
			//save the files[0] to the export folder
			$target_dir = "files/export/";
			$target_file = $target_dir . basename($_FILES["files"]["name"][$i]);
			$uploadOk = 1;
			
			// just upload into the export folder
			if (move_uploaded_file($_FILES["files"]["tmp_name"][$i], $target_file)) {
				echo "The file ". basename( $_FILES["files"]["name"][$i]). " has been uploaded.";
			} else {
				echo "Sorry, there was an error uploading your file.";
			}
		}

		// run java program to pdftxtconverter.jar
		$command = escapeshellcmd('java -jar PdfTxtConverter.jar');
		$output = shell_exec($command);
		echo $output;
		
	}catch(Exception $e) {	
		echo $e->getMessage();
	}

}

?>

<html>
	<head>
		<title>Visual Studio Code Remote :: PHP</title>
	</head>
	<body>
		<form action = "" method = "POST" enctype = "multipart/form-data" >
			<!-- <input type = "text" name = "name" /> -->
			<input type = "file" multiple="multiple" name = "files[]" id = "files" />
			<input name = "formsubmit" type = "submit"/>
		</form>
		<?php 
								
		?>
	</body>
</html>