import { environment } from "../../../environments/environment";

export class APIUtil {

  /**
   * Returns API path with append params values
   * @param queryParams : array of params that has to be replaced in the api path
   * @param payload: object of param's values it will replaced in the api path
   * @Input: getAppendParams('/testcase/1/teststep', ['test_id','user_id'], { test_id : 1, 'user_id': 2})
   * @Output: '/testcase/1/teststep?test_id=1&user_id=2'
   */
  static getAppendParams = (path: string, queryParams: Array<string>, payload: any) => {
    const params: any = [];
    queryParams.forEach(key => {
      if (payload[key] !== undefined) {
        params.push(key + '=' + payload[key]);
      }
    });

    return `${path}${params.length ? '?' : ''}${params.join('&')}`;
  }

  /**
     * Returns API path with replaces params values
     * @param path : string from API_PATH
     * @param replaceParams : array of params that has to be replaced in the api path
     * @param payload: object of param's values it will replaced in the api path
     * @Input: getReplaceParams('/testcase/{{test_id}}/teststep', ['test_id'], { test_id : 1})
     * @Output: '/testcase/1/teststep'
     */
  static getReplaceParams = (path: string, replaceParams: Array<string>, payload: any) => {
    replaceParams.forEach(key => {
      path = path.split(`{{${key}}}`)
        .join(payload[key] || '');
    });

    return path;
  }

  /**
  * Returns API Url with append and replace params values with prepand domain
  * @param domain : string from domain
  * @param path : string from API_PATH
  * @param payload: object of param's values it will replaced in the api path
  * @param replaceParams : array of params that has to be replaced in the api path
  * @param queryParams : array of params that has to be replaced in the api path
  * @param configure : true when dynamically configure urls
  * @Input: getFullApiUrl('auth', '/testcase/{{test_id}}/teststep', { test_id : 1, 'user_id': 2, abc_id: 3 }, ['test_id'], ['abc_id','user_id'])
  * @Output: 'https://auth.domain.com/testcase/1/teststep?abc_id=3&user_id=2'
  */
  static getFullApiUrl(domain: string, path: string, payload: any, replaceParams: Array<string> = [], queryParams: Array<string> = []) {
    const domainUrl = environment.apiUrls.baseUrl;
    if (replaceParams && replaceParams.length) {
      path = this.getReplaceParams(path, replaceParams, payload);
    }

    if (queryParams && queryParams.length) {
      path = this.getAppendParams(path, queryParams, payload);
    }
    return `${domainUrl}${path}`;
  }
}

