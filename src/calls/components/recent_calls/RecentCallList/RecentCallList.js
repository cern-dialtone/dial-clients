import React, { Component } from "react";
import PropTypes from "prop-types";

import { Item } from "semantic-ui-react";
import RecentCall from "calls/components/recent_calls/RecentCall/RecentCall";
import ScrollableContent from "common/components/ScrollableContent/ScrollableContent";

/**
 * Displays a scrollable list of RecentCall Components
 */
class RecentCallList extends Component {
  static propTypes = {
    recentCalls: PropTypes.array.isRequired
  };

  render() {
    const { recentCalls } = this.props;

    return (
      <ScrollableContent>
          <Item.Group onFocus={() => {
            
          }} aria-label="Recent calls list" tabIndex="0" link>
          {recentCalls.map((item, index) => {
            if (item && !item.name) return null;
            return <RecentCall
                    key={`recent-${index}`}
                    recentCall={item}
                  />
          })}
        </Item.Group>
      </ScrollableContent>
    );
  }
}

export default RecentCallList;
