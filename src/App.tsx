import { init, id } from "@instantdb/react";
import schema from "../instant.schema.ts";

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID!;

const db = init({ appId: APP_ID, schema });

function App() {
  const { isLoading, data, error } = db.useQuery({ todos: {} });
  if (isLoading) return null;
  if (APP_ID === "REPLACE_ME") return <MissingAppScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="p-4 space-y-4">
      <h2 className="space-x-2 flex">
        <img src="/instant.svg" alt="Instant Logo" className="w-5" />
        <span>instant-repro</span>
      </h2>
      <div className="space-y-4">
        <p>You've got data!</p>
        <pre className="text-sm bg-orange-100 max-w-xl p-3 max-h-96 overflow-y-scroll">
          {JSON.stringify(data, null, 2)}
        </pre>
        <div className="space-x-4">
          <button
            className="border border-blue-500 p-2 cursor-pointer"
            onClick={() => {
              db.transact(
                db.tx.todos[id()].update({ title: "Hello", body: "World" })
              );
            }}
          >
            Add a todo!
          </button>
          <button
            className="border border-red-500 p-2 cursor-pointer"
            onClick={() => {
              db.transact(
                data.todos.map((todo) => db.tx.todos[todo.id].delete())
              );
            }}
          >
            Delete all todos
          </button>
        </div>
        <div>
          Feel free to change this code base. Once you have a repro, or if you
          have questions, ping us on{" "}
          <a
            href="https://discord.com/invite/VU53p7uQcE"
            className="text-blue-500 underline"
          >
            Discord
          </a>
          .
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ error }: { error: { message: string } }) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🤕 Uh oh, we've got an error</h2>
      <p>Here's the message:</p>
      <pre className="text-sm bg-orange-100 max-w-xl p-3 max-h-96 overflow-y-scroll">
        {JSON.stringify(error, null, 2)}
      </pre>
      <p>
        If this isn't expected and we can help, share the details with us on{" "}
        <a
          href="https://discord.com/invite/VU53p7uQcE"
          className="text-blue-500 underline"
        >
          Discord
        </a>
        .
      </p>
    </div>
  );
}

function MissingAppScreen() {
  return (
    <div className="p-4 space-y-4 max-w-xl">
      <h1 className="text-xl font-bold inline-flex space-x-2">
        <img src="/instant.svg" alt="Instant Logo" className="w-5" />
        <span>Welcome to Instant's Repro App!</span>
      </h1>
      <p>
        To get started, head on over to your{" "}
        <a
          href="https://www.instantdb.com/dash"
          target="_blank"
          className="text-blue-500 underline"
        >
          Dashboard
        </a>{" "}
        and copy over your App ID.
      </p>
      <p>
        Set <code className="font-bold">`VITE_INSTANT_APP_ID`</code> in your
        <code className="font-bold">`.env`</code> file and refresh this page.
        Once done, you'll be ready to test!
      </p>
    </div>
  );
}

export default App;
