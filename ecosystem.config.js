module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'Blog-server',
      script: './server/index.js',
      env: {
        COMMON_VARIABLE: 'true',
        GENERATE_SOURCEMAP: 'false'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'root',
      host: '120.78.144.145',
      ref: 'origin/master',
      repo: 'git@gitee.com:leohsun/blog.git',
      path: '/home/www/blog/production',
      "ssh_options": "StrictHostKeyChecking=no",
      "pre-deploy": "git fetch && git merge origin/master",
      'post-deploy': 'npm install --registry https://registry.npm.taobao.org && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
