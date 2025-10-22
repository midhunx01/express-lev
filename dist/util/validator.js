import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: true });
ajvErrors(ajv);
addFormats(ajv);
export function sanitizeStrings(input) {
    if (input === null || input === undefined) {
        return input;
    }
    if (typeof input === "string") {
        return input.trim();
    }
    // Handle arrays recursively
    if (Array.isArray(input)) {
        return input.map((item) => sanitizeStrings(item));
    }
    // Handle objects recursively
    if (typeof input === "object") {
        const result = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                result[key] = sanitizeStrings(input[key]);
            }
        }
        return result;
    }
    // Return non-string primitive values as-is
    return input;
}
// Generic validator function using TypeBox schemas
export function ValidateRequest(data, schema) {
    const sanitizedData = sanitizeStrings(data);
    const validate = ajv.compile(schema);
    const isValid = validate(sanitizedData);
    if (isValid)
        return { valid: true, data: sanitizedData };
    const errorMessages = validate.errors?.map((e) => e.message).filter(Boolean);
    return {
        valid: false,
        error: errorMessages?.[0] || "Validation failed",
    };
}
//# sourceMappingURL=validator.js.map