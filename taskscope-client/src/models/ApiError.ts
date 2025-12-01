export interface ApiErrorResponse {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    traceId?: string;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    public status: number;
    public title: string;
    public detail?: string;
    public traceId?: string;
    public errors?: Record<string, string[]>;

    constructor(errorResponse: ApiErrorResponse) {
        super(errorResponse.title || errorResponse.detail || 'An error occurred');
        this.name = 'ApiError';
        this.status = errorResponse.status || 500;
        this.title = errorResponse.title || 'Error';
        this.detail = errorResponse.detail;
        this.traceId = errorResponse.traceId;
        this.errors = errorResponse.errors;
    }

    public getUserMessage(): string {
        if (this.detail) {
            return this.detail;
        }
        
        if (this.errors) {
            const errorMessages = Object.entries(this.errors)
                .flatMap(([field, messages]) => messages.map(msg => `${field}: ${msg}`))
                .join(', ');
            if (errorMessages) {
                return errorMessages;
            }
        }
        
        return this.title;
    }
}
