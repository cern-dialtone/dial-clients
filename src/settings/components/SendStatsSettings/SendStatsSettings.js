import React from 'react';
import PropTypes from 'prop-types';
import { Header, Checkbox, Form } from 'semantic-ui-react';
import ErrorBoundary from 'common/components/ErrorBoundary/ErrorBoundary';

export class SendStatsSettings extends React.Component {
  rememberSendStatsStateOnChange = () => {
    const { setSendStats, sendStats } = this.props;
    setSendStats(!sendStats);
  };

  render = () => {
    const { sendStats } = this.props;

    return (
      <div>
        <ErrorBoundary>
          <Header as="h4">Statistics sends</Header>
          <Form>
            <Form.Field>
              <Checkbox
                toggle
                checked={sendStats}
                onChange={this.rememberSendStatsStateOnChange}
                label="Help us improve this application by allowing statistics sends."
              />
            </Form.Field>
          </Form>
        </ErrorBoundary>
      </div>
    );
  };
}

SendStatsSettings.propTypes = {
  sendStats: PropTypes.bool.isRequired,
  setSendStats: PropTypes.func.isRequired
};

export default SendStatsSettings;
