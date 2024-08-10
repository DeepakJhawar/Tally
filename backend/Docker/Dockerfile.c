# Use the latest GCC image
FROM gcc:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Set environment variables for the source file and executable name
ENV EXECUTABLE=tempCode
ENV INPUT=""

# Command to compile and run the C++ code using the provided environment variables
CMD ["sh", "-c", "gcc ${EXECUTABLE}.c -o ${EXECUTABLE} && printf '%s' \"$INPUT\" | ./${EXECUTABLE}"]
