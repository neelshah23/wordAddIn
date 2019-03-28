import { Injectable } from "@angular/core";
import { URLSearchParams, Response, Headers } from "@angular/http";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from "@angular/common/http";
import { Observer } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class ApiCallService {
  constructor(private http: HttpClient) {}
  observer: Observer<any>;

  static createAuthorizationHeader(headers: HttpHeaders) {
    headers.append("Authorization", localStorage.getItem("_t"));
  }

  static handleResponse(response) {
    return response;
  }

  handleErrorResponse(error) {
    return error;
    // return error.statusCode === 401
    //   ? this.router.navigateByUrl("Login")
    //   : this.observer.error(error.error || "Server Error");
  }

  prepareParam(params) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] instanceof Object) {
        if (Object.keys(params[key]).length > 0) {
          httpParams = httpParams.append(key, JSON.stringify(params[key]));
        }
      } else if (params[key].toString().length > 0) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return httpParams;
  }

  callGetApi(apiurl: string, params?: URLSearchParams) {
    return this.http
      .get(apiurl, {
        // search: params,
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            "Postman-Token": "89c57b8c-1a4d-47f7-b12f-03cd358ebc50"
        }
      })
      .pipe(
        tap(
          data => ApiCallService.handleResponse(data),
          error => this.handleErrorResponse(error)
        )
      );
  }

  callPostApi(apiurl: string, body: any, options?) {
    
    return this.http
      .post(apiurl, body, {headers: {
        "content-type": "application/json",
        authorization: "Basic TE4wVDEyMDg5OkhHVDZoR3RHckRfMzI4NTY="
      }})
      .pipe(
        tap(
          data => ApiCallService.handleResponse(data),
          error => this.handleErrorResponse(error)
        )
      );
  }

  callPostApiFileUpload(apiurl: string, body: any, options?) {
    return this.http
      .post(apiurl, body, {
        headers: {
          "content-type": "multipart/form-data",
          // authorization: "Basic aWF1cm86cGFzc3dvcmQ=",
          authorization: "Basic TE4wVDEyMDg5OkhHVDZoR3RHckRfMzI4NTY="
        }
      })
      .pipe(
        tap(
          data => ApiCallService.handleResponse(data),
          error => this.handleErrorResponse(error)
        )
      );
  }

  callPutApi(apiurl: string, body: any) {
    const header = new HttpHeaders({
      Authorization: localStorage.getItem("_t")
    });
    return this.http
      .put(apiurl, body, {
        headers: header
      })
      .pipe(
        tap(
          data => ApiCallService.handleResponse(data),
          error => this.handleErrorResponse(error)
        )
      );
  }

  callDeleteApi(apiurl: string, params?: HttpParams) {
    const header = new HttpHeaders();
    ApiCallService.createAuthorizationHeader(header);

    return this.http
      .delete(apiurl, {
        // search: params,
        headers: header
      })
      .pipe(
        tap(
          data => ApiCallService.handleResponse(data),
          error => this.handleErrorResponse(error)
        )
      );
  }
}
