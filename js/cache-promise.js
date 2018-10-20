(function($) {
  var oKeyDeferredMap = {};
   
  function fnReadData(sKey) {
    var sValue = window.localStorage.getItem(sKey);
    return sValue ? JSON.parse(sValue) : sValue;
  }
   
  function fnWriteData(sKey, oData) {
    var sValue = JSON.stringify(oData);
    window.localStorage.setItem(sKey, sValue);
  }
   
  $.cachedAjaxPromise = function(sUrl, oAjaxOptions) {
    var oDeferred = oKeyDeferredMap[sUrl];
    var sValue;
     
    if (!oDeferred) {
      oDeferred = new jQuery.Deferred();
      oKeyDeferredMap[sUrl] = oDeferred;
      sValue = fnReadData(sUrl);
       
      if (sValue) {
        oDeferred.resolve(sValue);
      }
       
      if (!oAjaxOptions) {
        oAjaxOptions = {};
      }
       
      $.extend(oAjaxOptions, {
        error: function(oXHR, sTextStatus, sErrorThrown) {
          console.log('User info request failed: ' + sErrorThrown);
          oDeferred.resolve(null);
        },
        success: function(oData) {
          // making assumption that data is JSON
          fnWriteData(sUrl, oData);
          oDeferred.resolve(oData);
        }
      });
       
      $.ajax(sUrl, oAjaxOptions);
    }
     
    return oDeferred.promise();
  };
}(jQuery));