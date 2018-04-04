import React, {Component} from 'react'
import {Button, Icon, Segment} from 'semantic-ui-react'
import './Caller.css'
import PropTypes from 'prop-types'
import {translate} from 'react-i18next'
import {DialpadContainer, UserSearchContainer} from 'containers/calls'
import {PhoneNumbersMenu} from 'components/calls'

class Caller extends Component {
  static propTypes = {
    userSelected: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    updateSearchValue: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired,
    makeCall: PropTypes.func.isRequired
  }

  state = {
    displayDialpad: false
  }

  handleDialPadDisplayButton = () => {
    this.setState({
      displayDialpad: !this.state.displayDialpad
    })
  }

  render () {
    const {t} = this.props

    return (
      <div className="call-inner-content">
        <h2 className="ui center aligned header gray-text">{t('header')}</h2>
        <Segment attached className={'search-user'}>
          <UserSearchContainer/>
        </Segment>
        <Button attached='bottom' onClick={this.handleDialPadDisplayButton}>
          <Icon name={'text telephone'}/> {t('dialpadText')}
        </Button>
        {this.state.displayDialpad && <DialpadContainer/>}
        {this.props.userSelected && <PhoneNumbersMenu/>}
      </div>
    )
  }
}

export default translate('calls')(Caller)
