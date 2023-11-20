// pdfbox library
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.File;
import java.io.BufferedReader;
import java.io.FileReader;

public class Main {
    public static void main(String[] args) {
        try{
            File[] files = fetchFiles(); // fetch all the files in export folder

            if(files.length == 0) throw new IllegalArgumentException("No file found in the directory."); //check if file exist

            for(File file : files){
                try {
                    writeTextToPdf(file); // write text to pdf
                }catch (Exception e){
                    throw new Exception(e.getMessage());
                }
            }

        }catch(Exception e){
            System.err.println(e.getMessage());
        }
    }

    public static File[] fetchFiles(){
        File sourceDir = new File("./files/export"); //assign the file object
        return sourceDir.listFiles();
    }

    public static void writeTextToPdf(File pdfFile){

        try {
            PDDocument document = new PDDocument(); // init new document
            PDPage page = new PDPage(); // init new page

            document.addPage(page); // assign page to the document

            // Set configuration for the pdf
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.beginText();
            contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // set the pdf font
            contentStream.setLeading(16.0f); // set the size between line
            contentStream.newLineAtOffset(80, page.getTrimBox().getHeight() - 80); // set where to start the text in pdf

            //write the content to pdf
            BufferedReader br = new BufferedReader(new FileReader(pdfFile));

            String line;
            while ((line = br.readLine()) != null) { // read text file line by line
                contentStream.showText(line); // write the text
                contentStream.newLine(); // create new line after each text
            }

            //close the stream
            contentStream.endText();
            contentStream.close();

            // check if import file exists
            File targetDir = new File("./files/import");

            if(!targetDir.exists()) targetDir.mkdirs(); //create import folder if not exist

            // save the file
            document.save("./files/import/" + pdfFile.getName().split("\\.")[0] + ".pdf");
            document.close(); //close the pdf stream

            // delete the original text file
            if(!pdfFile.delete()) throw new Exception("Original file cannot be deleted");

            //confirmation message
            System.out.println(pdfFile.getName().split("\\.")[0]+".pdf:TRUE");
        }catch (Exception e) {
            System.out.println(e.getMessage());
//            System.out.println(pdfFile.getName().split("\\.")[0]+".pdf:FALSE");
        }
    }
}