// pdfbox library
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

// java basic library
import java.io.File;
import java.io.FileWriter;
import java.io.BufferedWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try{
            File[] files = fetchFiles(); // fetch all the files in export folder

            if(files.length == 0) throw new IllegalArgumentException("No file found in the directory."); //check if file exist

            for(File file : files){
                String pdfText = convertPdfToText(file); //convert pdf content to text
                writeFile(pdfText, file.getName()); // write the text to a txt file
                if(!file.delete()) break; // delete original pdf file
            }

        }catch(Exception e){
            System.err.println(e.getMessage());
        }
    }

    public static File[] fetchFiles(){
        File sourceDir = new File("./files/export"); //assign the file object
        return sourceDir.listFiles();
    }

    public static String convertPdfToText(File pdfFile){
        String pdfText = "";
        try{
            // Convert PDF to TXT =============================
            PDDocument document = PDDocument.load(pdfFile); // load the file object to PDDocument

            PDFTextStripper pdf_stripper = new PDFTextStripper(); //init pdf stripper class

            pdfText = pdf_stripper.getText(document); // strip the pdf to text
            document.close();
        }catch(IOException e){
            System.err.println(e.getMessage());
        }

        return pdfText;
    }

    public static void writeFile(String pdfContent, String fileName){
        // Write the text to file =========================
        String targetDir = "./files/import";
        String outputFileName = fileName.split("\\.")[0] + ".txt";

        // Creating a File object specifying the directory and file name
        File directory = new File(targetDir);
        if(!directory.exists()) directory.mkdirs();
        File outputFile = new File(directory, outputFileName);


        try {
            // FileWriter with BufferedWriter for efficient writing
            FileWriter fileWriter = new FileWriter(outputFile);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

            // Writing text to the file
            bufferedWriter.write(pdfContent);

            // Close the BufferedWriter
            bufferedWriter.close();

            System.out.println(outputFileName + ":TRUE"); //confirmation message

        } catch (IOException e) {
            System.err.println(outputFileName + ":FALSE");
        }
    }
}