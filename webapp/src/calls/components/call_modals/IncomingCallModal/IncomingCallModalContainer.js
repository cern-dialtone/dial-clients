import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {setIsReceivingCall, rejectIncomingCall} from "calls/actions/call";

import IncomingCallModal from "./IncomingCallModal";
import { phoneService } from "calls/providers/PhoneProvider/PhoneProvider";

/**
 * Mapping the props to the container
 * @param calls
 * @returns {{connected: *, receivingCall: boolean, callerName: *, callerNumber: *}}
 */
function mapStateToProps({ calls }) {
  return {
    connected: calls.connection.connected,
    receivingCall: calls.call.receivingCall,
    callerName: calls.call.recipient.name,
    callerNumber: calls.call.recipient.phoneNumber
  };
}

/**
 * Mapping the functions to the container
 * @param dispatch
 * @returns {{CALL?: string, IS_CALLING?: string, OUTGOING_CALL_ACCEPTED?: string, OUTGOING_CALL_REJECTED?: string, CALL_FAILED?: string, CALL_MISSED?: string, IS_RECEIVING_CALL?: string, HANGUP_CALL?: string, INCOMING_CALL_ACCEPTED?: string, INCOMING_CALL_REJECTED?: string, makeCall?, isCalling?, isReceivingCall?, acceptOutgoingCall?, acceptIncomingCall?, rejectIncomingCall?, rejectOutgoingCall?, callFailed?, missCall?, hangupCall?}}
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setIsReceivingCall,
    rejectIncomingCall
  }, dispatch);
}

/**
 * Redux connected Container for CallingModal
 */
export const IncomingCallModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(IncomingCallModal);

/**
 * Default export is binds phoneService
 */
export default phoneService(IncomingCallModalContainer);
