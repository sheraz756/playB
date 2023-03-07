// for getting access token first;

//https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken?MERCHANT_ID=14392&SECURED_KEY=nj73wc7wWy8PkXQPCGZg



// after getting token post form data to

//https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction

// with these parameters 
const MERCHANT_ID = 14392;
const MERHCNAT_NAME = 'Playeon';
const TOKEN = 'lzNe0C-PsrFOuMDt7JrQWOeLXScnWYui2fz9lWPFIjk';
const PROCCODE = 00;
const TXNAMT = 300;
const CUSTOMER_MOBILE_NO = '+923361264273';
const CUSTOMER_EMAIL_ADDRESS = 'abdsskk@gmail.com';
const SIGNATURE = 'firstSignature';
const VERSION = 'v1';
const SUCCESS_URL = 'http://localhost:4000/signup/success';
const FAILURE_URL = 'http://localhost:4000/signup/failure';
const BASKET_ID = '1051';
const ORDER_DATE = Date.now();
const CHECKOUT_URL = 'http://localhost:5000/api/v1/signup';
TXNDESC