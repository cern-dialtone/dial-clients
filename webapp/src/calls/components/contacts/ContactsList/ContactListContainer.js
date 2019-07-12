import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dialBackendApi from 'services/api';
import ContactList from './ContactList';

function mapStateToProps({ calls }) {
  return {
    contacts: calls.contacts.getContacts.contacts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserContacts: dialBackendApi().getUserContacts
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactList);
