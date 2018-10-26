import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Menu, Modal, Icon, Button } from 'semantic-ui-react'
import { logMessage } from 'common/utils'
import { phoneService } from 'calls/providers/PhoneProvider/PhoneProvider'

const ModalTrigger = ({ onClick }) => {
  return (
    <Menu.Item onClick={onClick} name={'bug'}>
      <Icon name={'bug'} />
      {'Debug'}
    </Menu.Item>
  )
}

ModalTrigger.propTypes = {
  onClick: PropTypes.func.isRequired
}

class ModalDebug extends Component {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    hideSidebarIfVisible: PropTypes.func.isRequired,
    phoneService: PropTypes.object.isRequired
  }

  receiveCall = () => {
    const { phoneService } = this.props
    logMessage('Receiving call in some seconds')
    phoneService.eventHandler({
      name: 'invite',
      data: {
        callerNumber: '555 444 333',
        callerName: 'John Doe'
      }
    })
  }

  render () {
    const { connected } = this.props
    // this fix is needed in order to center the modal on the screen. (Semantic UI bug)
    return (
      <Modal
        size={'large'}
        dimmer={'blurring'}
        closeIcon
        trigger={<ModalTrigger onClick={this.props.hideSidebarIfVisible} />}
      >
        <Modal.Header>{'Debug'}</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <p>{`This is the Ddebug content`}</p>
            <Button disabled={!connected} onClick={this.receiveCall}>
              Receive a call
            </Button>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

ModalDebug.propTypes = {}

export default phoneService(ModalDebug)