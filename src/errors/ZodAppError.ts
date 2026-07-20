import { ZodError } from 'zod';
import { AppError } from './AppError';

export class ZodAppError extends AppError {
    public readonly issues: ZodError['issues'];

    constructor(zodError: ZodError) {
        const message = zodError.issues
            .map(issue => `${issue.path.join('.')} - ${issue.message}`)
            .join(', ');
        super(400, message);
        this.issues = zodError.issues;  
    }
}