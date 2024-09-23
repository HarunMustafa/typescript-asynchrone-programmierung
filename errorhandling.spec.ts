import {
  PersonInfo,
  getLukeSkywalkerInfo,
  getLukeSkywalkerInfoAsync,
} from "./main";
jest.mock("node-fetch");
import fetch from "node-fetch";

// promise based
test("getLukeSkywalkerInfo when https://swapi.dev/api/people/1 api call fails, should return people error", (done) => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.reject(new Error("People call failed"));
    }
  });

  getLukeSkywalkerInfo().catch((error) => {
    expect(error.message).toBe("People call failed");
    done();
  });
});

test("getLukeSkywalkerInfo when https://swapi.dev/api/planets/1/ api call fails, should return homeworld error", (done) => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.resolve({ json: () => Promise.resolve(peopleCallback) });
    }

    if (url === "https://swapi.dev/api/planets/1/") {
      return Promise.reject(new Error("Homeworld call failed"));
    }

    if (url.startsWith("https://swapi.dev/api/films/")) {
      return Promise.resolve({ json: () => Promise.resolve(filmCallback) });
    }
  });

  getLukeSkywalkerInfo().catch((error) => {
    expect(error.message).toBe("Homeworld call failed");
    done();
  });
});

test("getLukeSkywalkerInfo when https://swapi.dev/api/films/1/ api call fails, should return Film 1 error", (done) => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.resolve({ json: () => Promise.resolve(peopleCallback) });
    }

    if (url === "https://swapi.dev/api/planets/1/") {
      return Promise.resolve({
        json: () => Promise.resolve(homeworldCallback),
      });
    }

    if (url === "https://swapi.dev/api/films/1/") {
      return Promise.reject(new Error("Film 1 call failed"));
    }

    if (url.startsWith("https://swapi.dev/api/films/")) {
      return Promise.resolve({ json: () => Promise.resolve(filmCallback) });
    }
  });

  getLukeSkywalkerInfo().catch((error) => {
    expect(error.message).toBe("Film 1 call failed");
    done();
  });
});

test("getLukeSkywalkerInfo when https://swapi.dev/api/films/6/ api call fails, should return Film 6 error", (done) => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.resolve({ json: () => Promise.resolve(peopleCallback) });
    }

    if (url === "https://swapi.dev/api/planets/1/") {
      return Promise.resolve({
        json: () => Promise.resolve(homeworldCallback),
      });
    }

    if (url === "https://swapi.dev/api/films/6/") {
      return Promise.reject(new Error("Film 6 call failed"));
    }

    if (url.startsWith("https://swapi.dev/api/films/")) {
      return Promise.resolve({ json: () => Promise.resolve(filmCallback) });
    }
  });

  getLukeSkywalkerInfo().catch((error) => {
    expect(error.message).toBe("Film 6 call failed");
    done();
  });
});

// async based
test("getLukeSkywalkerInfoAsync when https://swapi.dev/api/people/1 api call fails, should return people error", async () => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.reject(new Error("People call failed"));
    }
  });

  await expect(getLukeSkywalkerInfoAsync()).rejects.toThrow(
    "People call failed"
  );
});

test("getLukeSkywalkerInfoAsync when https://swapi.dev/api/planets/1/ api call fails, should return homeworld error", async () => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.resolve({ json: () => Promise.resolve(peopleCallback) });
    }

    if (url === "https://swapi.dev/api/planets/1/") {
      return Promise.reject(new Error("Homeworld call failed"));
    }

    if (url.startsWith("https://swapi.dev/api/films/")) {
      return Promise.resolve({ json: () => Promise.resolve(filmCallback) });
    }
  });

  await expect(getLukeSkywalkerInfoAsync()).rejects.toThrow(
    "Homeworld call failed"
  );
});

test("getLukeSkywalkerInfoAsync when https://swapi.dev/api/films/1/ api call fails, should return Film 1 error", async () => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.resolve({ json: () => Promise.resolve(peopleCallback) });
    }

    if (url === "https://swapi.dev/api/planets/1/") {
      return Promise.resolve({
        json: () => Promise.resolve(homeworldCallback),
      });
    }

    if (url === "https://swapi.dev/api/films/1/") {
      return Promise.reject(new Error("Film 1 call failed"));
    }

    if (url.startsWith("https://swapi.dev/api/films/")) {
      return Promise.resolve({ json: () => Promise.resolve(filmCallback) });
    }
  });

  await expect(getLukeSkywalkerInfoAsync()).rejects.toThrow(
    "Film 1 call failed"
  );
});

test("getLukeSkywalkerInfoAsync when https://swapi.dev/api/films/6/ api call fails, should return Film 6 error", async () => {
  (fetch as unknown as jest.Mock<any, any>).mockImplementation((url) => {
    if (url === "https://swapi.dev/api/people/1") {
      return Promise.resolve({ json: () => Promise.resolve(peopleCallback) });
    }

    if (url === "https://swapi.dev/api/planets/1/") {
      return Promise.resolve({
        json: () => Promise.resolve(homeworldCallback),
      });
    }

    if (url === "https://swapi.dev/api/films/6/") {
      return Promise.reject(new Error("Film 6 call failed"));
    }

    if (url.startsWith("https://swapi.dev/api/films/")) {
      return Promise.resolve({ json: () => Promise.resolve(filmCallback) });
    }
  });

  await expect(getLukeSkywalkerInfoAsync()).rejects.toThrow(
    "Film 6 call failed"
  );
});

const peopleCallback = {
  name: "Luke Skywalker",
  height: "172",
  gender: "male",
  homeworld: "https://swapi.dev/api/planets/1/",
  films: [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/2/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/6/",
  ],
};

const homeworldCallback = {
  name: "Tatooine",
};

const filmCallback = {
  title: "A New Hope",
  director: "George Lucas",
  release_date: "1977-05-25",
};