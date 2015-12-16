(function(root){

  //Api CLient Singleton
  var ApiClient = (function(){
     var instance;

     //Api Client Constructor
     var init = function(){
       var BASE_URL = "https://api.github.com/search/issues?q=";
       return {
         /**
         * Converts JSON to Github API style query strings
         */
         queryFormatter : function(obj){
           if(!obj)return '';
           var queryArr = [];
           for(var prop in obj){
             if(obj.hasOwnProperty(prop)){
               queryArr.push(prop + ":" + obj[prop]);
             }
           }
           return queryArr.join('+');
         } ,
         /**
         * Calls the Github Search Api for searching Issues
         * Returns a promise to handle results
         */
         getIssues : function(queryObj){
           //console.log(BASE_URL + this.queryFormatter(queryObj)); //uncomment to check the request URLS
           return $.get(BASE_URL + this.queryFormatter(queryObj));
         }
       };
     };

     //exposing the Singleton via getInstance method
     return{
       getInstance : function(){
         if(!instance){
           instance = new init();
         }
         return instance;
       }
     };
  })();

  /**
  * Gives ISODate of the day that is x days from now.
  */
  var getISODateOfXDaysfromNow = function(x){
    return moment().subtract(x, 'days').toISOString();
  };

  /**
  * Get Request Objects for various details.
  */
  var getRequests = function(repo){
    return [{
      query : {
        repo : repo ,
        state : 'open' ,
        is : 'issue'
      } ,
      description : 'Total number of open issues' ,
      viewId : 'tr1'
    } , {
      query : {
        repo : repo ,
        is : 'issue' ,
        state : 'open' ,
        created : '>=' + getISODateOfXDaysfromNow(1)
      } ,
      description : 'Number of open issues that were opened in the last 24 hours' ,
      viewId : 'tr2'
    } , {
      query : {
        repo : repo ,
        is : 'issue' ,
        state : 'open' ,
        created : getISODateOfXDaysfromNow(7) + '..' + getISODateOfXDaysfromNow(1)
      } ,
      description : 'Number of open issues that were opened more than 24 hours ago but less than 7 days ago' ,
      viewId : 'tr3'
    } , {
      query : {
        repo : repo ,
        is : 'issue' ,
        state : 'open' ,
        created : '<' + getISODateOfXDaysfromNow(7)
      } ,
      description : 'Number of open issues that were opened more than 7 days ago' ,
      viewId : 'tr4'
    }];
  };

  var progressTrack = 0 ;
  var loading = document.getElementById('loading');

  /**
  * Updates the progress in the view .
  */
  var updateProgress = function(len){
    progressTrack++;
    document.getElementById('loading').innerHTML = "Loading ( " + progressTrack + " / " + len + " ) ";
    if(len === progressTrack){
      loading.style.visibility = "hidden";
    }
  };

  /**
  * Makes HTTPS requests via ApiCient for given request object and updates the UI
  */
  var syncCount = function(requestObj , i , arr){
    client = ApiClient.getInstance();
    client
      .getIssues(requestObj.query)
      .success(function(data){
        var des = document.createElement('td') , count = document.createElement('td');
        des.innerHTML = requestObj.description;
        count.innerHTML =  data.total_count;
        var row = document.getElementById(requestObj.viewId);
        row.innerHTML = '';
        row.appendChild(des);
        row.appendChild(count);
        updateProgress(arr.length)
      })
      .error(function(error){
        console.log(error);
        alert('Something Went wrong !');
        window.location.reload();
      });
  };

  /**
  * OnClick event for Get Details button
  */
  root.loadDetails = function(){
    //get repo name
    var reponame = document.getElementById('txtRepoName').value;

    //validate repo name
    if(!reponame){
      alert('Please enter valid repo details');
      return;
    }

    //update views for showing progress
    document.getElementById('panelDetails').style.visibility = "";
    var loading = document.getElementById('loading');
    loading.style.visibility = "";
    var requests = getRequests(reponame);
    progressTrack= -1 ;
    updateProgress(requests.length);

    //make HTTPS requests via ApiClient and update the details
    requests.forEach(syncCount);
  }

})(window);
