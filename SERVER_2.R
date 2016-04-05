library(httpuv)

app <- list(
   call = function(req) {
     wsUrl = paste(sep='',
                   '"',
                   "ws://",
                   ifelse(is.null(req$HTTP_HOST), req$SERVER_NAME, req$HTTP_HOST),
                   '"')
     
     list(
       status = 200L,
       headers = list(
         'Content-Type' = 'text/html'
       ),
       body = paste(
         sep = "\r\n",
         "<!DOCTYPE html>",
         "<html>",
         "<head>",
         '<style type="text/css">',
         'body { font-family: Helvetica; }',
         'pre { margin: 0 }',
         '</style>',
         "</head>",
         "<body>",
	   '<h1> HELLO BUDDY! </h1>',
         "</body>",
         "</html>"
       )
     )
   },
   onWSOpen = function(ws) {
     ws$onMessage(function(binary, message) {
      print(message) 
	ws$send(message)
     })
   }
 )

runServer("0.0.0.0", 9456, app, 250)