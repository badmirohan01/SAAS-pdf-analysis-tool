import { NextResponse } from "next/server"

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: Record<string, unknown>
    ) {
        super(message)
    }
}

export const handleApiError = (error: unknown): NextResponse => {
    console.log("API Error:", error)

    if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message, details: error.details }, { status: error.statusCode })
    }

    if (error instanceof Error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(
        { error: "An unknown error occured" },
        { status: 500 }
    )
}