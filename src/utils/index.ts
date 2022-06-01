import bycrpt from "bcrypt";
import https from "https";
import envVariables from "../config";
const {paystackSecretKey, paystackBaseUrl} = envVariables;

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message
    return String(error)
}

export const validateEmail = (email: string): RegExpMatchArray | null => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const hashPassword = async (plaintextPassword:string): Promise<string> => {
    return bycrpt.hash(plaintextPassword, 10);
};
  
export const verifyPassword = (plaintextPassword:string, hashedPassword:string): Promise<boolean> => {
    return bycrpt.compare(plaintextPassword, hashedPassword);
};

export const payViaPaystack = async (email: string, amount: number): Promise<any> => {

    const params = JSON.stringify({
        email: email,
        amount: amount * 100
    });

    const options = {
        hostname: paystackBaseUrl,
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json'
        }
    }

    return makeRequest(options, params);
}

export const verifyPaystackPayment = async (reference: string) => {
    const options = {
        hostname: paystackBaseUrl,
        port: 443,
        path: '/transaction/verify/' + reference,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`
        }
    }

    return makeRequest(options, "");
}

    /**
     * .
     *
     * @param {Object} options
     * @param {Object | string} data
     * @return {Promise} a promise of request
     */
 const makeRequest = (options: object, data: object | string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {

        let responseBody = '';
  
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {
          resolve(JSON.parse(responseBody));
        });
      });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      req.write(data)
      req.end();
    });
  }
