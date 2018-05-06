module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Blog-server',
      script    : './build/server/index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '47.94.210.193',
      ref  : 'origin/master',
      repo : 'git@gitee.com:leohsun/blog.git',
      path : '/home/www/blog/production',
      "ssh_options": "StrictHostKeyChecking=no",
      'post-deploy' : 'git pull && npm install --registry https://registry.npm.taobao.org && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
      env : {
        NODE_ENV :'production'
      }
    }
  }
};
