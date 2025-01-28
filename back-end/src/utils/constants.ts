export const CONSTANTS = {
    ERRORS: {
        PREFIX: {
            LOGOUT: "LOGOUT: ",
            LOGIN: "LOGIN: ",
            SIGNUP: "SIGNUP: ",
            GET_TOKEN: "GET_TOKEN: ",
            VERIFY_SESSION: "VERIFY_SESSION: ",
        },
        USER_NOT_FOUND: "User not found",
        NO_SESSION: "User does not have a session",
        COOKIE_EXISTS: "User attempted to log in with an existing cookie",
        EMAIL_ALREADY_IN_USE: "Email is already in use",
        PASSWORD_MISMATCH: "Password does not match",
        INVALID_INPUT: "Invalid input data",
        CATASTROPHIC: "Catastrophic Error"
    },
    ROUTES: {
      USERS: "/api/users",
      AUTH: "/api/auth",
    },
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 10,
    },
    SALT_ROUNDS: 10
  };