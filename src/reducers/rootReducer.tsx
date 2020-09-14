import { PURGE } from "redux-persist";
import { IState } from "../interfaces/IState";

const initialState: IState = { profile: {} };

export const rootReducer = (state = initialState, action: any): IState => {
  switch (action.type) {
    case "SET_PROFILE":
      return { profile: action.payload };
    case "CHANGE_PROFILE": {
      const {
        payload: { email, display_name },
      } = action;
      return { profile: { ...(state.profile || {}), email, display_name } };
    }
    case "REFRESH_SPOTIFY": {
      const {
        payload: { spotifyToken },
      } = action;
      return { profile: { ...state.profile, spotifyToken } };
    }
    case PURGE:
      return initialState;
    default:
      return state;
  }
};
