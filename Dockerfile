FROM php:apache
COPY . /var/www/html/

RUN apt-get update && apt-get install -y \
    default-jre \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Java
ENV JAVA_HOME /usr/lib/jvm/default-java
ENV PATH $JAVA_HOME/bin:$PATH