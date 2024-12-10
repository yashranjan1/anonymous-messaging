import { openai } from '@ai-sdk/openai';
import { streamText, APICallError } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {
    try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by a '||'. These are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing on universal themes that encourage friendly interactions. For example, your output should be structured like this: 'What is a hobby you recently started?||If you could have dinner with any historical figure, who would it be?||What is a simple thing that makes you happy?'. Ensure that the questions are intriguing and thought-provoking, and contribute to a positive and welcoming conversational environment.";

        const response = await streamText({
            model: openai('gpt-4o'),
            prompt,
            maxTokens: 200,
        })

        return response.toDataStreamResponse()

    } catch (error) {
        if (error instanceof APICallError) {
            const { url, statusCode, responseBody } = error;
            return NextResponse.json({
                success: false,
                message: `Error calling OpenAI API: ${url} ${statusCode} ${responseBody}`,
            }, {
                status: 500,
            });
        }
        return Response.json({
            success: false,
            message: "Error suggesting messages",
            error: error,
        }, {
            status: 500,
        });
    }
}