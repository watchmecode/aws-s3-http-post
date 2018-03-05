var Uploader = (function(){
  var $form, $file;

  function start(){
    $form = $("#s3form");
    $file = $("#s3file");

    $("#upload-file").click(function(e){
      e.preventDefault();
      handlUpload(function(err){
        if (err) { console.error(err.stack); }
      });
    });
  }
  
  function handlUpload(cb){
    var filename = $file[0].files[0].name;

    getUploadCreds(filename, function(err, creds){
      if (err) { return cb(err); }
      setFormData(creds);
      $form.submit();
    });
  }

  function getUploadCreds(filename, cb){
    $.ajax({
      type: "post",
      url: "/s3creds",
      dataType: "json",
      data: {
        filename: filename
      },
      success: function(data){
        cb(undefined, data);
      },
      error: cb
    });
  }

  function setFormData(creds){
    $form.prop("target", creds.s3Url);
    $("input[name='key']").val(creds.key);
    $("input[name='X-Amz-Signature']").val(creds["x-amz-signature"]);
    $("input[name='X-Amz-Credential']").val(creds["x-amz-credential"]);
    $("input[name='X-Amz-Date']").val(creds["x-amz-date"]);
    $("input[name='Policy']").val(creds.policy);
    $("input[name='success_action_redirect']").val(creds.success_action_redirect);
  }

  return {
    start: start
  };
})();
