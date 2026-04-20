/**
 * LLM Providers TRPC router
 * Handles API calls to various LLM providers (Meta, Groq, Together, Hugging Face)
 */

import { z } from "zod"
import { callMeta, toMetaMessages, META_MODELS } from "../../llm-providers/meta"
import { callGroq, toGroqMessages, GROQ_MODELS } from "../../llm-providers/groq"
import { callTogether, toTogetherMessages, TOGETHER_MODELS } from "../../llm-providers/together"
import { callHuggingFace, toHuggingFaceMessages, HUGGINGFACE_MODELS } from "../../llm-providers/huggingface"
import { publicProcedure, router } from "../index"

export const llmProvidersRouter = router({
  /**
   * Get available models from all providers
   */
  getModels: publicProcedure.query(async () => {
    return {
      meta: META_MODELS,
      groq: GROQ_MODELS,
      together: TOGETHER_MODELS,
      huggingface: HUGGINGFACE_MODELS,
    }
  }),

  /**
   * Call Meta LLaMA API
   */
  callMeta: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        model: z.string(),
        messages: z.array(z.object({ role: z.string(), content: z.string() })),
        temperature: z.number().optional(),
        maxTokens: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const messages = toMetaMessages(input.messages)
      return await callMeta(input.apiKey, input.model, messages, {
        temperature: input.temperature,
        maxTokens: input.maxTokens,
      })
    }),

  /**
   * Call Groq API
   */
  callGroq: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        model: z.string(),
        messages: z.array(z.object({ role: z.string(), content: z.string() })),
        temperature: z.number().optional(),
        maxTokens: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const messages = toGroqMessages(input.messages)
      return await callGroq(input.apiKey, input.model, messages, {
        temperature: input.temperature,
        maxTokens: input.maxTokens,
      })
    }),

  /**
   * Call Together AI API
   */
  callTogether: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        model: z.string(),
        messages: z.array(z.object({ role: z.string(), content: z.string() })),
        temperature: z.number().optional(),
        maxTokens: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const messages = toTogetherMessages(input.messages)
      return await callTogether(input.apiKey, input.model, messages, {
        temperature: input.temperature,
        maxTokens: input.maxTokens,
      })
    }),

  /**
   * Call Hugging Face API
   */
  callHuggingFace: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        model: z.string(),
        messages: z.array(z.object({ role: z.string(), content: z.string() })),
        temperature: z.number().optional(),
        maxTokens: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const messages = toHuggingFaceMessages(input.messages)
      return await callHuggingFace(input.apiKey, input.model, messages, {
        temperature: input.temperature,
        maxTokens: input.maxTokens,
      })
    }),
})
