class WorkplaceAPIError extends Error {
    constructor(httpCode, type, message, code, fbtrace_id, ...params) {
        super(message);
        this.name = this.constructor.name;
        this.httpCode = httpCode;
        this.type = type;
        this.code = code;
        this.fbtrace_id = fbtrace_id;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    WorkplaceAPIError
}