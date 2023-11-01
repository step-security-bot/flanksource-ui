import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConnectionFormModal from "../ConnectionFormModal";
import { ConnectionValueType } from "../connectionTypes";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe("ConnectionForm", () => {
  const formInitialValue = {
    type: ConnectionValueType.Git,
    name: "Test Connection",
    url: "https://test.com",
    certificate: "test",
    ref: "main"
  };

  const onConnectionSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form when provided with initial value", async () => {
    render(
      <ConnectionFormModal
        formValue={formInitialValue}
        isOpen={true}
        setIsOpen={() => {}}
        onConnectionDelete={async (data) => {}}
        onConnectionSubmit={onConnectionSubmit}
      />
    );

    await waitFor(() => screen.findByRole("button", { name: /Save/i }));

    expect(screen.getByLabelText("Name")).toHaveValue("Test Connection");
    expect(screen.getByLabelText("URL")).toHaveValue("https://test.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: /Save/i
      })
    );

    await waitFor(() => {
      expect(onConnectionSubmit).toHaveBeenCalledWith({
        certificate: "test",
        name: "Test Connection",
        password: undefined,
        properties: {
          ref: "ref"
        },
        type: "git",
        url: "https://test.com",
        username: undefined
      });
    });
  });

  it("renders list of connection types", async () => {
    render(
      <ConnectionFormModal
        formValue={undefined}
        isOpen={true}
        setIsOpen={() => {}}
        onConnectionSubmit={async (data) => {}}
        onConnectionDelete={async (data) => {}}
      />
    );

    expect(await screen.findByText("Git")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("renders form when connection type is selected", async () => {
    render(
      <ConnectionFormModal
        formValue={undefined}
        isOpen={true}
        setIsOpen={() => {}}
        onConnectionSubmit={async (data) => {}}
        onConnectionDelete={async (data) => {}}
      />
    );

    fireEvent.click(await screen.findByText("Git"));

    expect(await screen.findByLabelText("URL")).toBeInTheDocument();
  });
});
