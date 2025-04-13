declare module 'negotiator' {
  interface Headers {
    [key: string]: string;
  }

  interface Options {
    headers?: Headers;
  }

  class Negotiator {
    constructor(options: Options);
    languages(): string[];
  }

  export default Negotiator;
} 