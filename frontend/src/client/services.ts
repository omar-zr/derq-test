import type { CancelablePromise } from "./core/CancelablePromise"
import { OpenAPI } from "./core/OpenAPI"
import { request as __request } from "./core/request"

import type {
  Body_login_login_access_token,
  Message,
  NewPassword,
  Token,
  UserPublic,
  UpdatePassword,
  UserCreate,
  UserRegister,
  UsersPublic,
  UserUpdate,
  UserUpdateMe,
  VechilePerApproach,
  HealthCheck,
  HourlyData,
  GeneratorData,
  ConfigureData,
  Sensors,
} from "./models"

export type TDataLoginAccessToken = {
  formData: Body_login_login_access_token
}
export type TDataRecoverPassword = {
  email: string
}
export type TDataResetPassword = {
  requestBody: NewPassword
}
export type TDataRecoverPasswordHtmlContent = {
  email: string
}

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginAccessToken(
    data: TDataLoginAccessToken,
  ): CancelablePromise<Token> {
    const { formData } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/access-token",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static testToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/test-token",
    })
  }

  /**
   * Recover Password
   * Password Recovery
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static recoverPassword(
    data: TDataRecoverPassword,
  ): CancelablePromise<Message> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Reset Password
   * Reset password
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static resetPassword(
    data: TDataResetPassword,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/reset-password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Recover Password Html Content
   * HTML Content for Password Recovery
   * @returns string Successful Response
   * @throws ApiError
   */
  public static recoverPasswordHtmlContent(
    data: TDataRecoverPasswordHtmlContent,
  ): CancelablePromise<string> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery-html-content/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadUsers = {
  limit?: number
  skip?: number
}
export type TDataCreateUser = {
  requestBody: UserCreate
}
export type TDataUpdateUserMe = {
  requestBody: UserUpdateMe
}
export type TDataUpdatePasswordMe = {
  requestBody: UpdatePassword
}
export type TDataRegisterUser = {
  requestBody: UserRegister
}
export type TDataReadUserById = {
  userId: number
}
export type TDataUpdateUser = {
  requestBody: UserUpdate
  userId: number
}
export type TDataDeleteUser = {
  userId: number
}

export class UsersService {
  /**
   * Read Users
   * Retrieve users.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static readUsers(
    data: TDataReadUsers = {},
  ): CancelablePromise<UsersPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createUser(
    data: TDataCreateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me",
    })
  }

  /**
   * Delete User Me
   * Delete own user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserMe(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/me",
    })
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUserMe(
    data: TDataUpdateUserMe,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static updatePasswordMe(
    data: TDataUpdatePasswordMe,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me/password",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static registerUser(
    data: TDataRegisterUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserById(
    data: TDataReadUserById,
  ): CancelablePromise<UserPublic> {
    const { userId } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUser(
    data: TDataUpdateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody, userId } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
    const { userId } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadChart = {
  start_date: string
  end_date: string
  approach: string
  type: string
  sensor_id: string
}

export type TDataRunGenerator = {
  counts_rate: number,
  approach_prob: number[],
  class_prob: number[],
  downtime_prob: number,
}

export class AnalService {
  /**
   * Read Data
   * Get data by dates.
   * @returns VechilePerApproach Successful Response
   * @throws ApiError
   */
  public static readData(data: TDataReadChart): CancelablePromise<Array<VechilePerApproach>> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    const { start_date, end_date, approach, type, sensor_id } = data
    let endpoint = "/api/v1/sensors/data/counts?start_date={start_date}&end_date={end_date}"
    if (approach != 'all')
      endpoint += '&approach={approach}'
    if (type != 'all')
      endpoint += '&sensorclass={type}'
    if (sensor_id != null)
      endpoint += '&sensor_id={sensor_id}'
    return __request(configs, {
      method: "GET",
      url: endpoint,
      path: {
        start_date,
        end_date,
        approach,
        type,
        sensor_id
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Get Sensors
   * @returns Sensors Successful Response
   * @throws ApiError
   */
  public static getSensors(): CancelablePromise<Array<Sensors>> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    let endpoint = "/api/v1/sensors/info"
    return __request(configs, {
      method: "GET",
      url: endpoint,
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export class HealthService {
  /**
   * Read Health
   * Get health check.
   * @returns HealthCheck Successful Response
   * @throws ApiError
   */
  public static readData(data: TDataReadChart): CancelablePromise<Array<HealthCheck>> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    const { start_date, end_date, approach, type, sensor_id } = data
    let endpoint = "/api/v1/sensors/health/gaps?start_date={start_date}&end_date={end_date}"
    if (approach != 'all')
      endpoint += '&approach={approach}'
    if (type != 'all')
      endpoint += '&class_type={type}'
    if (sensor_id != null)
      endpoint += '&sensor_id={sensor_id}'
    return __request(configs, {
      method: "GET",
      url: endpoint,
      path: {
        start_date,
        end_date,
        approach,
        type,
        sensor_id
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export class SensorService {
  /**
   * Read Sensors
   * Get sensors data.
   * @returns HourlyData Successful Response
   * @throws ApiError
   */
  public static readData(data: TDataReadChart): CancelablePromise<Array<HourlyData>> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    const { start_date, end_date, approach, type, sensor_id } = data
    let endpoint = "/api/v1/sensors/data/detailed_counts?start_date={start_date}&end_date={end_date}"
    if (approach != 'all')
      endpoint += '&approach={approach}'
    if (type != 'all')
      endpoint += '&sensorclass={type}'
    if (sensor_id != null)
      endpoint += '&sensor_id={sensor_id}'
    return __request(configs, {
      method: "GET",
      url: endpoint,
      path: {
        start_date,
        end_date,
        approach,
        type,
        sensor_id
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export class GeneratorService {
  /**
   * Get Generator Status
   * @returns Generator Successful Response
   * @throws ApiError
   */
  public static getStatus(): CancelablePromise<GeneratorData> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    return __request(configs, {
      method: "GET",
      url: "/generator/status",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Configure Generator Data
   * @returns Configure Successful Response
   * @throws ApiError
   */
  public static configureGenerator(data: TDataRunGenerator): CancelablePromise<ConfigureData> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    return __request(configs, {
      method: "POST",
      url: "/generator/configure",
      body: data,
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Start Generator
   * @returns Configure Successful Response
   * @throws ApiError
   */
  public static startGenerator(): CancelablePromise<ConfigureData> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    return __request(configs, {
      method: "POST",
      url: "/generator/start",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Start Generator
   * @returns Configure Successful Response
   * @throws ApiError
   */
  public static stopGenerator(): CancelablePromise<ConfigureData> {
    let configs = OpenAPI
    configs.BASE = "http://localhost"
    return __request(configs, {
      method: "POST",
      url: "/generator/stop",
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

