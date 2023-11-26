
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

