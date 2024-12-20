FROM php:apache


# Install JRE and JDK
RUN apt-get update && \
    apt-get install -y \
        default-jre \
        default-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Set environment variables for Java
ENV JAVA_HOME /usr/lib/jvm/default-java
ENV PATH $JAVA_HOME/bin:$PATH


# Create export folder
RUN mkdir -p /var/www/html/files/export 

# Create import folder
RUN mkdir -p /var/www/html/files/import


# Copy the contents of the current directory into the container
COPY . /var/www/html/


# Set full access permissions
RUN chmod 777 /var/www/html/files/export /var/www/html/files/import
