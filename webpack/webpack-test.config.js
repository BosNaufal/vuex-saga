
var context = require.context('../test/', true, /\.spec\.js$/);
context.keys().forEach(context);
