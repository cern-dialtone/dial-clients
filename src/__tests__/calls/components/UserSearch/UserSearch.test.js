import React from "react";
import { UserSearchForm } from "calls/components/UserSearch/UserSearchForm";
import { UserSearch } from "calls/components/UserSearch/UserSearch";
import PropTypes from "prop-types";

describe("UserSearchForm component", () => {
  it("renders without crashing", () => {
    const onChange = jest.fn();
    const onSubmit = jest.fn();

    const wrapper = shallow(
      <UserSearchForm onChange={onChange} onSubmit={onSubmit}/>
    );

    expect(wrapper.text()).toEqual("<GridRow /><GridRow />");
    expect(wrapper.debug()).toContain("UserSearchInput");
    expect(wrapper.debug()).toContain("UserSearchResultsList");
  });

  it("runs the correct function on user search form submit", done  => {

    const selectUser = jest.fn();
    const unSelectUser = jest.fn();
    const searchUsers = jest.fn();
    const updateDialpadValue = jest.fn();
    const toggleDialpad = jest.fn();
    const clearSearchResults = jest.fn();

    const wrapper = shallow(
      <UserSearch
        results={['1', '2', '3']}
        displayDialpad={true}
        onCall={false}
        calling={false}
        userSelected={true}
        dialpadValue={'1'}
        selectUser={selectUser}
        unSelectUser={unSelectUser}
        searchUsers={searchUsers}
        updateDialpadValue={updateDialpadValue}
        toggleDialpad={toggleDialpad}
        clearSearchResults={clearSearchResults}
      />
    );

    searchUsers.mockImplementation(() => Promise.resolve({ results: [] }));


    wrapper.setState({ searchValue: 'test' }, () => {

      wrapper.update();

      wrapper.find('UserSearchForm').simulate('submit');

      setTimeout(()=>{
        expect(searchUsers).toHaveBeenCalled();
        done();
      }, 350);
    });

  });


});
