# Stage 1: Builder
FROM maven:3-eclipse-temurin-25 AS builder
WORKDIR /app

# Copy Maven descriptor and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runner
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the generated JAR file from builder
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]

