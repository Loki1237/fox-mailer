type ReqMethod = "GET" | "POST" | "PUT" | "DELETE";
type ReqHeaders = { [name: string]: string };
type ReqBody = any;

interface ReqInit {
    method: ReqMethod,
    headers?: ReqHeaders,
    body?: ReqBody
}

class RequestConstructor {
    init: ReqInit;
    url: string;

    constructor(method: ReqMethod, url: string) {
        this.init = { method };
        this.url = url;
    }

    formData = (body: FormData) => {
        this.init.body = body;

        return this;
    }

    json = (body: object) => {
        if (!this.init.headers) {
            this.init.headers = {};
        }

        this.init.headers["Content-Type"] = "application/json;charset=utf-8";
        this.init.body = JSON.stringify(body);

        return this;
    }

    setHeader = (name: string, value: string) => {
        if (!this.init.headers) {
            this.init.headers = {};
        }

        this.init.headers[name] = value;

        return this;
    }

    send = () => {
        return fetch(this.url, this.init);
    }
}

export function httpRequest(method: ReqMethod, url: string) {
    return new RequestConstructor(method, url);
}
