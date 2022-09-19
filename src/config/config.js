const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('mongodb+srv://cluster0.e4dgflc.mongodb.net/'),
    JWT_SECRET: Joi.string()
      .required()
      .description(
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik11a2VzaCBHaG9kZWxhIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.JSYGZPlXPwAPqSBVU7Srpd5St3nJtNzjLHV6suGVbl5Zcz5Ko6h-oqwnyZgm8Up5M-cKRMmQ3QwuuHccgX3t1fqwEDFiKorWk8csUnlPrpy61vqDaa4B2lib70yhREJ6fqg_exo9ZgvmSCjvmqo8KFYf-AucDWdHSl1KXq4eUp-Q9KaY71suZYQEOj6k-N-OLAbVOw5Qlytd6CmCtZeb-zWX1Z-7vgkeyHJo2IX_KMjM-LDBUVwqjJtR-jUjoe2VUZmrYsfxQ1U5G5eksH2t9GMXQ9CztjEFRN3Yz9sRELkADIuXzcTMbjGfd_ubpCuHnQUDXVqOW47IslMvh2pMiA'
      ),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('smtp.ethereal.email'),
    SMTP_PORT: Joi.number().description('587'),
    SMTP_USERNAME: Joi.string().description('robin.barton@ethereal.email'),
    SMTP_PASSWORD: Joi.string().description('GXyXHyVynAZxSfXg47'),
    EMAIL_FROM: Joi.string().description('info@ethereal.email'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    // smtp: {
    //   host: envVars.SMTP_HOST,
    //   port: envVars.SMTP_PORT,
    //   auth: {
    //     user: envVars.SMTP_USERNAME,
    //     pass: envVars.SMTP_PASSWORD,
    //   },
    // },
    // from: envVars.EMAIL_FROM,
    smtp: {
      host: 'smtp.ethereal.email',
      port: '587',
      auth: {
        user: 'robin.barton@ethereal.email',
        pass: 'GXyXHyVynAZxSfXg47',
      },
    },
    from: 'info@ethereal.email',
  },
};
