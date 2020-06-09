import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  // Button,
  Dimmer,
  Header,
  Icon,
  Loader,
  Modal,
  Segment
} from 'semantic-ui-react';
import { formatUserOrganization } from 'calls/utils/formatters';
import UserPhoneNumberButtonContainer from 'calls/components/UserPhoneNumberButton/UserPhoneNumberButtonContainer';
import ContactAddButton from 'calls/components/contacts/ContactAddButton/ContactAddButton';
import UserProfileExtraInfo from 'calls/components/UserProfileExtraInfo/UserProfileExtraInfo';

function SearchProfileModalHeader(props) {
  return (
    <Header>
      <Icon name="user" color={'blue'} />
      <Header.Content>
        <Header as="h5" floated={'right'}>
          <ContactAddButton contact={props.contact} />
        </Header>
        {props.contact ? props.contact.displayName : ''}
        <Header.Subheader>
          {props.contact ? formatUserOrganization(props.contact) : ''}
        </Header.Subheader>
      </Header.Content>
    </Header>
  );
}

SearchProfileModalHeader.propTypes = { contact: PropTypes.any };

function SearchProfileModalContent(props) {
  return (
    <Modal.Content>
      {props.user && (
        <UserProfileExtraInfo
          mail={props.user.mail}
          physicalDeliveryOfficeName={props.user.physicalDeliveryOfficeName}
        />
      )}
      {!props.user ? (
        <Segment basic>
          <Dimmer active inverted>
            <Loader inverted size={'large'} />
          </Dimmer>
        </Segment>
      ) : (
        props.user.phones.map((phone, index) => {
        if (phone.number !== null) {
          return (
            <UserPhoneNumberButtonContainer
              key={`button-${index}`}
              phoneNumber={phone.number}
              icon={phone.phoneType}
              callerName={props.user.displayName}
            />
          );
        } return null;
      })
      )}
    </Modal.Content>
  );
}

SearchProfileModalContent.propTypes = {
  user: PropTypes.any,
  f: PropTypes.func
};

export class SearchProfileModal extends Component {
  static propTypes = {
    user: PropTypes.object,
    userSelected: PropTypes.bool.isRequired,
    unSelectUser: PropTypes.func.isRequired
  };

  handleClose = () => {
    const { unSelectUser } = this.props;
    unSelectUser();
  };

  render() {
    const { userSelected, user } = this.props;
    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={userSelected}
        onClose={this.handleClose}
        closeIcon
      >
        <SearchProfileModalHeader contact={user} />
        <SearchProfileModalContent user={user} />
      </Modal>
    );
  }
}

export default SearchProfileModal;
