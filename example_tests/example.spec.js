

describe('Suite that passes', function() {
  it('2 plus 2 equals 4', function() {
    expect(2 + 2).toEqual(4);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  /*Just add loads the same to show test count padding in print output
   2  12  7
  11   6  7
  */
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('4 plus 4 equals 8', function() {
    expect(4 + 4).toEqual(8);
  });
});


describe('Suite that passes with test skipped', function() {
  it('2 plus 2 equals 4', function() {
    expect(2 + 2).toEqual(4);
  });
  xit('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  xit('4 plus 4 equals 8', function() {
    expect(4 + 4).toEqual(8);
  });
});

describe('Suite that fails', function() {
  it('2 plus 2 equals 4', function() {
    expect(2 + 2).toEqual(4);
  });
  it('3 plus 3 equals 6', function() {
    expect(3 + 4).toEqual(6);
  });
  /*
  it('99 plus 1 equals 2', function() {
    expect(99 + 1).toEqual(2);
    expect(56 + 1).toEqual(2);
    expect(11 + 1).toEqual(2);
    expect(34 + 1).toEqual(2);
  });
  */
});

describe('Suite that fails with test skipped', function() {
  it('2 plus 2 equals 4', function() {
    expect(2 + 2).toEqual(4);
  });
  xit('3 plus 3 equals 6', function() {
    expect(3 + 3).toEqual(6);
  });
  it('99 plus 1 equals 2', function() {
    expect(99 + 1).toEqual(2);
  });
});