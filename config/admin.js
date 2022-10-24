const OktaOAuth2Strategy = require("passport-okta-oauth20").Strategy;

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    providers: [
      {
        uid: "okta",
        displayName: "Okta",
        icon: "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Medium-thumbnail.png",
        createStrategy: (strapi) =>
          new OktaOAuth2Strategy(
            {
              clientID: env("OKTA_CLIENT_ID"),
              clientSecret: env("OKTA_CLIENT_SECRET"),
              audience: env("OKTA_DOMAIN"),
              scope: ["openid", "email", "profile"],
              callbackURL:
                env("URL") +
                strapi.admin.services.passport.getStrategyCallbackURL("okta"),
            },
            (accessToken, refreshToken, profile, done) => {
              done(null, {
                email: profile.email,
                username: profile.username,
              });
            }
          ),
      },
    ],
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
});
