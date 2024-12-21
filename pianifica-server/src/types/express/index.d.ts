export {};

declare global {
  namespace Express {
    export type Payload = {
      message?: string;
      status?: number;
      error?: null | string | undefined;
      total_count?: number | null | undefined;
      data?: null | object | unknown[] | undefined;
    };

    export interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        organizationId: number;
      };
    }

    export interface Response {
      invalid: (payload: Payload) => Response;
      failure: (payload: Payload) => Response;
      unauthorized: (payload: Payload) => Response;
      success: (payload: Payload) => Response;
    }
  }
}
