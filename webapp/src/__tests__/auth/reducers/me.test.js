import * as actions from "auth/actions/me";
import reducer from "auth/reducers/me";

describe("auth reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      email: null,
      firstName: null,
      lastName: null,
      mobile: null,
      phone: null,
      username: null,
      error: {},
      fetching: false,
      doNotDisturb: false
    });
  });

  it("should handle ME_REQUEST", () => {
    expect(
      reducer(
        {},
        {
          type: actions.ME_REQUEST
        }
      )
    ).toEqual({
      fetching: true,
      error: {}
    });
    expect(
      reducer(
        {
          fetching: false
        },
        {
          type: actions.ME_REQUEST
        }
      )
    ).toEqual({
      fetching: true,
      error: {}
    });
  });

  it("should handle LOGIN_SUCCESS", () => {
    expect(
      reducer(
        {},
        {
          type: actions.ME_SUCCESS,
          payload: {
            email: "a",
            firstName: "b",
            lastName: "c",
            mobile: "12345",
            phone: "09876",
            username: "e"
          }
        }
      )
    ).toEqual({
      email: "a",
      firstName: "b",
      lastName: "c",
      mobile: "12345",
      phone: "09876",
      username: "e",
      fetching: false,
      error: {}
    });
  });
  it("should handle LOGIN_FAILURE", () => {
    expect(
      reducer(
        {},
        {
          type: actions.ME_FAILURE,
          payload: {
            error: "An error happened"
          }
        }
      )
    ).toEqual({
      error: "An error happened",
      doNotDisturb: null,
      fetching: false,
      email: null,
      username: null,
      firstName: null,
      lastName: null,
      mobile: null,
      phone: null
    });
  });
});
