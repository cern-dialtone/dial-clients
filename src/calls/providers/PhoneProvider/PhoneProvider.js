import React, { Children, Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as connectionActionCreators from "calls/actions/connection";
import * as callActionCreators from "calls/actions/call";
import * as recentActionCreators from "calls/actions/recent";
import * as searchActionCreators from "calls/actions/search";
import * as authActionCreators from "login/actions/auth";
import {
  errorMessage,
  infoMessage,
  logEvent,
  logMessage,
  toneInMessage,
  toneOutMessage
} from "common/utils/logs";
import { success, info, warning } from "common/actions/notifications";
import ErrorBoundary from "common/components/ErrorBoundary/ErrorBoundary";

export const phoneService = ComponentToWrap => {
  return class ThemeComponent extends Component {
    // let’s define what’s needed from the `context`
    static contextTypes = {
      phoneService: PropTypes.object
    };

    render() {
      const { phoneService } = this.context;
      // what we do is basically rendering `ComponentToWrap`
      // with an added `phoneService` prop, like a hook
      return (
        <ErrorBoundary>
          <ComponentToWrap {...this.props} phoneService={phoneService} />
        </ErrorBoundary>
      );
    }
  };
};

/**
 * Interfaces between Telephony API and UI
 */
class PhoneProvider extends Component {
  static propTypes = {
    onCall: PropTypes.bool.isRequired,
    recipient: PropTypes.object,
    token: PropTypes.object,
    children: PropTypes.node,
    requestConnection: PropTypes.func,
    setConnectionFailure: PropTypes.func,
    setConnected: PropTypes.func,
    requestDisconnection: PropTypes.func,
    setDisconnected: PropTypes.func,
    makeCall: PropTypes.func,
    rejectOutgoingCall: PropTypes.func,
    isCalling: PropTypes.func,
    isReceivingCall: PropTypes.func,
    callFailed: PropTypes.func,
    success: PropTypes.func,
    info: PropTypes.func,
    warning: PropTypes.func,
    unSelectUser: PropTypes.func.isRequired,
    addRecentCall: PropTypes.func.isRequired,
    acceptOutgoingCall: PropTypes.func.isRequired,
    hangupCall: PropTypes.func.isRequired,
    endSearch: PropTypes.func.isRequired,
    rejectIncomingCall: PropTypes.func.isRequired,
    clearToken: PropTypes.func.isRequired
  };

  state = {
    phoneService: this
  };

  ringToneId = "ringTone";
  ringBackToneId = "ringbackTone";
  callInputId = "callsAudioInput";

  registeredNotificationOpts = {
    // uid: 'once-please', // you can specify your own uid if required
    title: "You are connected now",
    position: "tr",
    autoDismiss: 2
  };

  unRegisteredNotificationOpts = {
    // uid: 'once-please', // you can specify your own uid if required
    title: "You have been disconnected",
    message: `You won't be able to make or receive any calls until you connect again`,
    position: "tr",
    autoDismiss: 4
  };

  callTerminatedNotificationOpts = {
    // uid: 'once-please', // you can specify your own uid if required
    title: "The call was terminated",
    position: "tr",
    autoDismiss: 2
  };

  static async loadDialApi() {
    logMessage(process.env.REACT_APP_TONE_API_PATH);
    const { Dial } = await import(process.env.REACT_APP_TONE_API_PATH);
    return Dial;
  }

  componentDidMount() {
    let dial = null;
    PhoneProvider.loadDialApi().then(Dial => {
      this.audioElement = document.getElementById(this.callInputId);
      dial = new Dial(this.audioElement);
      this.setState(
        {
          dial: dial
        },
        () => {
          this.addListeners();
        }
      );
    });
  }

  /**
   * Only for testing purposes.
   */
  sayHi = () => {
    logMessage("Hello!");
  };

  acceptIncomingCall = () => {
    const { acceptIncomingCall } = this.props;
    toneOutMessage(`Accepting incoming call`);

    this.stopRingTone();
    acceptIncomingCall();
    this.state.dial.answer();
  };

  acceptOutgoingCall = () => {
    logMessage("Accepting call");
    this.props.acceptOutgoingCall();
    // TODO We need to stablish a connection between the clients
  };

  addListeners = () => {
    this.notifier = this.state.dial.getNotifier();
    if (this.notifier) {
      this.notifier.on("ToneEvent", event => {
        this.eventHandler(event);
      });
    }
  };

  /**
   * Authenticates the user using the Telephony API
   * @param username
   * @returns {boolean|void|*}
   */
  authenticateUser = username => {
    const { token, requestConnection } = this.props;

    logEvent("calls", `authenticate`, `user: ${username}.`);
    toneOutMessage(`Authenticating user: ${username}/*****`);
    this.setState({ username: username });
    requestConnection();
    this.state.dial.authenticate(username, JSON.stringify(token));
    // TODO The ideal thing here is to know if the authentication succeeded
  };

  handleTrackAdded(event) {
    this.audioElement.srcObject = event.data.remoteStream;
    let playPromise = this.audioElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          infoMessage("On a call. Audio track playing");
          this.setState({
            trackAdded: true
          });
        })
        .catch(error => {
          errorMessage("Unable to play the audio track.");
          this.setState({
            trackAdded: false,
            error: error
          });
        });
    }
  }

  hangUpCurrentCall = () => {
    const { dial } = this.state;
    toneOutMessage(`Hang up current call`);
    const { addRecentCall, recipient } = this.props;
    this.hangUpCallEvent();
    addRecentCall(recipient);
    return dial.hangUp();
  };

  hangUpCallEvent = () => {
    const { username } = this.state;
    const { hangupCall, unSelectUser } = this.props;

    logEvent("calls", `hangUp`, `caller: ${username}.`);

    hangupCall();
    unSelectUser();
  };

  /**
   * Makes a call to another person given his/her data
   * @param name Name of the person
   * @param phoneNumber Phone number
   * @returns {*}
   */
  makeCall = ({ name, phoneNumber }) => {
    const { makeCall, isCalling, endSearch } = this.props;
    const { dial, username } = this.state;

    toneOutMessage(`Calling user ${name} with number ${phoneNumber}`);
    logEvent(
      "calls",
      `make`,
      `caller: ${username}. callee: ${name}. number: ${phoneNumber}`
    );
    makeCall({
      name: name,
      phoneNumber: phoneNumber
    });
    this.playRingbacktone();
    isCalling();
    endSearch();
    return dial.call(phoneNumber);
  };

  playRingbacktone = () => {
    document
      .getElementById(this.ringBackToneId)
      .play()
      .catch(() => {
        errorMessage("RingbackTone play() raised an error.");
      });
  };

  playRingTone = () => {
    document
      .getElementById(this.ringToneId)
      .play()
      .catch(() => {
        errorMessage("RingTone play() raised an error.");
      });
  };

  sendDtmfCommand = tone => {
    this.state.dial.sendDTMF(tone);
  };

  stopRingbacktone = () => {
    document.getElementById(this.ringBackToneId).pause();
  };

  stopRingTone = () => {
    document.getElementById(this.ringToneId).pause();
  };

  receiveCall = ({ callerNumber, callerName }) => {
    const { isReceivingCall } = this.props;
    logMessage("Is receiving call");
    this.playRingTone();
    isReceivingCall(callerNumber, callerName);
  };

  /**
   * Method that must be called when an incoming call is rejected.
   * It performs all the actions needed by this action.
   */
  rejectIncomingCall = () => {
    const { unSelectUser, rejectIncomingCall } = this.props;
    const { dial } = this.state;

    logMessage("Rejecting incoming call");

    this.stopRingTone();
    // addRecentCall(recipient);
    unSelectUser();
    rejectIncomingCall();
    return dial.hangUp();
  };

  rejectOutgoingCall = () => {
    const { unSelectUser, rejectOutgoingCall } = this.props;

    logMessage("Rejecting call");

    this.stopRingTone();
    // addRecentCall(recipient);
    unSelectUser();
    rejectOutgoingCall();
  };

  /**
   * Logs the user out of TONE
   */
  unAuthenticateUser = () => {
    logEvent("calls", `unAuthenticate`, `user: ${this.state.username}.`);
    toneOutMessage(`UnAuthenticating user`);

    this.setState({ username: undefined });

    if (this.props.onCall) {
      this.hangUpCurrentCall();
    }
    this.props.requestDisconnection(true);
    return this.state.dial.stopAgent();
    // TODO Maybe stopAgent() is not the right method to call
  };

  getChildContext() {
    return { phoneService: this.state.phoneService };
  }

  eventHandler = event => {
    toneInMessage(`Tone Event received: ${event.name}`);
    toneInMessage(event);
    const tempRejectedMessage = {
      code: {
        status_code: "NI"
      },
      description: "NOT IMPLEMENTED (REJECTED)"
    };

    const tempFailedMessage = {
      code: {
        status_code: "NI"
      },
      description: "NOT IMPLEMENTED (FAILED)"
    };

    switch (event.name) {
      // SetMedia
      case "trackAdded":
        infoMessage("trackAdded ");
        this.handleTrackAdded(event);
        break;
      // Registering
      case "registered":
        this.props.success(this.registeredNotificationOpts);
        this.props.setConnected();
        // this.props.clearToken();
        break;
      case "unregistered":
        this.props.warning(this.unRegisteredNotificationOpts);
        this.props.setDisconnected();
        break;
      case "registrationFailed":
        if (event.error !== undefined) {
          this.props.setConnectionFailure(event.error);
        }
        break;
      // Calls
      case "progress":
        logMessage("onACall");
        break;
      case "accepted":
        // TODO
        this.stopRingbacktone();
        this.props.recipient.startTime = Date.now();
        this.props.acceptOutgoingCall();
        break;
      case "terminated":
        // TODO
        this.stopRingbacktone();
        this.stopRingTone();
        this.props.success(this.callTerminatedNotificationOpts);
        this.hangUpCallEvent();
        break;
      case "rejected":
        // TODO: Detail doesn't include error field nor error code
        this.props.rejectOutgoingCall(tempRejectedMessage);
        this.stopRingbacktone();
        this.hangUpCallEvent();
        break;
      case "failed":
        // TODO
        this.props.callFailed(tempFailedMessage);
        break;

      case "inviteReceived":
        logMessage(event.data);
        this.receiveCall(event.data);
        break;
      default:
        errorMessage(`Unhandled event: ${event.name}`);
    }
  };

  render() {
    const { children } = this.props;
    return Children.only(children);
  }
}

PhoneProvider.childContextTypes = {
  phoneService: PropTypes.object.isRequired
};

function mapStateToProps({ calls, auth }) {
  return {
    recipient: calls.call ? calls.call.recipient : undefined,
    onCall: calls.call ? calls.call.onCall : false,
    token: auth.token
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...connectionActionCreators,
      ...callActionCreators,
      ...recentActionCreators,
      ...searchActionCreators,
      ...authActionCreators,
      success,
      info,
      warning
    },
    dispatch
  );
}

export default phoneService(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PhoneProvider)
);
