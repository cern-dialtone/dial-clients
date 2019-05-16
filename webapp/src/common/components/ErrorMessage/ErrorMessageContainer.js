import { connect } from "react-redux";
import withPhoneService from 'calls/providers/PhoneProvider/PhoneService';
import ErrorMessage from "common/components/ErrorMessage/ErrorMessage";

function mapStateToProps({ calls, auth }) {
  return {
    errors: [
      calls.call.error,
      calls.connection.error,
      calls.numbers.error,
      auth.error
    ]
  };
}

export const ErrorMessageContainer = connect(
  mapStateToProps,
  null
)(ErrorMessage);

export default withPhoneService(ErrorMessageContainer);
