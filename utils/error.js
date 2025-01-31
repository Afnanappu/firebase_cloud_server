import HttpStatus from "./statusCodes.js";

const errorCreator = (message, status) => {
    const err = new Error(message);
    err.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw err;
}

export default errorCreator;

