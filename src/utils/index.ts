import bycrpt from "bcrypt";

export function getErrorMessage(error: unknown): string {
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

export async function hashPassword (plaintextPassword:string): Promise<string>{
    return bycrpt.hash(plaintextPassword, 10);
};
  
export async function verifyPassword (plaintextPassword:string, hashedPassword:string): Promise<boolean> {
    return bycrpt.compare(plaintextPassword, hashedPassword);
};
