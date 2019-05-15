import { shallow } from "enzyme/build";
import React from "react";
import { OutgoingCallModal } from "calls/components/call_modals/OutgoingCallModal/OutgoingCallModal";

describe("Outgoing Call Modal Tests", () => {
  it("renders OutgoingCallModal without crashing", () => {
    const phoneNumber = "123456";
    const recipient = "John Doe";
    const wrapper = shallow(
      <OutgoingCallModal
        phoneNumber={phoneNumber}
        phoneService={{}}
        recipientName={recipient}
        t={key => key}
      />
    );

    expect(wrapper.text()).toEqual("<Modal />");
  });

  it("contains Texts", () => {
    const phoneNumber = "123456";
    const recipient = "John Doe";
    const wrapper = shallow(
      <OutgoingCallModal
        phoneNumber={phoneNumber}
        phoneService={{}}
        recipientName={recipient}
        t={key => key}
      />
    );

    expect(wrapper.debug()).toContain("ModalContent");
    expect(wrapper.debug()).toContain("callingText");
    expect(wrapper.debug()).toContain("phone");
    expect(wrapper.debug()).toContain(phoneNumber);
    expect(wrapper.debug()).toContain(recipient);
  });

  it("can cancel a call", () => {
    const hangUpCurrentCallAction = jest.fn();

    const phoneNumber = "123456";
    const recipient = "John Doe";
    const phoneService = {
      hangUpCurrentCallAction: hangUpCurrentCallAction
    };

    const wrapper = shallow(
      <OutgoingCallModal
        phoneNumber={phoneNumber}
        phoneService={phoneService}
        recipientName={recipient}
        t={key => key}
      />
    );

    const div = wrapper.find(".HangupButton");
    div.simulate("click");

    expect(hangUpCurrentCallAction).toHaveBeenCalled();
  });
});
