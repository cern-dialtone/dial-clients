import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callForwardingActionFactory, callForwardingActions } from 'dial-core';
import config from 'config';
import { CallForwardingForm } from './CallForwardingForm';

const apiEndpoint = config.api.ENDPOINT;

function mapStateToProps({ callForwarding, calls }) {
  return {
    localForwardList: callForwarding.localForwardList,
    fetchingStatus: callForwarding.fetchingStatus,
    status: callForwarding.status,
    activeNumber: calls.numbers.activeNumber,
    lastOperationResult: callForwarding.lastOperationResult
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCallForwardingStatus: callForwardingActionFactory(apiEndpoint)
        .getCallForwardingStatus,
      disableCallForwarding: callForwardingActionFactory(apiEndpoint)
        .disableCallForwarding,
      enableSimultaneousRinging: callForwardingActionFactory(apiEndpoint)
        .enableSimultaneousRinging,
      enableCallForwarding: callForwardingActionFactory(apiEndpoint)
        .enableCallForwarding,
      clearLastOperation: callForwardingActions.clearLastOperation
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallForwardingForm);
