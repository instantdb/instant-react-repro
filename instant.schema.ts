import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    todos: i.entity({
      body: i.string(),
      title: i.string(),
    }),
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
