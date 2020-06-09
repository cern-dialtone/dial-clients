import React from 'react';
import { render } from '@testing-library/react';
import PrivateMessageButton from './PrivateMessageButton';

describe('ContactProfileModal tests', () => {
  it('renders the modal closed', async () => {
    const { asFragment, queryByTestId } = render(
      <PrivateMessageButton
        profile={{
          personId: '4',
          mail: 'testmail@cern.ch',
          physicalDeliveryOfficeName: 'Name',
          username: 'username',
          phones: [],
          displayName: 'User Name',
          division: 'IT',
          cernGroup: 'CDA',
          cernSecction: 'IC'
        }}
      />
    );
    const modal = queryByTestId('PrivateMessageButton');
    expect(modal).toBeNull();

    expect(asFragment()).toMatchSnapshot();
  });
});
