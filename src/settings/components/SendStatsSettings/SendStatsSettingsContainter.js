import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as setttingsActions from 'settings/actions/settings';

import SendStatsSettings from './SendStatsSettings';

function mapStateToProps({ settings }) {
  return {
    sendStats: settings.settings.sendStats
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSendStats: setttingsActions.setSendStats
    },
    dispatch
  );
}

export const SendStatsSettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendStatsSettings);

export default SendStatsSettingsContainer;
