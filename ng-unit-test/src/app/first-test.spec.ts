describe('my first test', () => {
  let sut;

  beforeEach(() => {
    sut = {};
  });

  it('should be true if true', () => {
    // arrange
    sut.a = false;

    // act
    sut.a = true;

    // assert
    expect(sut.a).toBe(true);
  });
});

// my first test should be true if true
// user service getUser method should retrieve the correct user
