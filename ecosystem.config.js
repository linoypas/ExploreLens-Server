module.exports = {
    apps : [{
      name   : "exploreLens",
      script : "./dist/src/app.js",
      env_production : {
        NODE_ENV: "production"
      }
    }]
  }
  