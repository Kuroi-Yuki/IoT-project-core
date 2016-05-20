Developing the core
--------------------
On the core side, four main components are: NodeJS application, CouchDB server, R engine, and MQTT broker.
NodeJS application
The first step is to install NodeJS from https://nodejs.org/en/. Once it has been installed, Sublime can be used for developing the application. The packages required for the application are:
•	nano: to communicate with CouchDB
•	mqtt: to create MQTT publishers and subscribers
•	http: to communicate with the R engine via http requests
•	express: for http server functionalities
•	fs: to access the file system on the devices
•	json2csv: to convert the JSON files received via mqtt to csv and append them to the csv file
•	sleep**: only for simulation purposes
All of the packages can be downloaded using the command: >npm install <package name>

- CouchDB server
A local CouchDB server can be downloaded and installed from http://couchdb.apache.org/. The server runs on port 5984 and can be accessed immediately after installation via curl. The database can also be accessed via the graphic interface provided by Futon by typing http://localhost:5984/_utils/ into a web browser. Futon offers a simple method to access databases and generate views that can later be called from the NodeJS application.

- R engine
An R engine can be downloaded and installed from https://www.r-project.org/. The initial installation supports various types of analysis and graphical representations. However, to enable communication between NodeJS and the R engine, an additional library should be provided. The library needed is httpuv; which provides a low-level socket and protocol support for handling HTTP and WebSocket requests directly from within R. The library is built on top of the libuv and http-parser C libraries. To install the library, type the following command into the console in the R environment:
install.packages("httpuv")

- Mosquitto
The MQTT broker of choice for evaluation purposes is Mosquitto. It can be installed from http://mosquitto.org/ and comes with a simple publisher and subscriber for testing. 

- HiveMQ
The MQTT broker of choice system deployment purposes is HiveMQ. It can be installed from http://www.hivemq.com/ and comes with a simple publisher and subscriber for testing. 

**********************************************************************************************
The sample clients sim_student.js, sim_teacher_analysis.js, and sim_teacher_quiz.js can be used to test the system.
In the client file sim_student.js, the code has been modified to simulate multithreading. For that, jxcore is required.

The steps to install jxcore can be found in https://github.com/jxcore/jxcore
after installing, simply run the student client using the command
> jx sim_student.js
you may also modify the code for sim_student.js and control the number of threads, and the number of tasks added to every thread.