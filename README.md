# angular-resource-websockets-demo
This repo is a demo for usage of Angular's $resource in an web application using Web Socket.

The demo application is an Angular app that connects to a node-proxy which polls/requests for resources to be available
in the client (browser). The idea is to reduce the #of HTTP requests at the client and shift it to a node server which
polls for X interval of time. This way the communication between client and node-proxy becomes cheap.

When using Web Socket it is generally hard to manage communication between the server and client, and route 
the message to appropriate controller to display the appropriate data. Using $resource helps in following DRY principle 
and makes communication/routing easier.

#### FAQ:
1. Is this a framework or library?

  No. Not yet. This is just an idea now. Will happen in the near future to make it a re-usable bower component.

2. Why would I want to use $resource when I am already using the socket framework's messaging service?

  You can and you should stick to it as long as it works. This is just an idea to put forth.

3. Would love to contribute?

  Yes! We welcome all contributions. Please checkout our UI development at [Cask here.](https://github.com/caskdata/cdap/tree/develop/cdap-ui)
