import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer,
  Header,
  Icon,
  Loader,
  Modal,
  Segment,
  Grid
} from 'semantic-ui-react';
import { formatUserOrganization } from 'calls/utils/formatters';
import UserPhoneNumberButtonContainer from 'calls/components/UserPhoneNumberButton/UserPhoneNumberButtonContainer';
import ContactAddButton from 'calls/components/contacts/ContactAddButton/ContactAddButton';
import UserProfileExtraInfo from 'calls/components/UserProfileExtraInfo/UserProfileExtraInfo';
import PrivateMessageButton from '../PrivateMessageButton/PrivateMessageButton';

function ContactProfileModalContent({ profile }) {
  return (
    <Modal.Content>
      <UserProfileExtraInfo
        mail={profile.mail}
        physicalDeliveryOfficeName={profile.physicalDeliveryOfficeName}
        username={profile.displayName}
      />
      <Grid columns={1} divided>
        <Grid.Row>
          <Grid.Column>
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <PrivateMessageButton profile={profile} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
const handleClose = unSelectContact => () => {
  unSelectContact();
};

function ContactProfileModal({
  modalOpen,
  profile,
  fetching,
  unSelectContact
}) {
  return (
    <Modal
      data-testid="ContactProfileModal"
      dimmer="blurring"
      size="tiny"
      open={modalOpen}
      onClose={handleClose(unSelectContact)}
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

export default ContactProfileModal;
