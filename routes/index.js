var moment = require("moment");
var express = require('express');
var s3PostPolicy = require("s3-post-policy");
var epa = require("epa").getEnvironment();
var s3Config = epa.get("s3");

// express router
// --------------

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    bucketName: s3Config.bucket,
    s3Key: s3Config.key
  });
});

router.get('/done', function(req, res, next){
  res.render('done');
});

router.post("/s3creds", function(req, res, next){
  var filename = req.body.filename;
  var expires = moment().add(120, "minutes").toISOString();
  var contentType = "application/octet-stream";

  var policyConfig = {
    id: s3Config.key,
    secret: s3Config.secret,
    bucket: s3Config.bucket,
    region: s3Config.region,
    date: Date.now(),
    policy: {
      expiration: expires,
      conditions: [
        {"key": filename}, 
        {"success_action_redirect": s3Config.returnUrl},
        {"Content-Type": contentType}
      ]
    }
  };

  var policy = s3PostPolicy(policyConfig);
  console.log(policy);
  res.json(policy.fields);
});

// exports
// -------

module.exports = router;
