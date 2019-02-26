import { shallow } from "enzyme";
import React from "react";
import { CallerDialpadForm } from "calls/components/dialpads/CallerDialpadForm/CallerDialpadForm";

it("renders DtmfDialpadForm without crashing", () => {
  const onChange = jest.fn();
  const unSelectUser = jest.fn();
  const wrapper = shallow(
    <CallerDialpadForm phoneService={{}} onChange={onChange} unSelectUser={unSelectUser} />
  );

  expect(wrapper.text()).toEqual("<GridRow /><GridRow />");
});

it("contains expected texts", () => {
  const onChange = jest.fn();
  const unSelectUser = jest.fn();

  const wrapper = shallow(
    <CallerDialpadForm phoneService={{}} onChange={onChange} unSelectUser={unSelectUser} />
  );

  expect(wrapper.text()).toEqual("<GridRow /><GridRow />");
});

it("contains expected strings", () => {
  const onChange = jest.fn();
  const unSelectUser = jest.fn();
  const wrapper = shallow(
    <CallerDialpadForm phoneService={{}} onChange={onChange} unSelectUser={unSelectUser}/>
  );

  expect(wrapper.debug()).toContain("<Fragment");
  expect(wrapper.debug()).toContain("DialpadInput");
  expect(wrapper.debug()).toContain("Input a number...");
});
