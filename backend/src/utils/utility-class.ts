// you can see default Error has 3 attribute and not have status code that'w we creating custom error class to include status code
// interface Error {
//     name: string;
//     message: string;
//     stack?: string;
// }
// class ErrorHandler extends Error --> means errorHandler incldes all the preoperties of Error class and you can add new ones also like status code
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
export default ErrorHandler;
