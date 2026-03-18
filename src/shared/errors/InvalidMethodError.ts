/**
 * @file Custom error for identifying missing or undefined Mongoose model methods.
 * @filename InvalidMethodError.ts
 */

/**
 * Configuration for {@link InvalidMethodError}.
 */
type ErrorParams = {
    /** Custom error message. */
    message?: string;
    /** The name of the method that failed to resolve. */
    methodName: string;
    /** The name of the Mongoose model (e.g., "Showing"). */
    modelName: string;
}

/**
 * Thrown when a dynamic method call fails on a Mongoose model.
 * Useful for debugging lifecycle hook registrations or repository utilities.
 */
export class InvalidMethodError extends Error {
    /** The method identifier. */
    public readonly methodName: string;
    /** The model identifier. */
    public readonly modelName: string;

    constructor({message, methodName, modelName}: ErrorParams) {
        super(message);

        this.methodName = methodName;
        this.modelName = modelName;
    }

    /**
     * Formats the error into a human-readable string.
     * @example "[Showing] softDelete not in Model"
     */
    toString(): string {
        return `[${this.modelName}] ${this.methodName} not in Model`;
    }

    /**
     * Serializes the error for logging or API responses.
     */
    toJSON(): Record<string, any> {
        return {
            message: this.message,
            methodName: this.methodName,
            modelName: this.modelName,
        }
    }
}