cmake_minimum_required(VERSION 3.0)
project(null0 C)
set(CMAKE_C_STANDARD 99)
include(FetchContent)

set(CMAKE_BUILD_TYPE Release)

# Adding wasm3
FetchContent_Declare(m3 GIT_REPOSITORY https://github.com/wasm3/wasm3.git GIT_TAG main)
FetchContent_MakeAvailable(m3)

# Adding our source files
file(GLOB_RECURSE PROJECT_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_LIST_DIR}/src/*.c") # Define PROJECT_SOURCES as a list of all source files
set(PROJECT_INCLUDE "${CMAKE_CURRENT_LIST_DIR}/src/") # Define PROJECT_INCLUDE to be the path to the include directory of the project

# Declaring our executable
add_executable(${PROJECT_NAME})
target_sources(${PROJECT_NAME} PRIVATE ${PROJECT_SOURCES})
target_include_directories(${PROJECT_NAME} PRIVATE ${PROJECT_INCLUDE})
target_link_libraries(${PROJECT_NAME} PRIVATE m3)

