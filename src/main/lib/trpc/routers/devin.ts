/**
 * Devin Cloud TRPC Router
 * Handles Devin Cloud API interactions
 */

import { z } from "zod"
import { publicProcedure, router } from "../index"
import {
  callDevinAPI,
  createDevinSession,
  getDevinSession,
  listDevinRepos,
  convertToDevinMessages,
  DEVIN_MODELS,
} from "../../llm-providers/devin"

export const devinRouter = router({
  /**
   * Get available Devin models
   */
  getModels: publicProcedure.query(() => {
    return DEVIN_MODELS
  }),

  /**
   * Call Devin Cloud API for chat completion
   */
  chat: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        organizationId: z.string().optional(),
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          })
        ),
        sessionId: z.string().optional(),
        context: z
          .object({
            repository: z.string().optional(),
            branch: z.string().optional(),
            files: z.array(z.string()).optional(),
          })
          .optional(),
        options: z
          .object({
            temperature: z.number().min(0).max(2).optional(),
            maxTokens: z.number().positive().optional(),
            tools: z.array(z.string()).optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const devinMessages = convertToDevinMessages(input.messages)

      const response = await callDevinAPI(input.apiKey, {
        messages: devinMessages,
        session_id: input.sessionId,
        context: input.context,
        options: input.options,
      }, input.organizationId)

      return response
    }),

  /**
   * Create a new Devin session
   */
  createSession: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        organizationId: z.string().optional(),
        context: z
          .object({
            repository: z.string().optional(),
            branch: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const session = await createDevinSession(
        input.apiKey,
        input.organizationId,
        input.context
      )

      return session
    }),

  /**
   * Get Devin session details
   */
  getSession: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        sessionId: z.string(),
        organizationId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const session = await getDevinSession(
        input.apiKey,
        input.sessionId,
        input.organizationId
      )

      return session
    }),

  /**
   * List available repositories
   */
  listRepos: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        organizationId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const repos = await listDevinRepos(input.apiKey, input.organizationId)

      return repos
    }),

  /**
   * Execute Devin agent skill (tool)
   */
  executeSkill: publicProcedure
    .input(
      z.object({
        apiKey: z.string(),
        organizationId: z.string().optional(),
        skill: z.enum([
          "read_wiki_structure",
          "read_wiki_contents",
          "ask_question",
          "list_available_repos",
          "devin_session_create",
          "devin_session_search",
          "devin_session_interact",
          "devin_session_events",
          "devin_session_gather",
          "devin_playbook_manage",
          "devin_knowledge_manage",
          "devin_schedule_manage",
          "list_integrations",
        ]),
        parameters: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const baseUrl = input.organizationId
        ? `https://api.devin.ai/v3/organizations/${input.organizationId}`
        : "https://api.devin.ai/v3"

      const response = await fetch(`${baseUrl}/skills/${input.skill}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${input.apiKey}`,
        },
        body: JSON.stringify(input.parameters || {}),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Devin API error: ${response.status} - ${error}`)
      }

      return response.json()
    }),
})
