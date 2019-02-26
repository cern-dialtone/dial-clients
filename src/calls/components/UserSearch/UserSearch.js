import React, { Component } from "react";
import PropTypes from "prop-types";
import { actionMessage, logMessage } from "common/utils/logs";

import "./UserSearch.css";
import { UserSearchForm } from "calls/components/UserSearch/UserSearchForm";
import CallerDialpadFormContainer from "calls/components/dialpads/CallerDialpadForm/index";
import { Grid, Icon, Menu } from "semantic-ui-react";

export class UserSearch extends Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    displayDialpad: PropTypes.bool.isRequired,
    onCall: PropTypes.bool.isRequired,
    calling: PropTypes.bool.isRequired,
    userSelected: PropTypes.bool.isRequired,
    dialpadValue: PropTypes.string,
    selectUser: PropTypes.func.isRequired,
    unSelectUser: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired,
    updateDialpadValue: PropTypes.func.isRequired,
    toggleDialpad: PropTypes.func.isRequired,
    clearSearchResults: PropTypes.func
  };

  state = {
    timeout: 0,
    activeItem: "search",
    searchValue: ""
  };

  shouldEnableSearch = () => {
    const { searchValue } = this.state;
    logMessage(`Should enable search? ${searchValue}: ${searchValue !== ""}`);
    return searchValue !== "";
  };

  componentDidMount() {
    this.shouldEnableSearch();
  }

  _handleSearchTimeout(value) {
    const { searchUsers } = this.props;
    const { searchValue } = this.state;

    logMessage("Calling set timeout");
    if (searchValue && searchValue.length > 3) {
      searchUsers(value).then(() => {
        this.setState({
          isLoading: false
        });
      });
    }
  }

  removeSearchResults = () => {
    const { clearSearchResults } = this.props;
    const { searchValue } = this.state;

    if (searchValue !== "") {
      clearSearchResults();
    }
  };

  handleSubmit = () => {
    const { searchUsers } = this.props;
    const { searchValue } = this.state;

    actionMessage(`Search: Submit a search search: ${searchValue}`);

    searchUsers(searchValue).then(result => {
      logMessage(result);
      this.setState({
        isLoading: false
      });
    });
  };

  handleSearchChange = (e, { name, value }) => {
    const { timeout } = this.state;

    this.setState({ [name]: value });
    this.shouldEnableSearch();
    this.removeSearchResults();

    if (timeout) {
      logMessage("Clearing timeout");
      clearTimeout(timeout);
    }

    this.setState({
      timeout: setTimeout(() => {
        this._handleSearchTimeout(value);
      }, 300)
    });
  };

  handleDialpadChange = event => {
    const { updateDialpadValue } = this.props;
    updateDialpadValue(event.target.value);
  };

  handleItemClick = (e, { name }) => {
    actionMessage(`Search: User clicks on ${name} button`);
    this.setState({ activeItem: name });
  };

  render() {
    const { searchValue, activeItem } = this.state;
    const { dialpadValue } = this.props;
    const shouldEnableSearch = this.shouldEnableSearch();
    const gridStyle = {
      display: "flex",
      height: "100%",
      flexDirection: "column"
    };

    return (
      <Grid padded style={gridStyle}>
        <Grid.Row>
          <Grid.Column width={16}>
            <Menu widths={2} size={"mini"}>
              <Menu.Item
                name="search"
                active={activeItem === "search"}
                onClick={this.handleItemClick}
                className={"DisplaySearchButton"}
              >
                <Icon name="search" /> Search
              </Menu.Item>
              <Menu.Item
                name="dialpad"
                active={activeItem === "dialpad"}
                onClick={this.handleItemClick}
                className={"DisplayDialpadButton"}
              >
                <Icon name="text telephone" /> Dialpad
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid.Row>
        {activeItem === "search" && (
          <UserSearchForm
            enableSearch={shouldEnableSearch}
            onSubmit={this.handleSubmit}
            value={searchValue}
            onChange={this.handleSearchChange}
          />
        )}
        {activeItem === "dialpad" && (
          <CallerDialpadFormContainer
            value={dialpadValue}
            onChange={this.handleDialpadChange}
            unSelectUser={this.props.unSelectUser}
          />
        )}
      </Grid>
    );
  }
}

export default UserSearch;
