# PDF to TXT Converter

This project is a collaborative effort aimed at developing a user-friendly web application with a graphical interface using web programming languages. The objective is to set up a Linux Apache web server using Docker and create a seamless platform allowing users to convert PDF files to TXT format and vice versa.

## :gear: Prerequisite

You will need [Docker Desktop](https://docs.docker.com/desktop/) in your system for this project to run properly.

## :rocket: Getting Started

To run this project, your will need to follow the below instruction:
1. Open your favourite terminal.
2. Navigate to the project folder.
3. Run the following command to build and run the container.
```bash
docker-compose up -d
```
4. Docker will start to build the image and run the container. You can check if the container is running after the build process is done by running this command.
```bash
docker ps
```
5. Open your browser and navigate to http://localhost:8080 to see the website.
6. Finally, to stop the running container, you can run this command.
```bash
docker-compose down
```


## :open_file_folder: Project Structure
```bash
.
├── Dockerfile
├── PdfTxtConverter.jar
├── README.md
├── TxtPdfConverter.jar
├── docker-compose.yml
├── files
│   ├── export
│   └── import
├── index.php
└── samples
    ├── CAT201_ASSIGNMENT 1_REFERENCES.pdf
    └── CAT201_Video_Links.pdf
```