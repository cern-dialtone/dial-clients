import React, { Component } from 'react'
import {Grid} from 'semantic-ui-react'

import './LeftColumnHeader.css'
import {StatusSwitcherContainer} from 'containers/calls'
import {ToggleButtonContainer} from 'containers/sidebar'

class LeftColumnHeader extends Component {
  render () {
    return (
      <header className="padded-item column-header left-header">
        <Grid>
          <Grid.Column width={8}>
            <ToggleButtonContainer/>
          </Grid.Column>
          <Grid.Column width={8} textAlign={'right'} className={'right-sub-column'}>
            <StatusSwitcherContainer />
          </Grid.Column>
        </Grid>
      </header>
    )
  }
}

LeftColumnHeader.propTypes = {}

export default LeftColumnHeader
