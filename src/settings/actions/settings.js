export const SET_REMEMBER_NUMBER = '@@settings/SET_REMEMBER_NUMBER';
export const SET_SEND_STATS = '@@settings/SET_SEND_STATS';

export function setRememberNumber(value) {
  return {
    type: SET_REMEMBER_NUMBER,
    payload: value
  };
}

export function setSendStats(value) {
  return {
    type: SET_SEND_STATS,
    payload: value
  };
}
