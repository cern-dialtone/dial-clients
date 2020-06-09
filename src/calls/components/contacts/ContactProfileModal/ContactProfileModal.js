import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
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

function ContactProfileModalContent({ profile }) {
  return (
    <Modal.Content>
      <UserProfileExtraInfo
        mail={profile.mail}
        physicalDeliveryOfficeName={profile.physicalDeliveryOfficeName}
      />
      {profile.phones &&
        profile.phones.map((phone, index) => {
          if (phone.number !== null) {
            return (
              <UserPhoneNumberButtonContainer
                key={`button-${index}`}
                phoneNumber={phone.number}
                icon={phone.phoneType}
                callerName={profile.displayName}
              />
            );
          }
          return null;
        })}
    </Modal.Content>
  );
}

ContactProfileModalContent.propTypes = {
  profile: PropTypes.shape({
    phones: PropTypes.arrayOf.isRequired
  })
};

ContactProfileModalContent.defaultProps = {
  profile: null
};

function ContactProfileModalHeader({ profile }) {
  return (
    <Header>
      <Icon name="user" color="blue" />
      <Header.Content>
        <Header as="h5" floated="right">
          <ContactAddButton contact={profile} />
        </Header>
        {profile ? profile.displayName : ''}
        <Header.Subheader>
          {profile ? formatUserOrganization(profile) : ''}
        </Header.Subheader>
      </Header.Content>
    </Header>
  );
}

ContactProfileModalHeader.propTypes = {
  profile: PropTypes.shape({
    displayName: PropTypes.string
  })
};

ContactProfileModalHeader.defaultProps = {
  profile: {
    displayName: ''
  }
};

export class ContactProfileModal extends Component {
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    unSelectContact: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      number: PropTypes.string
    }),
    fetching: PropTypes.bool.isRequired
  };

  static defaultProps = {
    profile: null
  };

  handleClose = () => {
    const { unSelectContact } = this.props;
    unSelectContact();
  };

  render() {
    const { modalOpen, profile, fetching } = this.props;
    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        {fetching ? (
          <Modal.Content>
            <Segment basic>
              <Dimmer active inverted>
                <Loader inverted size="large" />
              </Dimmer>
            </Segment>
          </Modal.Content>
        ) : (
          <React.Fragment>
            <ContactProfileModalHeader profile={profile} />
            <ContactProfileModalContent profile={profile} />
          </React.Fragment>
        )}
      </Modal>
    );
  }
}

export default ContactProfileModal;
