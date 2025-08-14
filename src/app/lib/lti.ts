const lti = require('ltijs').Provider;

lti.setup(process.env.LTI_KEY,
  {

  },
  {

  }
);

lti.onConnect(async (token: any, req: any, res: any) => {
  if (token.custom) {
    console.log('Custom Parameters:', JSON.stringify(token));
  }
});

(async () => {
  await lti.deploy({ port: 3000 });

  await lti.registerPlatform({
    
  });
})();
