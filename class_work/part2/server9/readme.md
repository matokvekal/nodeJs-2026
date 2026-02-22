After adding these middlewares, you get the following:

morgan: Every time a request is made to your server, you'll see a log in the console.
helmet: It will help secure your Express apps by setting various HTTP headers.
compression: It will compress the HTTP response sent back to the client to reduce transfer size and increase the speed of the web app.
cors: It will handle the Cross-Origin Resource Sharing, so you can restrict or allow requests from certain origins.
You can then expand the functionality of each middleware based on your specific use case or requirements.