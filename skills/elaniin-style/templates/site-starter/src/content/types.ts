/* One item of a collection. `placeholder: true` while its text is filler; set it to false when it becomes real text. */
export type Item = {
  slug: string;
  title: string;
  summary?: string; // do not invent one: leave it out when the brief has no description
  body: string[];
  image: { src: string; alt: string };
  placeholder: boolean;
};
