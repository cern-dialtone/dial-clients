import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUserContact, getUserContacts, removeUserContact } from "calls/actions/contacts";
import ContactAddButton from "calls/components/contacts/ContactAddButton/ContactAddButton";


function mapStateToProps({ calls }) {
  return {
    contacts: calls.contacts.getContacts.contacts,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addUserContact,
    removeUserContact,
    getUserContacts,
  }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ContactAddButton);