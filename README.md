### github-issues
Exercise for talking with Github Search API. The App is hosted on github pages and can be accessed from [here](http://scriptnull.github.io/github-issues) .

### Built with 
- HTML / CSS / JS 
- Jquery - For making Ajax Requests.
- Bootstrap - For User Interface.
- Moment.js - For Performing date operations easily.

### Solution 
The core logic of the app can be found in [js/script.js](https://github.com/scriptnull/github-issues/blob/gh-pages/js/script.js) file. 
To get the work done , I have split up the logic into few sub tasks.

1. Get input link and validate.
2. Accessing the Github API.
3. Show Details on the Web page.

#### ApiClient
The script.js file has an object called [`ApiClient`](https://github.com/scriptnull/github-issues/blob/gh-pages/js/script.js#L4) which is a singleton , that will be instantiated only once in the project.
This avoids allocating memory for the api client again and again for each requests. 
ApiClient exposes [getInstance()](https://github.com/scriptnull/github-issues/blob/gh-pages/js/script.js#L37) method through which the singleton pattern is implemented.
The ApiClient instance exposes two methods
- [queryFormatter](https://github.com/scriptnull/github-issues/blob/gh-pages/js/script.js#L14) - Converts JSON to Github API style query strings. This can be declared private , but I expose it publicly as it can be used to debug things. 
- [getIssues](https://github.com/scriptnull/github-issues/blob/gh-pages/js/script.js#L28) - Does GET request to Github API and returns  a Promise object for handling success and error.

#### Request Builder 
- [getRequests](https://github.com/scriptnull/github-issues/blob/gh-pages/js/script.js#L56) - a function that returns list of query objects to send with HTTPS request.

Each object looks something like this 
```javascipt
{
  query : {
    repo : repo ,
    state : 'open' ,
    is : 'issue'
  } ,
  description : 'Total number of open issues' ,
  viewId : 'tr1'
}
```
- query - this will be translated using queryFormatter function in ApiClient.
- Description and viewId for rendering the result with description in the DOM element with the ID specified in viewId.

#### Possible Improvements 
I think the ApiClient's implementation is clean. However, I would like to have React.js to render things on the web page after getting results from the API. It will make the code more readable and a smooth interface for loading things can be implemented. But , for the inital stages , I didn't want to increase the dependency count by adding react and babel. 
