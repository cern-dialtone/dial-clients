import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import ContactProfileModal from './ContactProfileModal';
import configureMockStore from 'redux-mock-store';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';

global.remote = {
  require: jest.fn()
};
const history = createHashHistory();
const middlewares = [thunk, routerMiddleware(history)];
const mockStore = configureMockStore(middlewares);
const initialState = {
  contacts: {
    getContacts: {
      contacts: {
        contacts: [
          {
            personId: '1'
          },
          {
            personId: '2'
          },
          {
            personId: '3'
          }
        ]
      }
    },
    addContacts: {
      added: []
    },
    removeContacts: {
      removed: []
    }
  },
  status: {
    doNotDisturb: false
  },
  call: {
    tempRemote: null
  },
  auth: {
    authToken: null
  },
  settings: {
    devices: []
  },
  connection: {
    connected: true
  }
};
const store = mockStore(initialState);

describe('ContactProfileModal tests', () => {
  it('renders the modal closed', async () => {
    const recentCalls = [
      {
        name: 'John Doe',
        endTime: 12345,
        phoneNumber: '222333',
        missed: true,
        incoming: true,
        startTime: 45678
      }
    ];
    const { asFragment, queryByTestId } = render(
      <Provider store={store}>
        <ContactProfileModal
          modalOpen={false}
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
          fetching={false}
          unSelectContact={() => {}}
        />
      </Provider>
    );
    const modal = queryByTestId('ContactProfileModal');
    expect(modal).toBeNull();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the modal open', async () => {
    const recentCalls = [
      {
        name: 'John Doe',
        endTime: 12345,
        phoneNumber: '222333',
        missed: true,
        incoming: true,
        startTime: 45678
      }
    ];
    const { getByTestId } = render(
      <Provider store={store}>
        <ContactProfileModal
          modalOpen={true}
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
          fetching={false}
          unSelectContact={() => {}}
        />
      </Provider>
    );
    await waitForElement(() => getByTestId('ContactProfileModal'));
  });
});
