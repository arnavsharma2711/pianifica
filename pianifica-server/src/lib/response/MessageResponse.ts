export interface MessageResponse {
  success: boolean;
  message: string;
  error?: null | string;
  total_count?: number;
  data?: null | object | unknown[];
}

const build_response = (
  success: boolean,
  message: string,
  error?: null | string,
  total_count?: null | number,
  data?: null | object | unknown[]
): MessageResponse => {
  const response: MessageResponse = {
    success,
    message,
  };

  if (error) {
    response.error = error;
  }

  if (total_count) {
    response.total_count = total_count;
  }
  if (data) {
    response.data = data;
  }

  return response;
};

export default build_response;
