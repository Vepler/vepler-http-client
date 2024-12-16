const logger = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    __call: jest.fn()
};

export default logger as unknown as jest.Mock<any, any>;
