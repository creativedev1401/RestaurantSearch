let g = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');

// console.log(g);

class FluentRestaurants {
  constructor(jsonData) {
    this.data = jsonData;
  }

  fromState(stateStr) {
    let f = this.data.filter(function (obj) {
      return (obj.state === stateStr);
    });
    let newRes = new FluentRestaurants(f);
    return newRes;
  }

  ratingLeq(rating) {
    return new FluentRestaurants(this.data.filter((obj) => (obj.stars <= rating)));
  }

  ratingGeq(rating) {
    return new FluentRestaurants(this.data.filter((obj) => (obj.stars >= rating)));
  }

  category(categoryStr) {
    return new FluentRestaurants(this.data.filter((obj) => obj.categories.includes(categoryStr)));
  }

  hasAmbience(ambienceStr) { 
    return new FluentRestaurants(this.data.filter(function (obj) {
      if (obj.hasOwnProperty('attributes')) {
        if (obj.attributes.hasOwnProperty('Ambience')) {
          if (lib220.getProperty(obj.attributes.Ambience, ambienceStr).found) {
            if (lib220.getProperty(obj.attributes.Ambience, ambienceStr).value) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }));
  }
  bestPlace() {
    let maxStars = this.data.reduce(function (acc, elem) {
      if (elem.stars > acc) {
        return elem.stars;
      } else {
        return acc;
      }
    }, 0);
    let f = this.data.filter((x) => (x.stars === maxStars))
    if (f.length === 0) {
      return {};
    }
    if (f.length === 1) {
      return f[0];
    } else {
      let maxReviewCount = f.reduce(function (acc, elem) {
        if (elem.review_count > acc) {
          return elem.review_count;
        } else {
          return acc;
        }
      }, 0);
      let b = f.filter((x) => (x.review_count === maxReviewCount));
      return b[0];
    }
  }

  mostReviews() {
    let maxReviewCount = this.data.reduce(function (acc, elem) {
      if (elem.review_count > acc) {
        return elem.review_count;
      } else {
        return acc;
      }
    }, 0);
    let g = this.data.filter((x) => x.review_count === maxReviewCount);
    if (g.length === 0) {
      return {};
    } else if (g.length === 1) {
      return g[0];
    } else {
      let maxStars = this.data.reduce(function (acc, elem) {
        if (elem.stars > acc) {
          return elem;
        } else {
          return acc;
        }
      }, 0);
      let newRes = this.data.filter((x) => (x.stars === maxStars));
      if (newRes.length === 0) {
        return {};
      } else {
        return newRes[0];
      }
    }
  }
}

let f = new FluentRestaurants(g);

test('fromState works in giving all restaurants from the state', function () {
  let newRes = new FluentRestaurants(g);
  let newRes1 = newRes.fromState('NC');
  for (let i = 0; i < newRes1.data.length; ++i) {
    assert(newRes1.data[i].state === 'NC');
  }
})

test('Every Restaurant has lower rating', function () {
  let newRes = new FluentRestaurants(g);
  let newRes1 = newRes.ratingLeq(3);
  for (let i = 0; i < newRes1.data.length; ++i) {
    assert(newRes1.data[i].stars <= 3);
  }
})

test('Every Restaurant has higher rating', function () {
  let newRes = new FluentRestaurants(g);
  let newRes1 = newRes.ratingGeq(4);
  for (let i = 0; i < newRes1.data.length; ++i) {
    assert(newRes1.data[i].stars >= 4);
  }
})

test('Same category every time', function () {
  let newRes = new FluentRestaurants(g);
  let newRes1 = newRes.category('Parks');
  for (let i = 0; i < newRes1.data.length; ++i) {
    assert(newRes1.data[i].categories.includes('Parks'));
  }
  let newRes2 = newRes.category('Active Life');
  for (let i = 0; i < newRes1.data.length; ++i) {
    assert(newRes1.data[i].categories.includes('Active Life'));
  }
})

test('No other maxStars restaurant has more reviews', function () {
  let newRes = new FluentRestaurants(g);
  let newRes1 = newRes.bestPlace();
  assert(newRes1.stars === 5);
  for (let i = 0; i < newRes.data.length; ++i) {
    if (newRes.data[i].stars === 5) {
      assert(newRes.data[i].review_count <= newRes1.review_count);
    }
  }
})

test('No other place has more reviews', function () {
  let newRes = new FluentRestaurants(g);
  let newRes1 = newRes.mostReviews();
  for (let i = 0; i < newRes.data.length; ++i) {
    assert(newRes1.review_count >= newRes.data[i].review_count);
  }
})

