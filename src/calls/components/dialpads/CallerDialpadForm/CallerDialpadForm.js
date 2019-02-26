import React, { Component } from "react";
import { Grid, Form, Icon, Input } from "semantic-ui-react";
import PropTypes from "prop-types";
import CallerDialpadContainer from "../CallerDialpad";
import { buildRecipient, formatPhoneNumber } from "calls/utils";

export class CallerDialpadForm extends Component {

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    phoneService: PropTypes.object.isRequired,
    unSelectUser: PropTypes.func.isRequired
  };


  makeCall = () => {

    const {value} = this.props;

    const formattedNumber = formatPhoneNumber(value);

    const recipient = {
      name: value,
      phoneNumber: formattedNumber
    };

    this.props.unSelectUser();
    this.props.phoneService.makeCall(buildRecipient(recipient));
  };

  render = () => {
    return (
      <>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form onSubmit={this.makeCall} >
              <Form.Field width={16}>
                <Input
                  className={"DialpadInput"}
                  value={this.props.value}
                  placeholder={"Input a number..."}
                  onChange={this.props.onChange}
                  icon={
                    <Icon
                      name="text telephone"
                      inverted
                      color={"blue"}
                      circular
                    />
                  }
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <CallerDialpadContainer />
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }
}
