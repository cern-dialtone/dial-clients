import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Icon, Modal, Menu, Header } from 'semantic-ui-react';

import DeviceSettings from 'settings/components/DeviceSettings/DeviceSettings';
import PersonalInfo from 'settings/components/PersonalInfo/PersonalInfo';
import AppInfo from 'settings/components/AppInfo/AppInfo';
import LogoutButtonContainer from 'auth/components/LogoutButton/LogoutButtonContainer';
import CallsSettings from 'settings/components/CallsSettings/CallsSettings';
import RememberNumberSettingsContainer from 'settings/components/RememberNumberSettings/RememberNumberSettingsContainer';
import UpdateSettings from 'settings/components/UpdateSettings/UpdateSettings';
import SendStatsSettingsContainer from 'settings/components/SendStatsSettings/SendStatsSettingsContainter';

const ModalTrigger = ({ onClick }) => (
  <Menu.Item
    onClick={onClick}
    name="settings"
    className="SidebarSettingsButton"
  >
    <Icon name="settings" />
    {'Settings'}
  </Menu.Item>
);

ModalTrigger.propTypes = {
  onClick: PropTypes.func.isRequired
};

/**
 * Modal to view and manage the application settings
 */
export class SettingsModal extends Component {
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    openSettingsModal: PropTypes.func.isRequired,
    closeSettingsModal: PropTypes.func.isRequired
  };

  handleClose = () => {
    const { closeSettingsModal } = this.props;
    closeSettingsModal();
  };

  render() {
    const { t, modalOpen } = this.props;
    // this fix is needed in order to center the modal on the screen. (Semantic UI bug)
    return (
      <Modal
        size="small"
        dimmer="blurring"
        closeIcon
        className="ModalSettings"
        onClose={this.handleClose}
        open={modalOpen}
      >
        <Modal.Header>{t('header')}</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <PersonalInfo />
            <hr />
            <CallsSettings />
            <hr />
            <RememberNumberSettingsContainer />
            <hr />
            <SendStatsSettingsContainer />
            <hr />
            <DeviceSettings />
            <hr />
            <UpdateSettings />
            <hr />
            <Header as="h4">{t('dangerZoneHeader')}</Header>
            <LogoutButtonContainer color="red" />
            <hr />
            <AppInfo />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default translate('settings')(SettingsModal);
