import fetch, { Response } from "node-fetch";
import { map, mergeMap } from "rxjs/operators";
import { get } from "./utils";
import { forkJoin, of } from "rxjs";

/* 
Read data from https://swapi.dev/api/people/1 (Luke Skywalker)
and dependent data from swapi to return the following object

{
    name: 'Luke Skywalker',
    height: 172,
    gender: 'male',
    homeworld: 'Tatooine',
    films: [
        {
            title: 'A New Hope',
            director: 'George Lucas',
            release_date: '1977-05-25'
        },
        ... // and all other films
    ]
}

Define an interface of the result type above and all other types as well.
*/

interface Film {
  title: string;
  director: string;
  release_date: string;
}

export interface PersonInfo {
  name: string;
  height: number; // Correct type
  gender: string;
  homeworld: string;
  films: Film[];
}

interface Person {
  name: string;
  height: string; // From API, height is string
  gender: string;
  homeworld: string;
  films: string[];
}

// Task 1: Promise-based function
type PromiseBasedFunction = () => Promise<PersonInfo>;
export const getLukeSkywalkerInfo: PromiseBasedFunction = () => {
  return fetch("https://swapi.dev/api/people/1")
    .then((response: Response) => response.json())
    .then(async (person: Person) => {
      const homeworldResponse = await fetch(person.homeworld);
      const homeworldData = await homeworldResponse.json();

      const filmPromises = person.films.map((filmUrl) =>
        fetch(filmUrl).then((response) => response.json())
      );
      const filmsData = await Promise.all(filmPromises);

      return {
        name: person.name,
        height: parseInt(person.height, 10), // Convert string to number
        gender: person.gender,
        homeworld: homeworldData.name,
        films: filmsData.map((film) => ({
          title: film.title,
          director: film.director,
          release_date: film.release_date,
        })),
      };
    });
};

// Task 2: Async/Await-based function
type AsyncBasedFunction = () => Promise<PersonInfo>;
export const getLukeSkywalkerInfoAsync: AsyncBasedFunction = async () => {
  const response = await fetch("https://swapi.dev/api/people/1");
  const person: Person = await response.json();

  const homeworldResponse = await fetch(person.homeworld);
  const homeworldData = await homeworldResponse.json();

  const filmPromises = person.films.map(async (filmUrl: string) => {
    const filmResponse = await fetch(filmUrl);
    return await filmResponse.json();
  });
  const filmsData = await Promise.all(filmPromises);

  return {
    name: person.name,
    height: parseInt(person.height, 10), // Convert string to number
    gender: person.gender,
    homeworld: homeworldData.name,
    films: filmsData.map((film) => ({
      title: film.title,
      director: film.director,
      release_date: film.release_date,
    })),
  };
};

// Task 3: Observable-based function
export const getLukeSkywalkerInfoObservable = () => {
  return get<Person>("https://swapi.dev/api/people/1").pipe(
    mergeMap((person: Person) => {
      const homeworld$ = get<{ name: string }>(person.homeworld);
      const films$ = forkJoin(person.films.map((filmUrl) => get<Film>(filmUrl)));

      return forkJoin([homeworld$, films$]).pipe(
        map(([homeworldData, filmsData]) => ({
          name: person.name,
          height: parseInt(person.height, 10), // Convert string to number
          gender: person.gender,
          homeworld: homeworldData.name,
          films: filmsData.map((film) => ({
            title: film.title,
            director: film.director,
            release_date: film.release_date,
          })),
        }))
      );
    })
  );
};