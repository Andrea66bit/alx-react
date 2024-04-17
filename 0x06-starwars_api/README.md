IN STVRIVN WE TRUST
A Complete Guide to Making HTTP Requests in Node.js

Victor Jonah
March 28, 2022
Try Memberstack for Free!
TABLE OF CONTENTS
Prerequisites
What is HTTP requests in Node
Ways to make HTTP requests in Node
Handling errors
Conclusion

Add memberships to your Webflow project in minutes.

Try Memberstack
FOLLOW
Transparent Facebook Icon
Transparent Twitter Icon
Transparent Linkedin Icon

TAGS
React
This article will discuss more on HTTP, HTTP requests, ways to make this requests in Node and how we can handle errors.

Making HTTP requests in Node is one of the most important thing you would be doing as a developer and inasmuch as it is a simple to perform, there is still a lot to understand or probably be aware of. HTTP requests is all about transferring data over a network which is built on a client-server model.

The underlying technology is the HTTP (Hypertext Transfer Protocol) which is used to structure requests and responses over the Internet. It was originally designed to allow communication between web servers and web browsers with just sending html but its protocol is now used hugely for a variety of purposes. Well, our focus in this article is HTTP requests which is the protocol where a piece of data is requested from a server.

In this article, we will discuss more on HTTP, HTTP requests, ways to make this requests in Node and how we can handle errors.

Prerequisites
This article will require you to have Node installed on your computer and all examples here will be running on Node v14.15.4, so if you have this or above as at the time of reading this article then you are good.
Also, a basic knowledge of JavaScript and how to run each code sample is needed to understand the content of this article.
What is HTTP requests in Node
Before we talk about what HTTP requests are in Node, let us understand what requests are in general. Requests are a way to exchange information between a client and a server. The client and server has to be present before we can call it a request. The client has to be the one to initiate a request by which the server in return, send a response in accordance to the request.

Making a HTTP requests in Node is as important as anything and there are components we should consider to make a request in Node. The key specifications to describing how to make a HTTP request is in RFC 7230. The HTTP requests contains three elements which includes:

The request method which I called the components earlier.
The target, where the request is going to. This is usually the URL.
The protocol name and its version.
Let us look at the components we have to consider before we make a HTTP request. The first thing to note is that we are sending a request to a URL and there are some actions that need to be sent alongside that URL.

Method (GET, POST, PUT, DELETE, etc): For example, if we make a request to a URL on our browser like https://:www.google.com, we are using the GET method and our response will definitely be the resource(what we see on our browser)

Request URL: https://www.google.com/
Request Method: GET
Status Code: 200 
Remote Address: ******
Referrer Policy: origin

In the above case, we did not perform anything serious but just requested for data. The methods here are just conventions for what needs to be done on the server. The POST sends data to the server to be saved, PUT also sends to the server but updates the resource already on the server, and DELETE deletes a resource on the server. 

Data: This is another important component when making a request because there is a high chance you will be sending data to the server. If you are going to be using the GET method, you might not necessarily send a data. But with other methods like POST, you must be sending a data.

POST /test HTTP/1.1
Host: foo.example
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

name=Victor&email=emailaddress

In the above case, we are sending the data(name and email) to the server for a purpose known to the client.
Headers: Headers are what I call additional information or metadata that is sent alongside the request. They do not also work with the request but with the response as well. Inasmuch as it sounds like it is less used, it is still very much needed to provide information about the subject of the request. 
So, the headers are mostly written by the client (you) while others are automatically done. Like I said earlier, headers might be somewhat important but this depends on the type of API you are working with. Below is a sample from MDN on how headers should look like:

GET /home.html HTTP/1.1
Host: developer.mozilla.org
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match: "c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0

To find out more on the Request headers field, you can read more on RFC 7231, section 5.

Authentication: We still have to call this a request component even if we can use it or do what it does on the Headers or as a Data. More often you will be sending a token to the server so the server can authenticate and know who you are before giving you access to the resource.

Authorization:  

This is just short overview of a HTTP requests components. With this in mind, we can move on to discuss how to make these HTTP requests in Node.

Ways to make HTTP requests in Node
Since our main focus is Node, we will take a look at 5 ways to make HTTP GET  and POST request. Our aim is to look at the various ways and the similarities or better still a more convenient way to handle requests. I also want to point out that this is not supposed to tell you which is better but rather which is convenient for you.

1. HTTP Module 
This is a built in standard library or module that is basically used to build a HTTP client and server. For example, we can create a Web server that listens to HTTP requests and we can use the same module to make HTTP requests. 

Node provides http and https which are separate modules. The latter lets you communicate over SSL, encrypting the communication using a certificate. You might want to use the https when making a request that has the https url. Let’s look at how we can make a GET and POST requests using the https module.


const https = require("https");

https
  .get(`https://reqres.in/api/users`, resp => {
    let data = "";

    // A chunk of data has been recieved.
    resp.on("data", chunk => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on("end", () => {
      let url = JSON.parse(data).message;
      console.log(url);      
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });

In the above code, we make a GET request to the Dogs API, the resp is an object and inside that is two events that we are to listen to; the on data and on end. With the on data, we are streaming the data to us in chunks(pieces by pieces) and with the on end, we listen and parse our data when it is completed. We also have the error handler event on error that listens for errors.

Let’s look at making a POST request with the https module:


const https = require("https");

const options = {
  hostname: 'yourapi.com',
  port: 443,
  path: '/todos',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

https
  .request(options, resp => {
    // log the data
    resp.on("data", d => {
      process.stdout.write(d);
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });

You can always use the https.request because it automatically uses the GET method if you don’t specify and also calls the on end event underhood.

2. Axios 
According to Axios, it is a promised-based HTTP client for the browser and Node as well. This means that it is a third party library that can be used on any JavaScript project. It uses XMLHttpRequest underhood to make requests and also does more of it in a smooth way. 

It features include intercepting requests and response, cancellation of request, transforming requests and response data, and the most important, it automatically changes the responses to JSON data.

To install Axios with npm, you run this command:


$ npm install axios

Let’s make a simple GET request and see it response.


const axios = require('axios').default;

async function getUsers() {
  try {
    const response = await axios.get(`https://reqres.in/api/users`);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
getUsers()

First, we require the Axios library, make a request to the url with axios.get() and then log the response. This is a smooth request with less code because Axios does all the big stuffs for us.

Take a look at the response below:


{
  status: 200,
  statusText: 'OK',
  headers: {
    date: 'Sat, 26 Mar 2022 13:51:08 GMT',
    'content-type': 'application/json; charset=utf-8',
    'content-length': '996',
    connection: 'close',
    'x-powered-by': 'Express',
    'access-control-allow-origin': '*',
    etag: 'W/"3e4-2RLXvr5wTg9YQ6aH95CkYoFNuO8"',
    via: '1.1 vegur',
    'cache-control': 'max-age=14400',
    'cf-cache-status': 'HIT',
    age: '6320',
    'accept-ranges': 'bytes',
    'expect-ct': 'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
    'report-to': '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=kXKzeaxshfg8WPvQvms%2FJ6YvtrgnJh3GzGw4O62LPjVjC6n24KQo6c24Tix1NHo6qfLO9V%2FLaOoqJi%2FHt2GQceMnobhDFRDIExmnDrD3kY%2FB%2Fim6tWp1BkGBi8E%3D"}],"group":"cf-nel","max_age":604800}',
    nel: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
    server: 'cloudflare',
    'cf-ray': '6f205bffa85f0871-SEA',
    'alt-svc': 'h3=":443"; ma=86400, h3-29=":443"; ma=86400'
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      ...
      ...
      ...
  data: {
    page: 1,
    per_page: 6,
    total: 12,
    total_pages: 2,
    data: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    support: {
      url: 'https://reqres.in/#support-heading',
      text: 'To keep ReqRes free, contributions towards server costs are appreciated!'
    }
  }
}

Easy to understand and work with response.

With that, let’s make a POST request to the same API. 


const axios = require('axios').default;

const data = {
  "name": "victor",
  "job": "writer"
}

async function addUser(data) {
  try {
    const response = await axios.post(`https://reqres.in/api/users`, data);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

addUser()

Our axios.post() takes in two parameters which are the url and the data to be sent to the server. Looking at the response below, we get status code context that it was sent successfully.

Hint: hit control+c anytime to enter REPL.


{
  status: 201,
  statusText: 'Created',
  headers: {
    date: 'Sat, 26 Mar 2022 14:07:58 GMT',
    'content-type': 'application/json; charset=utf-8',
    'content-length': '51',
    connection: 'close',
    'x-powered-by': 'Express',
    'access-control-allow-origin': '*',
    etag: 'W/"33-wWfab/HlR/+j60wjrpfaMpVmAek"',
    via: '1.1 vegur',
    'cf-cache-status': 'DYNAMIC',
    'expect-ct': 'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
    'report-to': '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=WCBCWafrH4GtOHMHIwcxuA7XfKR3PnH3pIuyH44ugHT1hgudiMHwBBv3x8VIsW0WwxC5N6RPKUcO3IwptR99V5kp%2Bcb%2Fp4NJ9bHVQOvbUcK22YfHElZ72AtFk0w%3D"}],"group":"cf-nel","max_age":604800}',
    nel: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
    server: 'cloudflare',
    'cf-ray': '6f2074a4fd2a27d2-SEA',
    'alt-svc': 'h3=":443"; ma=86400, h3-29=":443"; ma=86400'
  },
  ...
  ...
  ...
  },
  data: { id: '210', createdAt: '2022-03-26T14:07:58.464Z' }
}

In summary, this way of making a requests looks easy to me because a lot of the heavy lifting is taken away from you and with a very nice response.

3. Got
This is another HTTP client library used for making requests in Node applications. It works almost like Axios but there a few differences in how they work. The first is that this library can not be used on the browser side i.e on the client side. It offers a Stream and Pagination API out of the box. The Got library is a native ESM which means that you have to use the import rather than CommonJS. Oh yeah, it is also a Promise-based API too.

To install Got with npm, you run this command:


$ npm install got

Looking at a GET a request with Got:


import got from 'got';

async function getUsers() {
  try {
   const response = await got.get('https://reqres.in/api/users').json();
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getUsers()
