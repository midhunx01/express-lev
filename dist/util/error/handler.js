import { AuthorizeError, NotFoundError, ValidationError } from "./errors.js";
import { logger } from "../logger/index.js";
export const HandleErrorWithLogger = (error, req, res, next) => {
    let reportError = true;
    let status = 500;
    let data = error.message;
    // convert express-jwt UnauthorizedError to your AuthorizeError
    if (error.name === "UnauthorizedError") {
        error = new AuthorizeError(error.message);
    }
    // skip known errors
    [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
        if (error instanceof typeOfError) {
            reportError = false;
            status = error.status || 400;
            data = error.message;
        }
    });
    if (reportError) {
        logger.error(error);
    }
    else {
        // future use third party error reporting tools
        logger.warn(error);
    }
    res.status(status).json({ error: data });
};
export const HandleUnCaughtException = async (error) => {
    // error report / monitoring tools
    logger.error(error);
    // recover
    process.exit(1);
};
//# sourceMappingURL=handler.js.map