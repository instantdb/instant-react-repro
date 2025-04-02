import { init as initAdmin } from "@instantdb/admin"
import { id, init } from "@instantdb/react"
import { useEffect, useState } from "react"
import schema from "../instant.schema.ts"

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID!
const ADMIN_TOKEN = import.meta.env.VITE_INSTANT_ADMIN_TOKEN!

const db = init({ appId: APP_ID, schema })
const adminDb = initAdmin({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
    schema
})

function App() {
    const [token, setToken] = useState<string | null>(null)
    const { data } = db.useQuery({ todos: {} })
    const { user } = db.useAuth()

    useEffect(() => {
        adminDb.auth
            .createToken("test@test.com")
            .then((token) => {
                setToken(token)
            })
            .catch((err) => {
                console.error("Error creating token:", err)
            })
    }, [])

    useEffect(() => {
        if (!token) return

        db.auth.signInWithToken(token)
    }, [token])

    const createTodo = () => {
        db.transact([
            db.tx.todos[id()].update({
                userId: user?.id,
                title: "todo"
            })
        ])
    }

    return (
        <div className="container flex flex-col items-center justify-center gap-4 p-4">
            <h1>Todos</h1>
            <h2>{user?.email}</h2>
            <button
                type="button"
                onClick={createTodo}
                className="cursor-pointer bg-blue-500 px-4 py-2 text-white"
            >
                Create Todo
            </button>

            {data?.todos.map((todo) => (
                <div
                    key={todo.id}
                    className="flex w-full max-w-md items-center justify-between rounded bg-gray-100 p-4"
                >
                    <p>{todo.title}</p>
                    <button
                        type="button"
                        onClick={() => {
                            db.transact([db.tx.todos[todo.id].delete()])
                        }}
                        className="cursor-pointer bg-red-500 px-4 py-2 text-sm text-white"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}

export default App
