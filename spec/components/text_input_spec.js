import TextInput from "../../app/components/text_input";

describe("<TextInput />", () => {
  it("renders", () => {
    render(<TextInput />);
  });

  it("applies the theme", () => {
    const input = render(<TextInput color="green" />);
    const nativeInput = input.getByTestId("native_input");

    fireEvent(nativeInput, "focus");

    expect(style(nativeInput).borderBottomColor).toBe(palette.green.primary);
    expect(props(nativeInput).selectionColor).toBe(palette.green.primary);
  });

  it("shows an alternative placeholder if the original is hidden", () => {
    const input = render(<TextInput placeholder="Add a value" defaultValue="123" />);
    const nativeInput = input.getByTestId("native_input");

    fireEvent(nativeInput, "focus");
    expect(input.queryByTestId("alternative")).not.toBeNull();

    fireEvent(nativeInput, "changeText", "");
    expect(input.queryByTestId("alternative")).toBeNull();

    fireEvent(nativeInput, "changeText", "456");
    expect(input.queryByTestId("alternative")).not.toBeNull();
  });

  it("does not show an alternative when not focussed", () => {
    const input = render(<TextInput placeholder="Add a value" defaultValue="123" />);
    const nativeInput = input.getByTestId("native_input");

    expect(input.queryByTestId("alternative")).toBeNull();
  });

  it("does not show an alternative if there is no placeholder", () => {
    const input = render(<TextInput defaultValue="123" />);
    const nativeInput = input.getByTestId("native_input");

    fireEvent(nativeInput, "focus");
    expect(input.queryByTestId("alternative")).toBeNull();
  });

  it("can set an 'onChangeText' callback", () => {
    const callback = jest.fn();
    const input = render(<TextInput onChangeText={callback} />);
    const nativeInput = input.getByTestId("native_input");

    fireEvent(nativeInput, "changeText", "123");
    expect(callback).toHaveBeenCalled();
  });

  it("can set an 'onFocus' callback", () => {
    const callback = jest.fn();
    const input = render(<TextInput onFocus={callback} />);
    const nativeInput = input.getByTestId("native_input");

    fireEvent(nativeInput, "focus");
    expect(callback).toHaveBeenCalled();
  });

  it("can set an 'onBlur' callback", () => {
    const callback = jest.fn();
    const input = render(<TextInput onBlur={callback} />);
    const nativeInput = input.getByTestId("native_input");

    fireEvent(nativeInput, "blur");
    expect(callback).toHaveBeenCalled();
  });
});
