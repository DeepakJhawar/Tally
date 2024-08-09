# C++ Dockerfile
FROM gcc:10.2-slim

# Set the working directory
WORKDIR /usr/src/app

# Command to compile and run the C++ code
CMD ["sh", "-c", "g++ tempCode.cpp -o tempCode && ./tempCode"]
