import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Icon,
  Loader,
  Segment,
  Checkbox,
  Form,
  Message
} from 'semantic-ui-react';
import { actionMessage, logMessage } from 'common/utils/logs';
import ElectronService from 'services/electron-service';
import styles from './NumberConnector.module.css';

function NoNumbersButton({ numbersLength }) {
  if (numbersLength === 0) {
    return (
      <Button fluid className="ConnectNumberButton" disabled>
        {'There are no phone numbers in this section.'}
      </Button>
    );
  }
  return null;
}

const ButtonNumbersList = ({ numbers, connect }) => (
  <React.Fragment>
    <div>
      <h4>Personal</h4>
      {numbers.personal.map((item, index) => (
        <Button
          fluid
          key={`number-${index}`}
          className="ConnectNumberButton"
          onClick={() => connect(item)}
        >
          <Icon name="plug" />
          {item}
        </Button>
      ))}
      <NoNumbersButton numbersLength={numbers.personal.length} />
    </div>
    <div style={{ marginTop: 10 }}>
      <h4>Shared</h4>
      {numbers.shared.map((item, index) => (
        <Button
          fluid
          key={`number-${index}`}
          className="ConnectNumberButton"
          onClick={() => connect(item)}
        >
          <Icon name="plug" />
          {item}
        </Button>
      ))}
      <NoNumbersButton numbersLength={numbers.shared.length} />
    </div>
  </React.Fragment>
);
ButtonNumbersList.propTypes = {
  numbers: PropTypes.array,
  connect: PropTypes.func.isRequired
};

const DisplayErrors = ({ errorMessage }) => {
  const [showError, setShowError] = useState(1);
  if (errorMessage && showError) {
    return (
      <Message
        onDismiss={() => setShowError(!showError)}
        error
        header={errorMessage}
        list={[
          'You can try again in few minutes.',
          'If the problem persists contact support.'
        ]}
      />
    );
  }
  return null;
};

/**
 * Button to connect a user phone number
 */
export class NumberConnector extends Component {
  static propTypes = {
    phoneService: PropTypes.object.isRequired, // Phone Service
    connecting: PropTypes.bool.isRequired,
    numbers: PropTypes.array,
    getUserPhoneNumbers: PropTypes.func.isRequired,
    setActiveNumber: PropTypes.func.isRequired,
    rememberNumber: PropTypes.bool.isRequired,
    setRememberNumber: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { getUserPhoneNumbers, rememberNumber, activeNumber } = this.props;

    const toneToken = ElectronService.getToneToken();

    if (rememberNumber && toneToken && activeNumber) {
      this.connect(activeNumber);
    }

    getUserPhoneNumbers();
  }

  connect = activeNumber => {
    const { phoneService, setActiveNumber } = this.props;

    actionMessage(`Calls | User clicks connect button (${activeNumber})`);

    setActiveNumber(activeNumber);
    const result = phoneService.authenticateUser(activeNumber);
    logMessage(result);
  };

  rememberNumberOnChange = () => {
    logMessage('Remember number on change');
    const { setRememberNumber, rememberNumber } = this.props;

    setRememberNumber(!rememberNumber);
  };

  render() {
    const { connecting, numbers, rememberNumber, error } = this.props;
    if (connecting) {
      return (
        <Segment padded basic textAlign="center">
          <DisplayErrors errorMessage={error} />
          <Dimmer active inverted>
            <Loader active inline="centered" content="Connecting..." />
          </Dimmer>
        </Segment>
      );
    }

    if (numbers === undefined || numbers.length === 0) {
      return (
        <Segment padded basic textAlign="center">
          <DisplayErrors errorMessage={error} />
          <Dimmer active inverted>
            <Loader
              active
              inline="centered"
              content="Loading phone numbers..."
            />
          </Dimmer>
        </Segment>
      );
    }

    return (
      <React.Fragment>
        <DisplayErrors errorMessage={error} />
        <ButtonNumbersList
          numbers={numbers}
          connect={this.connect}
          connecting={connecting}
        />
        <Form className={styles.rememberNumberForm}>
          <Form.Field>
            <Checkbox
              toggle
              checked={rememberNumber}
              onChange={this.rememberNumberOnChange}
              label="Register automatically the selected phone
            number when app starts."
            />
          </Form.Field>
        </Form>
      </React.Fragment>
    );
  }
}

export default NumberConnector;
